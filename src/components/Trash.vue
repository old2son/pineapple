<script setup lang="ts">
// defineProps<{ msg: string }>();
withDefaults(defineProps<{ msg: string }>(), {
	msg: 'Trash',
});
</script>

<template>
	<dl>
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
