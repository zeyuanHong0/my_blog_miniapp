<template>
  <view class="loading-mask">
    <view class="loadingBox">
      <image class="img" src="@/static/logo.png" alt="" />
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "Loading",
};
</script>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loadingBox {
  width: 80rpx;
  height: 80rpx;
  animation: sk-rotateplane 1.2s infinite ease-in-out;

  .img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

@keyframes sk-rotateplane {
  0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
  }
  100% {
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}
</style>
