<template>
  <view class="container">
    <Loading v-if="showLoading" />
    <view v-else class="bento-container">
      <!-- 英雄卡片 (Top 1) -->
      <view 
        class="bento-hero" 
        v-if="sortedList.length > 0" 
        @click="goToTagDetail(sortedList[0])"
      >
        <view class="hero-content">
          <text class="hero-name">{{ sortedList[0].name }}</text>
          <text class="hero-count">{{ sortedList[0].blogCount }} 篇文章</text>
        </view>
        <image class="hero-icon-bg" v-if="sortedList[0].icon" :src="formatSvgIcon(sortedList[0].icon)" mode="aspectFit"></image>
        <view class="hero-icon-box">
          <image class="hero-icon" v-if="sortedList[0].icon" :src="formatSvgIcon(sortedList[0].icon)" mode="aspectFit"></image>
          <text class="hero-icon-text" v-else>#</text>
        </view>
      </view>

      <!-- 双子卡片 (Top 2 & 3) -->
      <view class="bento-sub" v-if="sortedList.length > 1">
        <view 
          class="sub-card" 
          v-for="tag in sortedList.slice(1, 3)" 
          :key="tag.id"
          @click="goToTagDetail(tag)"
        >
          <view class="sub-header">
            <image class="sub-icon" v-if="tag.icon" :src="formatSvgIcon(tag.icon)" mode="aspectFit"></image>
            <text class="sub-icon-text" v-else>#</text>
          </view>
          <view class="sub-bottom">
            <text class="sub-name">{{ tag.name }}</text>
            <text class="sub-count">{{ tag.blogCount }} 篇</text>
          </view>
        </view>
      </view>

      <!-- 常规列表 (剩下的标签) -->
      <view class="rest-list" v-if="sortedList.length > 3">
        <text class="list-title">更多标签</text>
        <view class="list-container">
          <view
            v-for="tag in sortedList.slice(3)"
            :key="tag.id"
            class="list-item"
            @click="goToTagDetail(tag)"
          >
            <view class="item-left">
              <image
                class="item-icon-img"
                v-if="tag.icon"
                :src="formatSvgIcon(tag.icon)"
                mode="aspectFit"
              ></image>
              <text class="item-icon" v-else>#</text>
              <text class="item-name">{{ tag.name }}</text>
            </view>
            <view class="item-right">
              <text class="item-count" v-if="tag.blogCount > 0">{{ tag.blogCount }} 篇</text>
              <view class="item-arrow"></view>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="sortedList.length === 0 && !showLoading">
        <text class="empty-text">暂无标签</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "",
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onTabItemTap, onShow } from "@dcloudio/uni-app";

import { getAllTags } from "@/api/tag";
import { vibratePhone, formatSvgIcon } from "@/utils/index";
import { useLoading } from "@/hooks/useLoading";

import Loading from "@/components/loading.vue";

const { showLoading, startLoading, stopLoading } = useLoading(1000);

interface Tag {
  id: string;
  name: string;
  icon: string;
  blogCount: number;
}

onTabItemTap(() => {
  vibratePhone();
});

const list = ref<Tag[]>([]);

// 按文章数量倒序排列，用于 Bento 布局提取 Top 标签
const sortedList = computed(() => {
  return [...list.value].sort((a, b) => b.blogCount - a.blogCount);
});

onShow(() => {
  handleGetTagList();
});
const handleGetTagList = async () => {
  try {
    startLoading();
    const res: any = await getAllTags();
    if (res && res.data) {
      list.value = res.data;
    }
  } finally {
    stopLoading();
  }
};

const goToTagDetail = (tag: Tag) => {};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 24rpx;
}

.bento-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 英雄卡片 (Top 1) */
.bento-hero {
  position: relative;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae0ff 100%);
  border-radius: 32rpx;
  padding: 48rpx;
  height: 280rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(24, 144, 255, 0.15);
  overflow: hidden;
  box-sizing: border-box;

  &:active {
    transform: scale(0.98);
    transition: all 0.2s;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .hero-name {
    font-size: 56rpx;
    font-weight: 800;
    color: #0050b3;
    letter-spacing: 2rpx;
  }

  .hero-count {
    font-size: 28rpx;
    color: #1890ff;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.6);
    padding: 8rpx 24rpx;
    border-radius: 100rpx;
    align-self: flex-start;
  }

  .hero-icon-bg {
    position: absolute;
    right: -40rpx;
    bottom: -40rpx;
    width: 240rpx;
    height: 240rpx;
    opacity: 0.15;
    z-index: 1;
    transform: rotate(-15deg);
  }

  .hero-icon-box {
    position: absolute;
    right: 48rpx;
    top: 48rpx;
    width: 80rpx;
    height: 80rpx;
    background: #ffffff;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .hero-icon {
      width: 48rpx;
      height: 48rpx;
    }
    
    .hero-icon-text {
      font-size: 40rpx;
      font-weight: bold;
      color: #1890ff;
    }
  }
}

/* 双子卡片 (Top 2 & 3) */
.bento-sub {
  display: flex;
  gap: 24rpx;

  .sub-card {
    flex: 1;
    background-color: #ffffff;
    border-radius: 32rpx;
    padding: 32rpx;
    height: 200rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    box-sizing: border-box;

    &:active {
      transform: scale(0.96);
      transition: all 0.2s;
    }

    .sub-header {
      width: 64rpx;
      height: 64rpx;
      background: #f0f5ff;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .sub-icon {
        width: 36rpx;
        height: 36rpx;
      }
      
      .sub-icon-text {
        font-size: 32rpx;
        font-weight: bold;
        color: #1890ff;
      }
    }

    .sub-bottom {
      display: flex;
      flex-direction: column;
      gap: 4rpx;

      .sub-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333333;
      }

      .sub-count {
        font-size: 24rpx;
        color: #999999;
      }
    }
  }
}

/* 常规列表 (Other Tags) */
.rest-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 8rpx;
}

.list-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #888888;
  margin-left: 16rpx;
  margin-bottom: 8rpx;
}

.list-container {
  background-color: #ffffff;
  border-radius: 32rpx;
  padding: 0 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
  transition: opacity 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    opacity: 0.6;
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.item-icon-img {
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}

.item-icon {
  font-size: 36rpx;
  color: #1890ff;
  font-weight: bold;
}

.item-name {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
  letter-spacing: 1rpx;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.item-count {
  font-size: 26rpx;
  color: #999999;
}

.item-arrow {
  width: 12rpx;
  height: 12rpx;
  border-top: 3rpx solid #cccccc;
  border-right: 3rpx solid #cccccc;
  transform: rotate(45deg);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;

  .empty-text {
    color: #999;
    font-size: 28rpx;
  }
}
</style>
