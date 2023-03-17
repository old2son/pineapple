<script setup lang="ts">
import { ref } from 'vue';

// defineProps<{ msg: string }>();
withDefaults(defineProps<{ msg: string }>(), {
	msg: 'Trash',
});

const count = ref(0);
</script>

<template>
	<h6>{{ msg }}</h6>
</template>

<style scoped>
</style>
