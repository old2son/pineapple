export class Canvasbg {
    
    constructor(public ctx: CanvasRenderingContext2D, public canvas: HTMLCanvasElement, private obj: { [key: string]: string }) {
        this.create();
    }
    
    create() {
        const img = new Image();
        img.src = this.obj.imgBg;
        img.onload = () => {
            
        };

        let offsetX = this.canvas.width;
        let offsetY = this.canvas.height;
        let moveStepX = 5;
        let moveStepY = moveStepX / 2;
        let flag = false;

        const animate = () => {
            // if (offsetX <= -img.width) {
            //     cancelAnimationFrame(step);
            //     return;
            // }

            offsetX -= moveStepX;
            offsetY -= moveStepY;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, offsetX, offsetY, img.width, img.height);
            this.ctx.drawImage(img, offsetX + this.canvas.width - 200, offsetY + this.canvas.height - 200, img.width, img.height);
            requestAnimationFrame(animate);
        }

        let step = requestAnimationFrame(animate);
    }
}