
<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { usePineappleStore } from '@/stores/Pineapplestore';
import { storeToRefs } from 'pinia';
const pineappleStore = usePineappleStore();
const { rank } = storeToRefs(pineappleStore);
const $rank = ref();
const updateReset = inject<Function>('updateReset');

let isShow = ref(false);

// 重置所有状态
const reset = () => {
	pineappleStore.$reset();
	updateReset && updateReset(true);
};

const rankArr = computed(() => {
	return pineappleStore.rank;
});

const delRankItem = (index: number) => {
	rank.value.splice(index, 1);
};
</script>

<template>
	<div class="rank-wrap" 
		@mouseover="isShow = true" 
		@mouseleave="isShow = false"
		:class="{ show: isShow }"
	>
		🎏🎏🎏🎏🎏
		<ul ref="$rank">
			<template v-for="(item, index) in rankArr" :key="index">
				<li :title="`${item.score.toString()} point`">
					<b>{{ item.name }}：{{ item.score }} point</b> 
					<i @click.prevent="delRankItem(index)">X</i>
				</li>
			</template>
		</ul>
		<a class="btn-reset" @click="reset">重置</a>
	</div>
</template>

<style scoped lang="scss">
.rank-wrap {
	position: fixed;
	top: 0;
	bottom: 0;
	right: -180px;
	width: 200px;
	padding: 20px;
	overflow: hidden auto;
	transition: right 0.2s ease-in-out;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	background-color: #fff;

	&.show {
		right: 0;
	}

	li {
		height: 36px;
		line-height: 36px;
		list-style: none;
		color: #333;
		font-size: 12px;

		b {
			display: inline-block;
			max-width: 140px;
			padding-right: 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			vertical-align: middle;
			font-weight: normal;
		}

		i {
			display: inline-block;
			width: 18px;
			height: 18px;
			line-height: 18px;
			border: 1px solid darkgray;
			border-radius: 50%;
			vertical-align: middle;
			text-align: center;
			color: darkgray;
			font-size: 12px;
		}
	}

	.btn-reset {
		padding: 3px 8px;
		border-radius: 3px;
		color: #fff;
		font-size: 14px;
		background-color: darkslategrey;
	}
}
</style>
