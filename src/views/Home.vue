<script setup lang="ts">
import { ref } from 'vue';
import { usePineappleStore  } from '@/stores/Pineapplestore';
import { useCounterStore  } from '@/stores/CounterStore';
import getPineapple from '@/components/Getpineapple.vue';
import { storeToRefs } from 'pinia'

const pineappleStore = usePineappleStore();
const { count, rank, double } = storeToRefs(pineappleStore);
const counterStore = useCounterStore();
const $counter = ref();
const $rank = ref();

</script>

<template>
    <div class="container">
        <get-pineapple></get-pineapple>
        <!-- <div ref="$counter"><span style="font-size: 30px;">🍍</span>粉碎数:{{ count }}</div>
        <div ref="$counter"><span style="font-size: 30px;">🍍</span>粉碎数x2:{{ double }}</div>
        <a>记录</a>
        <ul ref="$rank">
            排行榜:
            <template v-for="(item, index) in rank" :key="index">
                <li>{{ item.name }}：{{ item.score }} <i @click.prevent="">X</i></li>
            </template>
        </ul> -->
    </div>
</template>

<style scoped>
.container {
    width: 100vw;
    margin: 0 auto;
}
</style>
