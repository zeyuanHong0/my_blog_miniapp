<template>
  <view class="container" :class="{ 'is-dark': isDark }">
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
        <image
          class="hero-icon-bg"
          v-if="sortedList[0].icon"
          :src="formatSvgIcon(sortedList[0].icon)"
          mode="aspectFit"
        ></image>
        <view class="hero-icon-box">
          <image
            class="hero-icon"
            v-if="sortedList[0].icon"
            :src="formatSvgIcon(sortedList[0].icon)"
            mode="aspectFit"
          ></image>
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
            <image
              class="sub-icon"
              v-if="tag.icon"
              :src="formatSvgIcon(tag.icon)"
              mode="aspectFit"
            ></image>
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
              <text class="item-count" v-if="tag.blogCount > 0"
                >{{ tag.blogCount }} 篇</text
              >
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

import useSettingsStore from "@/store/settings";
import { getAllTags } from "@/api/tag";
import { vibratePhone, formatSvgIcon } from "@/utils/index";
import { useLoading } from "@/hooks/useLoading";

import Loading from "@/components/loading.vue";

const { showLoading, startLoading, stopLoading } = useLoading(1000);

const settingsStore = useSettingsStore();
const isDark = computed(() => settingsStore.theme === 'dark');

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

const goToTagDetail = (tag: Tag) => {
  vibratePhone();
  uni.navigateTo({
    url: `/pages/tags/info/index?id=${tag.id}`,
  });
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
