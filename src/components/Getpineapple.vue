<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';

const pineappleStore = usePineappleStore();
const $canvas = ref();

document.body.addEventListener('click', () => {
    pineappleStore.increment();
});

onMounted(() => {
    $canvas.value.width = window.innerWidth;
    $canvas.value.height = window.innerHeight;
    draw();
});

const draw = () => {
    const ctx = $canvas.value.getContext('2d');

    pineapple(ctx);
};
const step = () => {
    console.log('step');
    // draw();
    requestAnimationFrame(step);
};
// requestAnimationFrame(step);

const pineapple = (ctx: CanvasRenderingContext2D) => {

    // 菠萝身
    let bodyStart = { x: 140, y: 190 };
    let arrBody = [
        { cx: 150, cy: 200, ex: 140, ey: 190 },
        { cx: 115, cy: 150, ex: 120, ey: 120 },
        { cx: 125, cy: 100, ex: 150, ey: 100 },
        { cx: 160, cy: 100, ex: 165, ey: 105 },
        { cx: 200, cy: 130, ex: 200, ey: 150 },
        { cx: 205, cy: 175, ex: 180, ey: 190 },
        { cx: 160, cy: 200, ex: 145, ey: 195 },
    ];
    ctx.beginPath();
    ctx.moveTo(bodyStart.x, bodyStart.y);
    ctx.quadraticCurveTo(arrBody[0].cx, arrBody[0].cy, arrBody[0].ex, arrBody[0].ey);
    ctx.quadraticCurveTo(arrBody[1].cx, arrBody[1].cy, arrBody[1].ex, arrBody[1].ey);
    ctx.quadraticCurveTo(arrBody[2].cx, arrBody[2].cy, arrBody[2].ex, arrBody[2].ey);
    ctx.quadraticCurveTo(arrBody[3].cx, arrBody[3].cy, arrBody[3].ex, arrBody[3].ey);
    ctx.quadraticCurveTo(arrBody[4].cx, arrBody[4].cy, arrBody[4].ex, arrBody[4].ey);
    ctx.quadraticCurveTo(arrBody[5].cx, arrBody[5].cy, arrBody[5].ex, arrBody[5].ey);
    ctx.quadraticCurveTo(arrBody[6].cx, arrBody[6].cy, arrBody[6].ex, arrBody[6].ey);
    ctx.closePath();
    ctx.lineWidth = 5;
    let bodyGradient = ctx.createLinearGradient(bodyStart.x, bodyStart.y, arrBody[1].ex, arrBody[1].ey);
    bodyGradient.addColorStop(0, '#ecb732');
    bodyGradient.addColorStop(0.5, '#f7d336'); 
    bodyGradient.addColorStop(1, '#ffd859');
    ctx.fillStyle = bodyGradient;
    ctx.stroke();
    ctx.fill();
    

    // 菠萝叶
    let leafStart = { x: arrBody[1].ex, y: arrBody[1].ey };
    let arrLeaf = [
        { cx: 110, cy: 110, ex: 100, ey: 110 },
        { cx: 110, cy: 100, ex: 130, ey: 105 },
        { cx: 130, cy: 80, ex: 155, ey: 85 },
        { cx: 145, cy: 90, ex: 145, ey: 100 },
    ];
    ctx.beginPath();
    ctx.moveTo(leafStart.x, leafStart.y);
    ctx.quadraticCurveTo(arrLeaf[0].cx, arrLeaf[0].cy, arrLeaf[0].ex, arrLeaf[0].ey);
    ctx.quadraticCurveTo(arrLeaf[1].cx, arrLeaf[1].cy, arrLeaf[1].ex, arrLeaf[1].ey);
    ctx.quadraticCurveTo(arrLeaf[2].cx, arrLeaf[2].cy, arrLeaf[2].ex, arrLeaf[2].ey);
    ctx.quadraticCurveTo(arrLeaf[3].cx, arrLeaf[3].cy, arrLeaf[3].ex, arrLeaf[3].ey);
    // ctx.closePath();
    ctx.lineWidth = 5;
    let leafGradient = ctx.createLinearGradient(leafStart.x, leafStart.y, arrLeaf[2].ex, arrLeaf[2].ey);
    leafGradient.addColorStop(0, '#51a256');
    leafGradient.addColorStop(0.5, '#51a256');
    leafGradient.addColorStop(1, '#8ae99c');
    ctx.fillStyle = leafGradient;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    // 菠萝前身
    // ctx.beginPath();
    // ctx.arc(150, 150, 50, 0, 80 * Math.PI / 180);
    // ctx.quadraticCurveTo(150, 200, 140, 190);
    // ctx.quadraticCurveTo(115, 150, 120, 120);
    // ctx.quadraticCurveTo(125, 100, 150, 100);
    // ctx.quadraticCurveTo(160, 100, 165, 105);
    // ctx.quadraticCurveTo(200, 130, 200, 150);
    // ctx.closePath();
    // ctx.lineWidth = 5;
    // ctx.fillStyle = '#ffd859';
    // ctx.stroke();
    // ctx.fill();
};
</script>

<template>
    <canvas ref="$canvas"></canvas>
</template>

<style scoped>

</style>
