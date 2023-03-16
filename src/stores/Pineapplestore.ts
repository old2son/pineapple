import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';

export const usePineappleStore = defineStore('pineappleCounter', () => {
    // 在 Setup Store 中：
    // ref() 就是 state 属性
    // computed() 就是 getters
    // function() 就是 actions
    
	const count = ref(0);
	const rank = reactive([
        { name: 'CJY', score: 100 },
    ]);
    const double = computed(() => count.value * 2);
	const increment = () => {
		count.value++;
	}

	return { 
        count,
        rank,
        double, 
        increment 
    };
});
