<template>
  <view class="page">
    <!-- 3D 翻转卡片 -->
    <view class="flip-card-container" @tap="handleFlip">
      <view class="flip-card" :class="{ flipped: isFlipped }">
        <!-- 正面 -->
        <view class="card-face card-front">
          <view class="avatar-wrapper">
            <view class="avatar">
              <image src="@/static/logo.png" />
            </view>
          </view>
          <view class="name">哲理源</view>
          <view class="title">一名前端开发工程师</view>
          <view class="divider"></view>
          <view class="motto">“ 记录成长，追寻理想 ”</view>
          <view class="tap-hint">点击翻转</view>
        </view>
        <!-- 背面 -->
        <view class="card-face card-back">
          <view class="stats-title">博客统计</view>
          <view class="stats-grid">
            <view class="stat-item">
              <view class="stat-number">{{ blogList.length }}</view>
              <view class="stat-label">篇文章</view>
            </view>
            <view class="stat-item">
              <view class="stat-number">20</view>
              <view class="stat-label">个标签</view>
            </view>
            <view class="stat-item">
              <view class="stat-number">4</view>
              <view class="stat-label">个分类</view>
            </view>
          </view>
          <view class="divider"></view>
          <view class="interests">
            <view class="interest-tag">Vue.js</view>
            <view class="interest-tag">TypeScript</view>
            <view class="interest-tag">React</view>
            <view class="interest-tag">Node.js</view>
          </view>
          <view class="tap-hint">再次点击翻回</view>
        </view>
      </view>
    </view>
    <!-- 文章列表 -->
    <view class="article-container">
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
    </view>
    <!-- 更多按钮 -->
    <view class="more-btn">查看更多文章</view>
  </view>
</template>

<script lang="ts">
export default {
  name: "Home",
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import dayjs from "dayjs";

import { getLatestBlogList } from "@/api/blog/index";

interface Blog {
  title: string;
  description: string;
  createTime: string;
  tags: any[];
}
const blogList = ref<Blog[]>([]);
const isFlipped = ref(false);

// 翻转卡片
const handleFlip = () => {
  isFlipped.value = !isFlipped.value;
};

onShow(() => {
  init();
});

const init = async () => {
  const res = await getLatestBlogList();
  blogList.value = res.data.map((blog: Blog) => ({
    ...blog,
    createTime: dayjs(blog.date).format("YYYY-MM-DD"),
  }));
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
