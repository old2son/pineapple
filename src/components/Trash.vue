<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// defineProps<{ msg: string }>();
const props = withDefaults(defineProps<{
    msg: string;
    mousePosition: {
        x: number;
        y?: number;
		maxWidth: number;
    };
}>(), {
    msg: 'Trash',
	mousePosition: () => ({ // 默认值
		x: 0,
		maxWidth: 0,
	})
});

const $dl = ref();
const emit = defineEmits(['getTrashStyle']);
onMounted(() => {
	emit('getTrashStyle', $dl.value.getBoundingClientRect());
});

</script>

<template>
	<dl 
		ref="$dl"
		:style="{
			left: `${props.mousePosition.x}px`,
		}"
	>
		<dt><img src="@/assets/images/garbage.png" :alt="msg"></dt>
		<dd>{{ msg }}</dd>
	</dl>
</template>

<style scoped lang="scss">
dl {
	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	width: 100px;
	height: 100px;

	img {
		width: 100%;
	}
}

dt {
	@extend dl;
	bottom: -8px;
}

dd {
	position: absolute;
	left: 50%;
	bottom: 10px;
	margin-left: 3px;
	transform: translateX(-50%);
	color: #333;
	font-size: 14px;
}

</style>
