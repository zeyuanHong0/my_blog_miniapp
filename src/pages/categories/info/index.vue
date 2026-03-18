<template>
  <view class="page">
    <view class="header-container">
      <view class="title">分类 | {{ info.name }}</view>
    </view>
    <view class="list-container">
      <ArticleList :blogList="info.blogs" />
    </view>
    <view class="loading-more">-已加载全部-</view>

    <!-- loading -->
    <Loading v-if="showLoading" />
  </view>
</template>

<script lang="ts">
export default {
  name: "CategoriesInfo",
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

import { getCategoryDetail } from "@/api/category";
import { useLoading } from "@/hooks/useLoading";

import Loading from "@/components/loading.vue";
import ArticleList from "@/components/articleList.vue";

const { showLoading, startLoading, stopLoading } = useLoading();

const categoryId = ref<string>("");

onLoad((options: any) => {
  const { id } = options;
  if (id) {
    categoryId.value = id;
    handleGetCategoryDetail();
  }
});

const info = ref<any>({});

const handleGetCategoryDetail = async () => {
  startLoading();
  try {
    const res = await getCategoryDetail(categoryId.value);
    info.value = res.data;
  } finally {
    stopLoading();
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
