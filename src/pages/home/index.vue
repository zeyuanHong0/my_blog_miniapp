<template>
  <view class="page">
    <!-- 小卡片 -->
    <view
      class="small-card"
      :style="{
        opacity: smallCardOpacity,
        pointerEvents: smallCardOpacity > 0 ? 'auto' : 'none',
      }"
    >
      <view class="small-card-content">
        <image class="small-avatar" src="@/static/logo.png" mode="aspectFill" />
        <text class="small-name">哲理源</text>
      </view>
    </view>
    <!-- 3D 翻转卡片 -->
    <view
      class="flip-card-container"
      @tap="handleFlip"
      :style="{
        opacity: flipCardOpacity,
        transform: `scale(${flipCardScale})`,
      }"
    >
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
              <view class="stat-number">{{ blogTotalCount }}</view>
              <view class="stat-label">篇文章</view>
            </view>
            <view class="stat-item">
              <view class="stat-number">{{ tagTotalCount }}</view>
              <view class="stat-label">个标签</view>
            </view>
            <view class="stat-item">
              <view class="stat-number">{{ categoryTotalCount }}</view>
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
      <ArticleList :blogList="blogList" />
    </view>
    <!-- 更多按钮 -->
    <view class="more-btn" @click="toBlogList">查看更多文章</view>

    <!-- loading -->
    <Loading v-if="showLoading" />
  </view>
</template>

<script lang="ts">
export default {
  name: "Home",
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  onLoad,
  onShow,
  onPageScroll,
  onPullDownRefresh,
} from "@dcloudio/uni-app";
import dayjs from "dayjs";

import { getLatestBlogList, getTotalBlogCount } from "@/api/blog";
import { getCategoryCount } from "@/api/category";
import { getTagCount } from "@/api/tag";
import { vibratePhone } from "@/utils";
import { useLoading } from "@/hooks/useLoading";

import Loading from "@/components/loading.vue";
import ArticleList from "@/components/articleList.vue";
import { start } from "node:repl";

interface Blog {
  title: string;
  description: string;
  createTime: string;
  tags: any[];
}

const { showLoading, startLoading, stopLoading } = useLoading(1000);

const scrollTop = ref(0);
const smallCardOpacity = computed(() => {
  // 当滚动超过 200px 时开始显示 smallCard，滚动到 300px 时完全显示
  const startFadePoints = 200;
  const endFadePoints = 300;

  if (scrollTop.value <= startFadePoints) return 0;
  if (scrollTop.value >= endFadePoints) return 1;

  return (
    (scrollTop.value - startFadePoints) / (endFadePoints - startFadePoints)
  );
});

const flipCardOpacity = computed(() => {
  // 当滚动开始时，flipCard 慢慢变淡，滚动到 300px 时完全透明
  const endFadePoints = 300;
  if (scrollTop.value >= endFadePoints) return 0;
  return 1 - scrollTop.value / endFadePoints;
});

const flipCardScale = computed(() => {
  // 滚动时稍微缩小一点
  const endScalePoints = 300;
  if (scrollTop.value >= endScalePoints) return 0.8;
  return 1 - (scrollTop.value / endScalePoints) * 0.2;
});

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const isFlipped = ref(false);
// 翻转卡片
const handleFlip = () => {
  vibratePhone();
  isFlipped.value = !isFlipped.value;
};

onShow(() => {
  init();
});

const init = async () => {
  startLoading();
  try {
    await handleGetLatestBlogList();
    await handleGetTotalBlogCount();
    await handleGetCategoryCount();
    await handleGetTagCount();
  } catch (error) {
    console.error("初始化数据失败:", error);
  } finally {
    stopLoading();
  }
};

onPullDownRefresh(() => {
  init();
  uni.stopPullDownRefresh();
});

// 最新的博客列表
const blogList = ref<Blog[]>([]);
const handleGetLatestBlogList = async () => {
  const res = await getLatestBlogList();
  blogList.value = res.data.map((blog: Blog) => ({
    ...blog,
    createTime: dayjs(blog.createTime).format("YYYY-MM-DD"),
  }));
};

// 博客总数量
const blogTotalCount = ref<number>(0);
const handleGetTotalBlogCount = async () => {
  const res = await getTotalBlogCount();
  blogTotalCount.value = res.data;
};

// 分类总数量
const categoryTotalCount = ref<number>(0);
const handleGetCategoryCount = async () => {
  const res = await getCategoryCount();
  categoryTotalCount.value = res.data;
};

// 标签总数量
const tagTotalCount = ref<number>(0);
const handleGetTagCount = async () => {
  const res = await getTagCount();
  tagTotalCount.value = res.data;
};

// 跳转到博客列表页
const toBlogList = () => {
  uni.navigateTo({
    url: "/pages/blogs/index",
  });
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
