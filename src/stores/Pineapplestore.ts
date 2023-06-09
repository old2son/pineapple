import { ref, computed, reactive, Ref } from 'vue';
import { defineStore } from 'pinia';
import { Pineapple } from '@/components/scripts/Pineapple';

export const usePineappleStore = defineStore('pineappleCounter', () => {
    // 在 Setup Store 中：
    // ref() 就是 state 属性
    // computed() 就是 getters
    // function() 就是 actions
    
    const pineappleArr: Ref<Pineapple[]> = ref([]);
	const count = ref(0);
	const destoryedCount = ref(0);
	const rank = reactive([
        { 
            name: 'default player', 
            score: 1 
        },
    ]);
    // const double = computed(() => destoryedCount.value * 2);
	const increment = () => {
		count.value++;
	}

    const double = () => {
        destoryedCount.value += 2;
    };

    // 重置所有状态
    const $reset = () => {
        count.value = 0;
        destoryedCount.value = 0;
        pineappleArr.value.splice(0, pineappleArr.value.length);
        rank.splice(0, rank.length);
        rank.push({ 
            name: 'default player', 
            score: 1 
        });
    }

	return { 
        pineappleArr,
        count,
        destoryedCount,
        rank,
        double, 
        increment,
        $reset
    };
});
