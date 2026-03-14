<template>
  <view class="page">
    <view class="header-container">
      <view class="title">全部分类</view>
      <view class="desc"
        >共 {{ list?.length }} 个分类 {{ totalCount }} 篇文章</view
      >
    </view>
    <view class="list-container">
      <view
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="toInfo(item.id)"
      >
        <view class="name">{{ item.name }}</view>
        <view class="count">{{ item.blogCount }} 篇</view>
      </view>
    </view>

    <!-- loading -->
    <Loading v-if="showLoading" />
  </view>
</template>

<script lang="ts">
export default {
  name: "CategoriesList",
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onShow, onTabItemTap } from "@dcloudio/uni-app";

import { getAllCategories } from "@/api/category";
import { useLoading } from "@/hooks/useLoading";
import { vibratePhone } from "@/utils";

import Loading from "@/components/loading.vue";

interface Category {
  id: string;
  name: string;
  blogCount: number;
}

const { showLoading, startLoading, stopLoading } = useLoading();

onTabItemTap(() => {
  vibratePhone();
});

const list = ref<Category[]>([]);
const totalCount = computed(() =>
  list.value.reduce((acc, item) => acc + item.blogCount, 0),
);

onShow(() => {
  handleGetAllCategoryList();
});

const handleGetAllCategoryList = async () => {
  startLoading();
  try {
    const res = await getAllCategories();
    list.value = res.data?.list;
  } finally {
    stopLoading();
  }
};

const toInfo = (id: string) => {
  uni.navigateTo({
    url: `/pages/categories/info/index?id=${id}`,
  });
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
