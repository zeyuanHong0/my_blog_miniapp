<template>
  <div class="article-list">
    <view class="article-card" v-for="(blog, index) in blogList" :key="index">
      <!-- 标题 -->
      <view class="title truncate-2">{{ blog.title }}</view>
      <!-- 描述 -->
      <view class="description truncate-2">{{ blog.description }}</view>
      <!-- 日期和标签 -->
      <view class="footer">
        <view class="time">{{ blog.createTime }}</view>
        <view v-for="(tag, index) in blog.tags" :key="index" class="tag">{{
          tag.name
        }}</view>
      </view>
    </view>
  </div>
</template>

<script lang="ts">
export default {
  name: "ArticleList",
};
</script>

<script setup lang="ts">
import { ref } from "vue";

interface Blog {
  title: string;
  description: string;
  createTime: string;
  tags: any[];
}

defineProps<{
  blogList: Blog[];
}>();
</script>

<style lang="scss" scoped>
.article-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .article-card {
    padding: 40rpx;
    border-radius: 32rpx;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
    border: 2rpx solid rgba(0, 0, 0, 0.02);
    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16rpx;
      line-height: 1.4;
    }
    .description {
      font-size: 28rpx;
      color: #666666;
      line-height: 1.6;
      margin-bottom: 24rpx;
    }
    .footer {
      display: flex;
      align-items: center;
      gap: 20rpx;
      font-size: 24rpx;
      .time {
        color: #999999;
      }
      .tag {
        color: #1a1a1a;
        background: #f0f0f0;
        padding: 8rpx 16rpx;
        border-radius: 12rpx;
        font-weight: 500;
      }
    }
  }
}
</style>
