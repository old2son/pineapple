<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { Pineapple } from '@/untils/Pineapple';

const pineappleStore = usePineappleStore();
const $canvas = ref();
const canvasStyle = ref({
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.8,
    border: '1px solid #000',
    borderRadius: '4px',
});
let ctx: CanvasRenderingContext2D;
let step: number;

onMounted(() => {
    ctx = $canvas.value.getContext('2d');

    nextTick(() => {
        document.body.addEventListener('click', () => {
            pineappleStore.pineappleArr.push(new Pineapple(ctx, $canvas.value));
            pineappleStore.increment();
            
            // 一个以上无需重复 requestAnimationFrame
            if (pineappleStore.pineappleArr.length > 1) {
                return;
            }
            step = requestAnimationFrame(draw);
        });
    });
});

const draw = () => {
    ctx.clearRect(0, 0, $canvas.value.width, $canvas.value.height);
    
    if (!pineappleStore.pineappleArr.length || !pineappleStore.pineappleArr[0]) {
        cancelAnimationFrame(step);
        return;
    }
    
    cancelAnimationFrame(step);
    for (let i = 0; i < pineappleStore.pineappleArr.length; i++) {
        let current = pineappleStore.pineappleArr[i];
        current.pineappleUpdated();
    }

    step = requestAnimationFrame(draw);
};
</script>

<template>
    <!-- 动态设置canvas宽高 -->
    <canvas 
        ref="$canvas"
        :width="canvasStyle.width"
        :height="canvasStyle.height"
        :style="{
            border: canvasStyle.border,
            borderRadius: canvasStyle.borderRadius,
        }"
    ></canvas>
</template>

<style scoped>

</style>
