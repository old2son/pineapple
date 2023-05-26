<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, toRefs, watch, watchEffect } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { Pineapple } from './scripts/Pineapple';
import { Canvasbg } from './scripts/CanvasBg';
import imgPiniaBg from '@/assets/images/pinia_sm_bg.png';
import imgBg from '@/assets/images/pinia.jpeg';

const props = withDefaults(defineProps<{ 
    isReset: boolean, 
    trashStyle: { [key: string]: any }
}>(), {
	isReset: false,
    trashStyle: () => ({})
});
const { isReset, trashStyle } = toRefs(props);
const timeObj = reactive({
    seconds: 20,
    timeId1: null as number | null,
    timeId2: null as number | null
});

const pineappleStore = usePineappleStore();
const $wrapPineapple = ref();
const $canvasPinieapple = ref();
const $canvasBg = ref();
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
const mouseStyle:{x: string | number, y: string | number, rotate: number, direction: number  } = reactive({
    x: '50%',
    y: '50%',
    rotate: -35,
    direction: 0,
});
let ctxPinieapple: CanvasRenderingContext2D;
let ctxBg: CanvasRenderingContext2D;
let step: number;

const emit = defineEmits(['getCount', 'getIsReset', 'getMousePosition', 'getMaxWidth']);
const debounce = (fn: Function, delay: number) => {
    let timer: number | null; // NodeJS.Timer类型
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
    const { left, top, width, height } = $wrapPineapple.value.getBoundingClientRect();
    mouseStyle.x = clientX - left;
    // mouseStyle.y = clientY - top;

    if (mouseStyle.x > width) {
        mouseStyle.x = width;
    }
    else if (mouseStyle.x < 0) {
        mouseStyle.x = 0;
    }

    emit('getMousePosition', {x: mouseStyle.x, y: mouseStyle.y});

    for (let i = 0; i < pineappleStore.pineappleArr.length; i++) {
        let current = pineappleStore.pineappleArr[i];
        if (current.isBoom) {
            continue;
        }
        current.receviceMousePos(mouseStyle.x as number, mouseStyle.y as number);
    }
};

// 菠萝背景图
const renderPiniaBg = () => {
    const img = new Image();
    img.src = imgPiniaBg;
    img.onload = () => {
        const pattern = ctxPinieapple.createPattern(img, 'repeat');
        if (pattern !== null) {
            ctxPinieapple.fillStyle = pattern;
            ctxPinieapple.fillRect(0, 0, $canvasPinieapple.value.width, $canvasPinieapple.value.height);
        }
    };
};

onMounted(() => {
    ctxPinieapple = $canvasPinieapple.value.getContext('2d');
    ctxBg = $canvasBg.value.getContext('2d');
    canvasPineappleStyle.width = $wrapPineapple.value.offsetWidth;
    canvasPineappleStyle.height = $wrapPineapple.value.offsetHeight;

    nextTick(() => {
        renderPiniaBg();
        new Canvasbg(ctxBg, $canvasBg.value, {imgBg});
        emit('getMaxWidth', canvasPineappleStyle.width);
        mouseStyle.y = canvasPineappleStyle.height - trashStyle.value.height + 20;
    });
});

const startFn = () => {
    pineappleStore.pineappleArr.push(new Pineapple(ctxPinieapple, $canvasPinieapple.value));
    debounceSlice();

    // 一个以上无需重复 requestAnimationFrame
    if (pineappleStore.pineappleArr.length > 1) {
        return;
    }
    step = requestAnimationFrame(draw);
};

const pineappleClick = () => {
    // 每秒执行一次 starFn
    if (pineappleStore.pineappleArr.length > 0) {
        return;
    }
    
    // window.setInterval 解决 NodeJS.Timer 类型
    timeObj.timeId1 = window.setInterval(() => {
        timeObj.seconds--;
        emit('getCount', timeObj.seconds);
        if (timeObj.seconds === 0 || isReset.value) {
            timeObj.seconds = 20;
            timeObj.timeId1 && clearInterval(timeObj.timeId1);
            timeObj.timeId2 && clearInterval(timeObj.timeId2);
        }
    }, 1000);

    timeObj.timeId2 = window.setInterval(() => {
        startFn();
    }, 300);

    startFn();
}

const draw = () => {
    ctxPinieapple.clearRect(0, 0, $canvasPinieapple.value.width, $canvasPinieapple.value.height);
    
    if (!pineappleStore.pineappleArr.length || !pineappleStore.pineappleArr[0]) {
        cancelAnimationFrame(step);
        renderPiniaBg();
        return;
    }
    
    cancelAnimationFrame(step);
    for (let i = 0; i < pineappleStore.pineappleArr.length; i++) {
        let current = pineappleStore.pineappleArr[i];
        current.pineappleUpdated(i);
    }

    if (mouseStyle.direction) {
        mouseStyle.rotate -= 1;
    }
    else {
        mouseStyle.rotate > 360 && (mouseStyle.rotate = 0);
        mouseStyle.rotate += 1;
    }

    requestAnimationFrame(draw);
};

watch (isReset, (nv, ov) => {
    if (nv) {
        timeObj.seconds = 20;
        timeObj.timeId1 && clearInterval(timeObj.timeId1);
        timeObj.timeId2 && clearInterval(timeObj.timeId2);
        emit('getIsReset', true);
    }
});
</script>

<template>
    <div 
        class="wrap-pineapple"
        ref="$wrapPineapple"
        @mousemove="mouseMove"
    >
        <canvas 
            class="pineapple-canvas"
            ref="$canvasPinieapple"
            :width="canvasPineappleStyle.width"
            :height="canvasPineappleStyle.height"
            :style="{
                border: canvasPineappleStyle.border,
                borderRadius: canvasPineappleStyle.borderRadius,
            }"
            @contextmenu.prevent
            @click="pineappleClick"
        ></canvas>
        
        <!-- 🍍指针 -->
        <!-- <img 
            class="pineapple-mouse"
            src="@/assets/images/pinia_sm.png" 
            alt="aim"
            :style="{
                top: `${mouseStyle.y}px`,
                left: `${mouseStyle.x}px`,
                rotate: `${mouseStyle.rotate}deg`,
            }"
        > -->
        
        <slot name="cont"></slot>
    </div>

    <canvas 
        class="canvas-bg"
        ref="$canvasBg"
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
        // cursor 无法改变大小
        // cursor: url(@/assets/cur/precision.cur), auto;
        // cursor: none;
        overflow: hidden;
        background: #fff;
    }

    .pineapple-mouse {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        transform: translate(-50%, -50%);
        transform-origin: 0 0;
        filter: drop-shadow(0 0 4px #000);
        pointer-events: none;
        user-select: none;
        // transition: rotate 0.2s ease-in-out;
    }
}

</style>
