<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, provide } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { storeToRefs } from 'pinia';
import getPineapple from '@/components/Getpineapple.vue';
import trash from '@/components/Trash.vue';
import end from '@/views/End.vue';

const pineappleStore = usePineappleStore();
const { count, rank, destoryedCount } = storeToRefs(pineappleStore);
const user = reactive({
    name: 'Player',
    flag: false,
});
const trashStyle = reactive({
    value: {}
});
let counter = ref(0);

// home 组件管理全局 reset 状态
let isReset = ref(false);
const updateProvideReset = (flag: boolean) => {
    isReset.value = flag;
};

provide('reset', isReset);
provide('updateReset', updateProvideReset);

const mousePosition = reactive({
    x: 0,
    y: 0,
    maxWidth: 0,
});

const isDbclick = computed(() => {
    return user.flag;
});

// 获取 getPineapple 传递的数据
const getCount = (data: number) => {
    counter.value = data;
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

const insertRank = () => {
    rank.value.push({
        name: user.name,
        score: count.value,
    });
};
</script>

<template>
    <div class="container">
        <get-pineapple 
            @getCount="getCount" 
            @getMousePosition="getMousePosition"
            @getMaxWidth="getMaxWidth"
            :trashStyle=trashStyle.value
        >   
            <template #cont>
                <trash 
                    :msg="'·_·'"
                    :mousePosition="mousePosition"
                    @getTrashStyle="getTrashStyle"
                ></trash>
            </template>
        </get-pineapple>

        <div class="wrap-msg">
            <div class="msg-count-crash">😒：{{ count }}</div>
            <div class="msg-count-destroy">🚮(x2)：{{ destoryedCount }}</div>
            <dl>
                <dt v-show="isDbclick"><input @keydown.enter="user.flag = false" type="text" v-model="user.name"></dt>
                <dd><b @dblclick="user.flag = true">{{ user.name }}</b></dd>
                <dd><a class="btn-insert" @click="insertRank">记录</a></dd>
            </dl>
            
            <end></end>
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

        b {
            display: inline-block;
            margin: 8px auto;
            color: chartreuse;
            font-weight: normal;
        }

        .btn-insert {
            display: inline-block;
            padding: 3px 8px;
            margin: 8px auto;
            border-radius: 3px;
            color: #fff;
            background-color: darkslategray;
        }
    }
}
</style>
