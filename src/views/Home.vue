<script setup lang="ts">
import { ref } from 'vue';
import { usePineappleStore  } from '@/stores/Pineapplestore';
import { storeToRefs } from 'pinia';
import getPineapple from '@/components/Getpineapple.vue';
import trash from '@/components/Trash.vue';

const pineappleStore = usePineappleStore();
const { count, rank, double } = storeToRefs(pineappleStore);
const $counter = ref();
const $rank = ref();

  // 重置所有状态
const reset = () => {
    pineappleStore.$reset();
};
</script>

<template>
    <div class="container">
        <get-pineapple></get-pineapple>

        <div class="wrap-msg">
            <div ref="$counter"><span style="font-size: 30px;">🍍</span>粉碎数:{{ count }}</div>
            <div ref="$counter"><span style="font-size: 30px;">🍍</span>粉碎数x2:{{ double }}</div>
            <!-- <a>记录</a> -->
            <a @click.stop="reset">重置</a>
            <ul ref="$rank">
                排行榜:
                <template v-for="(item, index) in rank" :key="index">
                    <li>{{ item.name }}：{{ item.score }} <i @click.prevent="">X</i></li>
                </template>
            </ul>
            <trash :msg="'?'"></trash>
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
