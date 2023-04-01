<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { Pineapple } from './scripts/Pineapple';

const pineappleStore = usePineappleStore();
const $canvas = ref();
const canvasStyle = ref({
    width: window.innerWidth,
    height: window.innerHeight,
    border: '1px solid #000',
    borderRadius: '4px',
});
let ctx: CanvasRenderingContext2D;
let step: number;

const debounce = (fn: Function, delay: number) => {
    let timer: number | null;
    return function (this: any, ...args: any[]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};
// 超过 5 秒后才清空数组
const debounceSlice = debounce(() => {
    pineappleStore.$patch({pineappleArr: []});
}, 5000);

onMounted(() => {
    ctx = $canvas.value.getContext('2d');

    nextTick(() => {
        document.body.addEventListener('click', () => {
            pineappleStore.pineappleArr.push(new Pineapple(ctx, $canvas.value));
            pineappleStore.increment();
            debounceSlice();

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
        current.pineappleUpdated(i);
    }

    step = requestAnimationFrame(draw);
};
</script>

<template>
    <!-- 动态设置canvas宽高 -->
    <canvas 
        class="canvas-pineapple"
        ref="$canvas"
        :width="canvasStyle.width * 0.8"
        :height="canvasStyle.height * 0.8"
        :style="{
            border: canvasStyle.border,
            borderRadius: canvasStyle.borderRadius,
        }"
    ></canvas>

    <canvas 
        class="canvas-bg"
        ref="$canvasbg"
        :width="canvasStyle.width"
        :height="canvasStyle.height"
    ></canvas>
</template>

<style scoped>
.canvas-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-color: var(--background-color-lighter);
}

.canvas-pineapple {
    background: #fff;
    cursor: url('@/assets/images/test.png'), auto;
}


</style>
