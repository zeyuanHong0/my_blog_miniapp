<template>
  <text>{{ displayValue }}</text>
</template>

<script lang="ts">
export default {
  name: "CountTo",
};
</script>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    endVal: number; // 目标值
    duration?: number; // 动画持续时间
    auto?: boolean; // 是否自动开始动画
  }>(),
  {
    duration: 1000,
    auto: true,
  },
);
const displayValue = ref(0);
let rafId: number | null = null;

const raf = (fn: () => void) => {
  if (typeof requestAnimationFrame === "function") {
    rafId = requestAnimationFrame(fn);
  } else {
    rafId = setTimeout(fn, 16) as unknown as number; // 16ms 大约等于 60fps
  }
};

const cancelRaf = () => {
  if (rafId === null) return;
  if (typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(rafId);
  } else {
    clearTimeout(rafId);
  }
  rafId = null;
};

const startAnimation = () => {
  cancelRaf(); // 先取消上一次动画
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    let progress = Math.min(elapsed / props.duration, 1);
    displayValue.value = Math.floor(props.endVal * progress);
    if (progress < 1) {
      raf(update);
    } else {
      rafId = null;
    }
  }
  update();
};

watch(
  () => props.endVal,
  (newVal) => {
    if (!props.auto) return;
    if (newVal > 0) {
      startAnimation();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  cancelRaf();
});

defineExpose({
  startAnimation,
});
</script>

<style lang="scss" scoped></style>
