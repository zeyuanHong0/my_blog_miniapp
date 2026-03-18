<template>
  <view class="page">
    <view class="header-container">
      <view class="title">标签 | {{ info.name }}</view>
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
  name: "TagInfo",
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

import { getTagInfo } from "@/api/tag";
import { useLoading } from "@/hooks/useLoading";

import Loading from "@/components/loading.vue";
import ArticleList from "@/components/articleList.vue";

const { showLoading, startLoading, stopLoading } = useLoading();

const tagId = ref<string>("");

onLoad((options: any) => {
  const { id } = options;
  if (id) {
    tagId.value = id;
    handleGetTagDetail();
  }
});

const info = ref<any>({});

const handleGetTagDetail = async () => {
  startLoading();
  try {
    const res = await getTagInfo(tagId.value);
    info.value = res.data;
  } finally {
    stopLoading();
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
