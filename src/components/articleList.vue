<template>
  <div class="article-list">
    <view
      class="article-card"
      v-for="(blog, index) in blogList"
      :key="index"
      @click="toBlogInfo(blog.id)"
    >
      <!-- 作者和日期 -->
      <view class="meta">
        <text class="author">{{
          blog.author?.name ?? "无名侠"
        }}</text>
        <text class="divider">·</text>
        <text class="time">{{
          dayjs(blog.createTime).format("YYYY-MM-DD")
        }}</text>
      </view>
      <!-- 标题 -->
      <view class="title truncate-2">{{ blog.title }}</view>
      <!-- 描述 -->
      <view class="description truncate-2">{{ blog.description }}</view>
      <!-- 标签 -->
      <view class="footer">
        <view class="tags">
          <view v-for="(tag, index) in blog.tags" :key="index" class="tag">{{
            tag.name
          }}</view>
        </view>
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

import { vibratePhone } from "@/utils";

interface Blog {
  id: string;
  title: string;
  description: string;
  createTime: string;
  tags: any[];
  author?: {
    id: string;
    name: string;
  };
}

defineProps<{
  blogList: Blog[];
}>();

const toBlogInfo = (id: string) => {
  vibratePhone();
  uni.navigateTo({
    url: `/pages/blog-view/index?id=${id}`,
  });
};
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
    background: linear-gradient(
      180deg,
      var(--bg-card) 0%,
      var(--bg-card-end) 100%
    );
    box-shadow: 0 8rpx 24rpx var(--shadow-light);
    border: 2rpx solid var(--shadow-card);
    transition: all 0.2s ease-in-out;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 12rpx var(--shadow-card);
      background: var(--bg-input);
    }

    .meta {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: var(--text-placeholder);
      margin-bottom: 16rpx;

      .author {
        color: var(--btn-cancel-text);
        font-weight: 500;
      }

      .divider {
        margin: 0 12rpx;
      }
    }

    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: var(--btn-primary-bg);
      margin-bottom: 16rpx;
      line-height: 1.5;
    }

    .description {
      font-size: 28rpx;
      color: var(--btn-cancel-text);
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
          color: var(--btn-primary-bg);
          background: var(--btn-cancel-bg);
          padding: 6rpx 16rpx;
          border-radius: 8rpx;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
