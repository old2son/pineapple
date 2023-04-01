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
	const rank = reactive([
        { name: 'CJY', score: count },
    ]);
    const double = computed(() => count.value * 2);
	const increment = () => {
		count.value++;
	}

	return { 
        pineappleArr,
        count,
        rank,
        double, 
        increment 
    };
});
