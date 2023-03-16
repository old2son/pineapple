<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { Pineapple } from '@/untils/Pineapple';

const pineappleStore = usePineappleStore();
const $canvas = ref();
let ctx: CanvasRenderingContext2D;
let step: number;

document.body.addEventListener('click', () => {
    pineappleStore.increment();
});

onMounted(() => {
    $canvas.value.width = window.innerWidth;
    $canvas.value.height = window.innerHeight;
    ctx = $canvas.value.getContext('2d');
    pineappleStore.pineappleArr.push(new Pineapple(ctx));
    step = requestAnimationFrame(draw);
});

const draw = () => {
    ctx.clearRect(0, 0, $canvas.value.width, $canvas.value.height);
    console.log('step');

    if (!pineappleStore.pineappleArr.length || !pineappleStore.pineappleArr[0]) {
        console.log('end')
        cancelAnimationFrame(step);
        return;
    }

    let current = pineappleStore.pineappleArr[0];
    current.updated();
    current.render();
    
    // 边际检测
    if (current.arrBody[0].ey > $canvas.value.height) {
        current.remove();
    }
    step = requestAnimationFrame(draw);
};

// const pineapple = (ctx: CanvasRenderingContext2D) => {

//     // 菠萝身
//     let bodyStart = { x: 140, y: 190 };
//     let arrBody = [
//         { cx: 150, cy: 200, ex: 140, ey: 190 },
//         { cx: 115, cy: 150, ex: 120, ey: 120 },
//         { cx: 125, cy: 100, ex: 150, ey: 100 },
//         { cx: 160, cy: 100, ex: 165, ey: 105 },
//         { cx: 200, cy: 130, ex: 200, ey: 150 },
//         { cx: 205, cy: 175, ex: 180, ey: 190 },
//         { cx: 160, cy: 200, ex: 145, ey: 195 },
//     ];
//     ctx.beginPath();
//     ctx.moveTo(bodyStart.x, bodyStart.y);
//     ctx.quadraticCurveTo(arrBody[0].cx, arrBody[0].cy, arrBody[0].ex, arrBody[0].ey);
//     ctx.quadraticCurveTo(arrBody[1].cx, arrBody[1].cy, arrBody[1].ex, arrBody[1].ey);
//     ctx.quadraticCurveTo(arrBody[2].cx, arrBody[2].cy, arrBody[2].ex, arrBody[2].ey);
//     ctx.quadraticCurveTo(arrBody[3].cx, arrBody[3].cy, arrBody[3].ex, arrBody[3].ey);
//     ctx.quadraticCurveTo(arrBody[4].cx, arrBody[4].cy, arrBody[4].ex, arrBody[4].ey);
//     ctx.quadraticCurveTo(arrBody[5].cx, arrBody[5].cy, arrBody[5].ex, arrBody[5].ey);
//     ctx.quadraticCurveTo(arrBody[6].cx, arrBody[6].cy, arrBody[6].ex, arrBody[6].ey);
//     ctx.closePath();
//     ctx.lineWidth = 5;
//     let bodyGradient = ctx.createLinearGradient(bodyStart.x, bodyStart.y, arrBody[1].ex, arrBody[1].ey);
//     bodyGradient.addColorStop(0, '#ecb732');
//     bodyGradient.addColorStop(0.5, '#f7d336'); 
//     bodyGradient.addColorStop(1, '#ffd859');
//     ctx.fillStyle = bodyGradient;
//     ctx.stroke();
//     ctx.fill();

//     // 菠萝叶
//     let leafStart = { x: arrBody[1].ex, y: arrBody[1].ey };
//     let arrLeaf = [
//         { cx: 110, cy: 110, ex: 100, ey: 110 },
//         { cx: 110, cy: 100, ex: 130, ey: 105 },
//         { cx: 130, cy: 80, ex: 155, ey: 85 },
//         { cx: 145, cy: 90, ex: 145, ey: 100 },
//     ];
//     ctx.beginPath();
//     ctx.moveTo(leafStart.x, leafStart.y);
//     ctx.quadraticCurveTo(arrLeaf[0].cx, arrLeaf[0].cy, arrLeaf[0].ex, arrLeaf[0].ey);
//     ctx.quadraticCurveTo(arrLeaf[1].cx, arrLeaf[1].cy, arrLeaf[1].ex, arrLeaf[1].ey);
//     ctx.quadraticCurveTo(arrLeaf[2].cx, arrLeaf[2].cy, arrLeaf[2].ex, arrLeaf[2].ey);
//     ctx.quadraticCurveTo(arrLeaf[3].cx, arrLeaf[3].cy, arrLeaf[3].ex, arrLeaf[3].ey);
//     // ctx.closePath();
//     ctx.lineWidth = 5;
//     let leafGradient = ctx.createLinearGradient(leafStart.x, leafStart.y, arrLeaf[2].ex, arrLeaf[2].ey);
//     leafGradient.addColorStop(0, '#51a256');
//     leafGradient.addColorStop(0.5, '#51a256');
//     leafGradient.addColorStop(1, '#8ae99c');
//     ctx.fillStyle = leafGradient;
//     ctx.stroke();
//     ctx.fill();
//     ctx.closePath();

//     // 菠萝前身
//     // ctx.beginPath();
//     // ctx.arc(150, 150, 50, 0, 80 * Math.PI / 180);
//     // ctx.quadraticCurveTo(150, 200, 140, 190);
//     // ctx.quadraticCurveTo(115, 150, 120, 120);
//     // ctx.quadraticCurveTo(125, 100, 150, 100);
//     // ctx.quadraticCurveTo(160, 100, 165, 105);
//     // ctx.quadraticCurveTo(200, 130, 200, 150);
//     // ctx.closePath();
//     // ctx.lineWidth = 5;
//     // ctx.fillStyle = '#ffd859';
//     // ctx.stroke();
//     // ctx.fill();
// };

// class Pineapple {
//     ctx: CanvasRenderingContext2D;
//     bodyStart: { x: number, y: number };
//     arrBody: { cx: number, cy: number, ex: number, ey: number }[];
//     leafStart: { x: number, y: number };
//     arrLeaf: { cx: number, cy: number, ex: number, ey: number }[];
//     constructor(ctx: CanvasRenderingContext2D) {
//         // 菠萝身
//         this.ctx = ctx;
//         this.bodyStart = { x: 140, y: 190 };
//         this.arrBody = [
//             { cx: 150, cy: 200, ex: 140, ey: 190 },
//             { cx: 115, cy: 150, ex: 120, ey: 120 },
//             { cx: 125, cy: 100, ex: 150, ey: 100 },
//             { cx: 160, cy: 100, ex: 165, ey: 105 },
//             { cx: 200, cy: 130, ex: 200, ey: 150 },
//             { cx: 205, cy: 175, ex: 180, ey: 190 },
//             { cx: 160, cy: 200, ex: 145, ey: 195 },
//         ];
//         // 菠萝叶
//         this.leafStart = { x: this.arrBody[1].ex, y: this.arrBody[1].ey };
//         this.arrLeaf = [
//             { cx: 110, cy: 110, ex: 100, ey: 110 },
//             { cx: 110, cy: 100, ex: 130, ey: 105 },
//             { cx: 130, cy: 80, ex: 155, ey: 85 },
//             { cx: 145, cy: 90, ex: 145, ey: 100 },
//         ];
//     }

//     render(): void {
//         if (!this.ctx) {
//             return;
//         }

//         // 菠萝身
//         this.ctx.beginPath();
//         this.ctx.moveTo(this.bodyStart.x, this.bodyStart.y);
//         for (let i = 0; i < this.arrBody.length; i++) {
//             this.ctx.quadraticCurveTo(this.arrBody[i].cx, this.arrBody[i].cy, this.arrBody[i].ex, this.arrBody[i].ey);
//         }
//         this.ctx.closePath();
//         this.ctx.lineWidth = 5;
//         let bodyGradient = this.ctx.createLinearGradient(this.bodyStart.x, this.bodyStart.y, this.arrBody[1].ex, this.arrBody[1].ey);
//         bodyGradient.addColorStop(0, '#ecb732');
//         bodyGradient.addColorStop(0.5, '#f7d336'); 
//         bodyGradient.addColorStop(1, '#ffd859');
//         this.ctx.fillStyle = bodyGradient;
//         this.ctx.strokeStyle = '#000';
//         this.ctx.stroke();
//         this.ctx.fill();
        
//         // 菠萝叶
//         this.ctx.beginPath();
//         this.ctx.moveTo(this.leafStart.x, this.leafStart.y);
//         for (let i = 0; i < this.arrLeaf.length; i++) {
//             this.ctx.quadraticCurveTo(this.arrLeaf[i].cx, this.arrLeaf[i].cy, this.arrLeaf[i].ex, this.arrLeaf[i].ey);
//         }
//         this.ctx.lineWidth = 5;
//         let leafGradient = this.ctx.createLinearGradient(this.leafStart.x, this.leafStart.y, this.arrLeaf[2].ex, this.arrLeaf[2].ey);
//         leafGradient.addColorStop(0, '#51a256');
//         leafGradient.addColorStop(0.5, '#51a256');
//         leafGradient.addColorStop(1, '#8ae99c');
//         this.ctx.fillStyle = leafGradient;
//         this.ctx.strokeStyle = '#000';
//         this.ctx.stroke();
//         this.ctx.fill();
//         this.ctx.closePath();
//     }
    
//     updated(): void {
//         // 边际检测
//         if (this.arrBody[0].ey > $canvas.value.height) {
//             return;
//         }

//         this.bodyStart.y += 10
//         this.arrBody.map((item) => {
//             item.cy += 10
//             item.ey += 10
//         });
        
//         this.leafStart.y += 10
//         this.arrLeaf.map((item) => {
//             item.cy += 10
//             item.ey += 10
//         });
//     }

//     remove(): void {
        
//     }
// }
</script>

<template>
    <canvas ref="$canvas"></canvas>
</template>

<style scoped>

</style>
