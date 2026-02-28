<template>
  <div class="article-list">
    <view class="article-card" v-for="(blog, index) in blogList" :key="index">
      <!-- 标题 -->
      <view class="title truncate-2">{{ blog.title }}</view>
      <!-- 描述 -->
      <view class="description truncate-2">{{ blog.description }}</view>
      <!-- 日期和标签 -->
      <view class="footer">
        <view class="tags">
          <view v-for="(tag, index) in blog.tags" :key="index" class="tag">{{
            tag.name
          }}</view>
        </view>
        <view class="time">{{
          dayjs(blog.createTime).format("YYYY-MM-DD")
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
import dayjs from "dayjs";

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
  gap: 24rpx;
  padding: 10rpx 0;

  .article-card {
    padding: 32rpx;
    border-radius: 24rpx;
    background: linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%);
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
    border: 2rpx solid rgba(0, 0, 0, 0.02);
    transition: all 0.2s ease-in-out;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
      background: #f5f5f5;
    }

    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16rpx;
      line-height: 1.5;
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
      justify-content: space-between;
      margin-top: auto;

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;

        .tag {
          font-size: 22rpx;
          color: #1a1a1a;
          background: #f0f0f0;
          padding: 6rpx 16rpx;
          border-radius: 8rpx;
          font-weight: 500;
        }
      }

      .time {
        font-size: 24rpx;
        color: #999999;
        flex-shrink: 0;
        margin-left: 20rpx;
      }
    }
  }
}
</style>
