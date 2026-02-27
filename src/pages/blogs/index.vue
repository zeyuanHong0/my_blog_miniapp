<template>
  <view class="page">
    <view class="banner">
      共 <text class="blogNum">{{ blogList.length }}</text> 篇文章
    </view>
    <view class="content">
      <ArticleList :blogList="blogList" />
    </view>
    <view class="loading-more">-已加载全部文章-</view>
    <Loading v-if="showLoading" />
  </view>
</template>

<script lang="ts">
export default {
  name: "Blogs",
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";

import { getAllBlogList } from "@/api/blog";
import { useLoading } from "@/hooks/useLoading";

import ArticleList from "@/components/articleList.vue";
import Loading from "@/components/loading.vue";

const { showLoading, startLoading, stopLoading } = useLoading(1000);

const blogList = ref([]);

// 获取博客列表
const handleGetAllList = async () => {
  startLoading();
  try {
    const res = await getAllBlogList();
    blogList.value = res.data;
  } catch (error) {
    console.error(error);
  } finally {
    stopLoading();
  }
};

onLoad(() => {
  handleGetAllList();
});

onPullDownRefresh(() => {
  handleGetAllList();
  uni.stopPullDownRefresh();
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
