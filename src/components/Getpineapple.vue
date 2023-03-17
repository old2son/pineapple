<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { Pineapple } from '@/untils/Pineapple';

const pineappleStore = usePineappleStore();
const $canvas = ref();
let ctx: CanvasRenderingContext2D;
let step: number;

onMounted(() => {
    $canvas.value.width = window.innerWidth;
    $canvas.value.height = window.innerHeight;
    $canvas.value.style.border = '1px solid #000';
    $canvas.value.style.borderRadius = '4px';
    ctx = $canvas.value.getContext('2d');

    nextTick(() => {
        document.body.addEventListener('click', () => {
            pineappleStore.pineappleArr.push(new Pineapple(ctx));
            pineappleStore.increment();

            if (pineappleStore.pineappleArr.length > 1) {
                return;
            }

            step = requestAnimationFrame(draw);
        });
    });
});

const draw = () => {
    ctx.clearRect(0, 0, $canvas.value.width, $canvas.value.height);
    console.log('step');
    
    if (!pineappleStore.pineappleArr.length || !pineappleStore.pineappleArr[0]) {
        console.log('end')
        cancelAnimationFrame(step);
        return;
    }

    for (let i = 0; i < pineappleStore.pineappleArr.length; i++) {
        let current = pineappleStore.pineappleArr[i];
        current.updated();
        current.render();
        
        // 边际检测
        if (current.arrBody[i].ey > $canvas.value.height) {
            current.remove();
        }
    }
    
    step = requestAnimationFrame(draw);
};
</script>

<template>
    <canvas ref="$canvas"></canvas>
</template>

<style scoped>

</style>
