import { usePineappleStore } from '@/stores/Pineapplestore';
import { randomIntFromRange } from './randomIntRange';
const pineappleStore = usePineappleStore();

export class Pineapple {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    pineappleRatio: number;
    boomRatio: number;
    isSet: boolean;
    isBoom: boolean;
    boomAnimate: string;
    bodyStart: { x: number, y: number };
    arrBody: { cx: number, cy: number, ex: number, ey: number }[];
    leafStart: { x: number, y: number };
    arrLeaf: { cx: number, cy: number, ex: number, ey: number }[];
    boomArrange: { x: number; y: number; r: number; directionX: number, directionY: number, maxH: number}[];
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.pineappleRatio = 2; // 菠萝运动速度
        this.boomRatio = 4;
        this.isSet = false;
        this.isBoom = false;
        this.boomAnimate = 'disappear';
        
        // 菠萝身坐标
        this.bodyStart = { x: 140, y: 190 };
        this.arrBody = [
            { cx: 150, cy: 200, ex: 140, ey: 190 },
            { cx: 115, cy: 150, ex: 120, ey: 120 },
            { cx: 125, cy: 100, ex: 150, ey: 100 },
            { cx: 160, cy: 100, ex: 165, ey: 105 },
            { cx: 200, cy: 130, ex: 200, ey: 150 },
            { cx: 205, cy: 175, ex: 180, ey: 190 },
            { cx: 160, cy: 200, ex: 145, ey: 195 },
        ];

        // 菠萝叶坐标
        this.leafStart = { x: this.arrBody[1].ex, y: this.arrBody[1].ey };
        this.arrLeaf = [
            { cx: 110, cy: 110, ex: 100, ey: 110 },
            { cx: 110, cy: 100, ex: 130, ey: 105 },
            { cx: 130, cy: 80, ex: 155, ey: 85 },
            { cx: 145, cy: 90, ex: 145, ey: 100 },
        ];

        // 粒子坐标
        this.boomArrange = [];
    }

    pineappleRender(): void {
        if (!this.ctx || this.isBoom) {
            return;
        }

        // this.pineappleSetPos();
        this.drawBody();
        this.drawLeaf();
    }
    
    // 重设菠萝生成坐标
    pineappleSetPos(): void {
        if (this.isSet) {
            return;
        }

        const randomX = randomIntFromRange(-this.bodyStart.x + 50, this.canvas.width - 250);
        const stepX = randomX;
        const stepY = -200;

        this.bodyStart.x += stepX;
        this.bodyStart.y += stepY;
        this.arrBody.map((item) => {
            item.cx += stepX;
            item.cy += stepY;
            item.ex += stepX;
            item.ey += stepY;
        });
        
        this.leafStart.x += stepX;
        this.leafStart.y += stepY;
        this.arrLeaf.map((item) => {
            item.cx += stepX;
            item.cy += stepY;
            item.ex += stepX;
            item.ey += stepY;
        });

        this.isSet = true;
    }

    // 生成菠萝身
    drawBody(): void {
        this.ctx.beginPath();
        this.ctx.moveTo(this.bodyStart.x, this.bodyStart.y);
        for (let i = 0; i < this.arrBody.length; i++) {
            this.ctx.quadraticCurveTo(this.arrBody[i].cx, this.arrBody[i].cy, this.arrBody[i].ex, this.arrBody[i].ey);
        }
        this.ctx.closePath();
        this.ctx.lineWidth = 5;
        let bodyGradient = this.ctx.createLinearGradient(this.bodyStart.x, this.bodyStart.y, this.arrBody[1].ex, this.arrBody[1].ey);
        bodyGradient.addColorStop(0, '#ecb732');
        bodyGradient.addColorStop(0.5, '#f7d336'); 
        bodyGradient.addColorStop(1, '#ffd859');
        this.ctx.fillStyle = bodyGradient;
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();
        this.ctx.fill();
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
    }

    // 菠萝运动轨迹
    pineappleUpdated(): void {
        if (this.isBoom) {
            return;
        }
        
        // 加速度
        this.pineappleRatio *= 0.99;
        this.pineappleRatio += 0.25;
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
        // 生成一次
        if (this.isBoom) {
            return;
        }
        this.isBoom = true;
        // 两点中心坐标
        const boomCenterX = (this.arrBody[1].cx + this.arrBody[5].cx) / 2;
        const boomCenterY = (this.arrBody[1].cy + this.arrBody[5].cy) / 2;

        for (let i = 0; i < 10; i++) {
            const randomX = randomIntFromRange(this.arrBody[1].cx - boomCenterX, this.arrBody[5].cx - boomCenterX);
            const randomY = randomIntFromRange(-10, 50);
            const r = randomIntFromRange(1, 4);
            const x = boomCenterX + randomX;
            const y = boomCenterY + randomY;
            const directionX = boomCenterX > x ? -1 : 1;
            const directionY = -1;
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

        // 伪随机两种效果
        if (Math.random() >= 0.5) {
            this.boomAnimate = 'collapse';
        }
        else {
            this.boomAnimate = 'disappear';
        }
    }

    // 绘制粒子
    drawBoom(): void { 
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
        
        if (this.boomRatio <= 0) {
            this.remove();
            this.boomRatio = 0;
        }

        this.boomRatio -= 0.1;
        const act = this.boomAct();
        act['collapse']();
    }

    boomAct(): { [key: string]: () => void } {
        return {
            'collapse': ():void => {
                this.boomArrange.map((item) => {
                    item.x += item.directionX * this.boomRatio;
                    if (item.y < item.maxH && item.directionY === -1) {
                        item.directionY = 0.001;
                    }
                    item.y += item.directionY * this.boomRatio;
                    // item.r = item.r - 0.08 < 0 ? 0 : item.r - 0.08;
                });
            },
            'disappear': ():void => {
                this.boomArrange.map((item) => {
                    item.x += item.directionX * this.boomRatio;
                    item.y += item.directionY * this.boomRatio;
                    item.r = item.r - 0.08 < 0 ? 0 : item.r - 0.08;
                });
            }
        }
    }

    remove(): void {
        pineappleStore.pineappleArr.splice(0, 1);
    }
}