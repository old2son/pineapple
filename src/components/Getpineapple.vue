<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { Pineapple } from './scripts/Pineapple';

const pineappleStore = usePineappleStore();
const $wrapPineapple = ref();
const $canvas = ref();
const canvasPineappleStyle = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
    border: '1px solid #000',
    borderRadius: '4px',
});
const canvasBgStyle = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
});
const mouseStyle:{x: string | number, y: string | number } = reactive({
    x: '50%',
    y: '50%',
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

const mouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top } = $wrapPineapple.value.getBoundingClientRect();
    mouseStyle.x = clientX - left;
    mouseStyle.y = clientY - top;
};

onMounted(() => {
    ctx = $canvas.value.getContext('2d');
    canvasPineappleStyle.width = $wrapPineapple.value.offsetWidth;
    canvasPineappleStyle.height = $wrapPineapple.value.offsetHeight;
    
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
    <div 
        class="wrap-pineapple"
        ref="$wrapPineapple"
        @mousemove="mouseMove"
    >
        <canvas 
            class="pineapple-canvas"
            ref="$canvas"
            :width="canvasPineappleStyle.width"
            :height="canvasPineappleStyle.height"
            :style="{
                border: canvasPineappleStyle.border,
                borderRadius: canvasPineappleStyle.borderRadius,
            }"
        ></canvas>
        <img 
            class="pineapple-mouse"
            src="@/assets/images/plane.png" 
            alt="aim"
            :style="{
                top: `${mouseStyle.y}px`,
                left:`${mouseStyle.x}px`
            }"
        >
    </div>

    <canvas 
        class="canvas-bg"
        ref="$canvasbg"
        :width="canvasBgStyle.width"
        :height="canvasBgStyle.height"
    ></canvas>
</template>

<style scoped lang="scss">
.canvas-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-color: var(--background-color-lighter);
}

.wrap-pineapple {
    position: relative;
    width: 500px;
    height: 500px;
    margin: 0 auto;

    .pineapple-canvas {
        /* cursor 无法改变大小 */
        /* cursor: url('@/assets/cur/Cross.cur'), auto;  */
        overflow: hidden;
        background: #fff;
    }

    .pineapple-mouse {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        user-select: none;
    }
}

</style>
