<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { storeToRefs } from 'pinia';
import getPineapple from '@/components/Getpineapple.vue';
import trash from '@/components/Trash.vue';

const pineappleStore = usePineappleStore();
const { count, rank, destoryedCount } = storeToRefs(pineappleStore);
// const $counter = ref();
const $rank = ref();
const user = reactive({
    name: 'Player'
});
const trashStyle = reactive({
    value: {}
});
let counter = ref(0);
let isReset = ref(false);

const mousePosition = reactive({
    x: 0,
    y: 0,
    maxWidth: 0,
});


// 重置所有状态
const reset = () => {
    isReset.value = true;
    pineappleStore.$reset();
};

// 获取 getPineapple 传递的数据
const getCount = (data: number) => {
    counter.value = data;
};
const getIsReset = (data: boolean) => {
    isReset.value = !data;
};
const getMousePosition = (data: {x: number, y: number}) => {
    mousePosition.x = data.x;
    mousePosition.y = data.y;
};
const getMaxWidth = (data: number) => {
    mousePosition.maxWidth = data;
};
const getTrashStyle = (data: Element) => {
    trashStyle.value = data;
};
</script>

<template>
    <div class="container">
        <get-pineapple 
            @getCount="getCount" 
            @getIsReset="getIsReset"
            @getMousePosition="getMousePosition"
            @getMaxWidth="getMaxWidth"
            :isReset=isReset
            :trashStyle=trashStyle.value
        >   
            <template #cont>
                <trash 
                    :msg="'🚮'"
                    :mousePosition="mousePosition"
                    @getTrashStyle="getTrashStyle"
                ></trash>
            </template>
        </get-pineapple>

        <div class="wrap-msg">
            <div class="msg-count-crash"><span style="font-size: 30px;">🍍</span>碰撞数：{{ count }}</div>
            <div class="msg-count-destroy"><span style="font-size: 30px;">🍍</span>破坏数 x2：{{ destoryedCount }}</div>
            <!-- <a>记录</a> -->
            <input type="text" v-model="user.name">
            <p>{{user.name}}</p>
            <div class="rank-wrap">
                排行榜:
                <ul ref="$rank">
                    <template v-for="(item, index) in rank" :key="index">
                        <li>{{ item.name }}：{{ item.score }} <i @click.prevent="">X</i></li>
                    </template>
                </ul>
                <a @click.stop="reset">重置</a>
            </div>
            <div class="msg-countdown">倒计时：{{ counter }}</div>
        </div>

    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    cursor: url(@/assets/cur/Cross.cur), auto;
    
    .wrap-msg {
        width: 100%;
        text-align: center;
    }
}
</style>
