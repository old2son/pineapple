import { usePineappleStore } from '@/stores/Pineapplestore';
import { randomIntFromRange, randomFloatFromRange } from '@/untils/randomRange';
import sound from '@/assets/sounds/splatter.mp3';

const pineappleStore = usePineappleStore();
const initWorker = () => {
    if (window.Worker) {
        myWorker = new Worker(new URL('@/components/scripts/wokerPineapple.ts', import.meta.url), {
            type: 'module',
        });
    }
}
let myWorker: Worker;
initWorker();

export class Pineapple {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    pineappleRatio: number;
    boomRatio: number;
    isSetPineapple: boolean;
    isSetBoom: boolean;
    isBoom: boolean;
    boomAnimate: string;
    bodyStart: { x: number, y: number };
    arrBody: { cx: number, cy: number, ex: number, ey: number }[];
    leafStart: { x: number, y: number };
    arrLeaf: { cx: number, cy: number, ex: number, ey: number }[];
    boomArrange: { x: number; y: number; r: number; directionX: number, directionY: number, maxH: number}[];
    angle: number;
    commonSpeed: number;
    sec: number;
    isRemove: boolean;
    index: number | null;
    itemSpeed: number;
    mouseX: number | null;
    mouseY: number | null;
    isBoomSound: boolean;
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.pineappleRatio = 2; // 菠萝运动速度
        this.boomRatio = 4;
        this.isSetPineapple = false;
        this.isSetBoom = false;
        this.isBoom = false;
        this.isBoomSound = false;
        this.boomAnimate = Math.random() >= 0.5 ? 'collapse' : 'disappear';
        this.angle = 0; // Math.PI 为180度
        this.commonSpeed = 0.05;
        this.sec = 500;
        this.isRemove = false;
        this.index = null;
        this.itemSpeed = randomFloatFromRange(1, 3);
        this.mouseX = null;
        this.mouseY = null;

        // 菠萝身坐标
        this.bodyStart = { x: 140, y: -110 };
        this.arrBody = [
            { cx: 150, cy: -100, ex: 140, ey: -110 },
            { cx: 115, cy: -150, ex: 120, ey: -180 },
            { cx: 125, cy: -200, ex: 150, ey: -200 },
            { cx: 160, cy: -200, ex: 165, ey: -195 },
            { cx: 200, cy: -170, ex: 200, ey: -150 },
            { cx: 205, cy: -125, ex: 180, ey: -110 },
            { cx: 160, cy: -100, ex: 145, ey: -105 },
        ];

        // 菠萝叶坐标
        this.leafStart = { x: this.arrBody[1].ex, y: this.arrBody[1].ey };
        this.arrLeaf = [
            { cx: 110, cy: -190, ex: 100, ey: -190 },
            { cx: 110, cy: -200, ex: 130, ey: -195 },
            { cx: 130, cy: -220, ex: 155, ey: -215 },
            { cx: 145, cy: -210, ex: 145, ey: -200 },
        ];


        // 测试用
        // this.ctx = ctx;
        // this.bodyStart = { x: 140, y: 190 };
        // this.arrBody = [
        //     { cx: 150, cy: 200, ex: 140, ey: 190 },
        //     { cx: 115, cy: 150, ex: 120, ey: 120 },
        //     { cx: 125, cy: 100, ex: 150, ey: 100 },
        //     { cx: 160, cy: 100, ex: 165, ey: 105 },
        //     { cx: 200, cy: 130, ex: 200, ey: 150 },
        //     { cx: 205, cy: 175, ex: 180, ey: 190 },
        //     { cx: 160, cy: 200, ex: 145, ey: 195 },
        // ];
        // this.leafStart = { x: this.arrBody[1].ex, y: this.arrBody[1].ey };
        // this.arrLeaf = [
        //     { cx: 110, cy: 110, ex: 100, ey: 110 },
        //     { cx: 110, cy: 100, ex: 130, ey: 105 },
        //     { cx: 130, cy: 80, ex: 155, ey: 85 },
        //     { cx: 145, cy: 90, ex: 145, ey: 100 },
        // ];

        // 粒子坐标
        this.boomArrange = [];
    }

    pineappleRender(): void {
        if (!this.ctx || this.isBoom) {
            return;
        }

        this.pineappleSetPos();
        this.drawBody();
        this.drawLeaf();
    }
    
    // 重设菠萝生成坐标
    pineappleSetPos(): void {
        if (this.isSetPineapple) {
            return;
        }

        myWorker.postMessage(
            JSON.stringify({
                body: this.arrBody,
                leaf: this.arrLeaf,
                bodyStart: this.bodyStart,
                leafStart: this.leafStart,
                canvasWidth: this.canvas.width,
                type: 'setPos'
            })
        );

        myWorker.onmessage = (e) => {
            const { body, leaf, bodyStart, leafStart } = JSON.parse(e.data);
            this.arrBody = body;
            this.arrLeaf = leaf;
            this.bodyStart = bodyStart;
            this.leafStart = leafStart;
        };

        this.isSetPineapple = true;
    }

    // 生成菠萝身
    drawBody(): void {
        this.ctx.beginPath();
        this.ctx.moveTo(this.bodyStart.x, this.bodyStart.y);
        for (let i = 0; i < this.arrBody.length; i++) {
            this.ctx.quadraticCurveTo(this.arrBody[i].cx, this.arrBody[i].cy, this.arrBody[i].ex, this.arrBody[i].ey);
        }
        this.ctx.lineWidth = 5;
        let bodyGradient = this.ctx.createLinearGradient(this.bodyStart.x, this.bodyStart.y, this.arrBody[1].ex, this.arrBody[1].ey);
        bodyGradient.addColorStop(0, '#ecb732');
        bodyGradient.addColorStop(0.5, '#f7d336'); 
        bodyGradient.addColorStop(1, '#ffd859');
        this.ctx.fillStyle = bodyGradient;
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();

        // 击中🍍
        if (this.mouseX !== null && this.mouseY !== null) {
            const isHit = this.ctx.isPointInPath(this.mouseX, this.mouseY) || this.ctx.isPointInStroke(this.mouseX, this.mouseY);

            if (isHit) {
                console.log('🍍！')
                this.isBoom = true;
            }
        }
    }

    // 生成菠萝叶
    drawLeaf(): void {
        this.ctx.beginPath();
        this.ctx.moveTo(this.leafStart.x, this.leafStart.y);
        for (let i = 0; i < this.arrLeaf.length; i++) {
            this.ctx.quadraticCurveTo(this.arrLeaf[i].cx, this.arrLeaf[i].cy, this.arrLeaf[i].ex, this.arrLeaf[i].ey);
        }
        this.ctx.lineWidth = 5;
        let leafGradient = this.ctx.createLinearGradient(this.leafStart.x, this.leafStart.y, this.arrLeaf[2].ex, this.arrLeaf[2].ey);
        leafGradient.addColorStop(0, '#51a256');
        leafGradient.addColorStop(0.5, '#51a256');
        leafGradient.addColorStop(1, '#8ae99c');
        this.ctx.fillStyle = leafGradient;
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();

        // 击中🍃
        if (this.mouseX !== null && this.mouseY !== null) {
            const isHit = this.ctx.isPointInPath(this.mouseX, this.mouseY) || this.ctx.isPointInStroke(this.mouseX, this.mouseY);

            if (isHit) {
                console.log('🍃！')
                this.isBoom = true;
            }
        }
    }

    // 菠萝运动轨迹
    pineappleUpdated(i: number | null = null): void {
        this.pineappleRender();
        
        // 只有第一次进入时才会记录下标
        if (this.index === null && i !== null) {
            this.index = i;
        }

        if (this.isBoom) {
            this.boomUpdated();
            this.boomSound();
            return;
        }

        // 菠萝运动到底部时爆炸
        if (this.arrBody[0].ey > this.canvas.height) {
            this.isBoom = true;
            this.boomSound();
            return;
        }

        this.pineappleRatio *= 0.99;    // 加速度
        this.pineappleRatio += this.commonSpeed;   // 重力
        const stepY = this.pineappleRatio;

        this.bodyStart.y += stepY;
        this.arrBody.map((item) => {
            item.cy += stepY;
            item.ey += stepY;
        });

        this.leafStart.y += stepY;
        this.arrLeaf.map((item) => {
            item.cy += stepY;
            item.ey += stepY;
        });
    }

    // 初始化粒子坐标
    boomRender(): void {
        if (!this.ctx || !this.isBoom) {
            return;
        }
        
        this.drawBoom();
    }

    // 绘制粒子
    drawBoom(): void { 
        // 确定坐标,只生成一次
        if (!this.isSetBoom) {
            // 两点中心坐标
            const boomCenterX = (this.arrBody[1].cx + this.arrBody[5].cx) / 2;
            const boomCenterY = (this.arrBody[1].cy + this.arrBody[5].cy) / 2;

            for (let i = 0; i < 10; i++) {
                const randomX = randomIntFromRange(this.arrBody[1].cx - boomCenterX, this.arrBody[5].cx - boomCenterX);
                const randomY = randomIntFromRange(-10, 50);
                const r = randomIntFromRange(1, 4);
                const x = boomCenterX + randomX;
                const y = boomCenterY + randomY;
                const directionX = boomCenterX > x ? -1 : 1; // 向左或向右
                const directionY = -1; // 向上
                const maxH = y - 50;

                this.boomArrange.push({
                    x,
                    y,
                    r,
                    directionX,
                    directionY,
                    maxH
                });
            }
            this.isSetBoom = true;
        }
        
        this.boomArrange.forEach(current => {
            this.ctx.beginPath();
            this.ctx.arc(current.x, current.y, current.r, 0, 360 * Math.PI / 180);
            this.ctx.fillStyle = '#000';
            this.ctx.fill();
            this.ctx.closePath();
        });
    }

    // 粒子轨迹
    boomUpdated(): void {
        // todo: 粒子动画
        if (!this.isBoom) {
            return;
        }

        this.boomRender();
        
        if (this.boomRatio <= 0) {
            this.remove();
            this.boomRatio = 0;
            return;
        }

        this.boomRatio -= this.commonSpeed;
        const act = this.boomAct();
        act[this.boomAnimate]();
    }

    boomAct(): { [key: string]: () => void } {
        return {
            'collapse': ():void => {
                const radius = 2;
                const angleSpeed = 0.02;
                this.boomArrange.map((item) => {
                    item.x = item.x + Math.cos(this.angle) * (radius * item.directionX) + (this.itemSpeed * item.directionX);
                    item.y = item.y + Math.sin(this.angle) * radius - this.itemSpeed;
                    item.r = item.r - this.commonSpeed < 0 ? 0 : item.r - this.commonSpeed;
                });
                this.angle += angleSpeed;
            },
            'disappear': ():void => {
                this.boomArrange.map((item) => {
                    item.x += item.directionX * this.boomRatio;
                    item.y += item.directionY * this.boomRatio;
                    item.r = item.r - this.commonSpeed < 0 ? 0 : item.r - this.commonSpeed;
                });
            }
        }
    }

    remove(): void {
        if (!this.isRemove) {
            this.isRemove = true;
        }

        // length >= 20 防止 🍍 删除闪烁
        if (pineappleStore.pineappleArr.length >= 20 && this.index !== null) { 
            pineappleStore.pineappleArr.splice(this.index, 1);
        }
    }

     // 菠萝声效
     boomSound(): void {
        if (this.isBoomSound) {
            return;
        }
        this.isBoomSound = true;
        const audio = new Audio(sound);
        audio.volume = 0.2;
        audio.play();
    }

    // 接受鼠标位置判断 isPointInPath
    receviceMousePos(mouseX: number | null = null, mouseY: number | null = null): void {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }
}