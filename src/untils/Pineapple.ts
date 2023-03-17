import { usePineappleStore } from '@/stores/Pineapplestore';
import { randomIntFromRange } from './randomRange';
const pineappleStore = usePineappleStore();

export class Pineapple {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    ratio: number;
    isSet: boolean;
    bodyStart: { x: number, y: number };
    arrBody: { cx: number, cy: number, ex: number, ey: number }[];
    leafStart: { x: number, y: number };
    arrLeaf: { cx: number, cy: number, ex: number, ey: number }[];
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        // 菠萝身
        this.ctx = ctx;
        this.canvas = canvas;
        this.ratio = 2;
        this.isSet = false;
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
        // 菠萝叶
        this.leafStart = { x: this.arrBody[1].ex, y: this.arrBody[1].ey };
        this.arrLeaf = [
            { cx: 110, cy: 110, ex: 100, ey: 110 },
            { cx: 110, cy: 100, ex: 130, ey: 105 },
            { cx: 130, cy: 80, ex: 155, ey: 85 },
            { cx: 145, cy: 90, ex: 145, ey: 100 },
        ];
    }

    render(): void {
        if (!this.ctx) {
            return;
        }

        this.setPos();
        this.drawBody();
        this.drawLeaf();
    }

    drawBody(): void {
        // 菠萝身
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

    drawLeaf(): void {
        // 菠萝叶
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

    drawBoom(): void {
        // 粉碎粒子效果
        
    }

    setPos(): void {
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
    
    updated(): void {
        this.ratio *= 0.99;
        this.ratio += 0.25;
        const stepY = this.ratio;

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

    remove(): void {
        pineappleStore.pineappleArr.splice(0, 1);
    }
}