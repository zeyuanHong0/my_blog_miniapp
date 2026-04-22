<template>
  <page-meta :page-style="showMenuPopup ? 'overflow: hidden;' : ''" />
  <view class="page" :class="{ 'is-dark': isDark }">
    <Loading v-if="!show" />
    <view class="header-container">
      <!-- 标题 -->
      <view class="title">
        {{ blogInfo?.title }}
      </view>
      <!-- 描述 -->
      <view class="description">
        {{ blogInfo?.description }}
      </view>
      <!-- 日期 -->
      <view class="date">
        {{ dayjs(blogInfo?.createTime).format("YYYY/MM/DD") }} （更新于
        {{ dayjs(blogInfo?.updateTime).format("YYYY/MM/DD") }}） /
        {{ blogInfo?.category?.name }}
      </view>
      <!-- ai总结 -->
      <view class="ai-summary" v-if="blogInfo?.aiSummary">
        <view class="summary-title"><text class="emoji">✨</text>AI总结：</view>
        <view class="summary-content">{{ blogInfo?.aiSummary }}</view>
      </view>
    </view>

    <view v-if="show" class="article-container">
      <towxml id="my-towxml" />
    </view>
    <!-- 标签 -->
    <view class="tags-container">
      <view
        class="tag-item"
        v-for="(tag, index) in blogInfo?.tags"
        :key="index"
      >
        {{ tag.name }}
      </view>
    </view>

    <!-- 底部栏 -->
    <view class="bottomBar" :class="{ hidden: !showBottomBar }">
      <!-- 目录 -->
      <view class="barItem" @click="handleClickItem(0)">
        <image
          v-if="bottomBar_activeIndex === 0"
          class="item-icon"
          :src="
            isDark
              ? '/static/image/blog_img/menu_active_dark.png'
              : '/static/image/blog_img/menu_active.png'
          "
        />
        <image v-else class="item-icon" src="/static/image/blog_img/menu.png" />

        <view class="item-name" :class="{ active: bottomBar_activeIndex === 0 }"
          >目录</view
        >
      </view>
    </view>
    <!-- 遮罩层 -->
    <view
      class="overlay"
      v-if="showMenuPopup"
      @click="handleClickOverlay"
    ></view>
  </view>
  <!-- 目录弹窗 -->
  <t-popup
    :visible="showMenuPopup"
    :placement="'bottom'"
    @update:visible="showMenuPopup = $event"
    custom-style="border-radius: 0; height: 70%;padding-bottom: 140rpx;"
    :show-overlay="false"
    z-index="1000"
  >
    <view class="menu-container" :class="{ 'is-dark': isDark }">
      <view class="header">
        <text>{{ blogInfo?.title }}</text>
      </view>
      <view class="content">
        <scroll-view class="headings" scroll-y v-if="headings?.length > 0">
          <view
            class="heading-item"
            v-for="(heading, index) in headings"
            :key="index"
            :style="{ 'padding-left': (heading.level - 1) * 20 + 'rpx' }"
            @click="handleClickHeading(heading.id)"
          >
            <text class="heading-text">
              {{ heading.text }}
            </text>
          </view>
        </scroll-view>
        <view class="no-headings" v-else>
          <image
            class="emptyImg"
            src="https://www.zlyhub.com/images/empty.png"
          />
          <text class="emptyText">暂无目录</text>
        </view>
      </view>
    </view>
  </t-popup>
</template>

<script lang="ts">
export default {
  name: "BlogView",
};
</script>

<script setup lang="ts">
import { ref, nextTick, getCurrentInstance, computed, watch } from "vue";
import { onLoad, onPageScroll } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import TPopup from "@tdesign/uniapp/popup/popup.vue";

import { getBlogDetail } from "@/api/blog";
import { useLoading } from "@/hooks/useLoading";
import { extractHeadings } from "@/utils";

import Loading from "@/components/loading.vue";
import useSettingsStore from "@/store/settings";

const towxml = require("../../static/towxml/index");

interface BlogInfo {
  id: string;
  aiSummary: string;
  category: any;
  title: string;
  description: string;
  content: string;
  createTime: string;
  updateTime: string;
  tags: any[];
}

const instance = getCurrentInstance();
const settingsStore = useSettingsStore();
const isDark = computed(() => settingsStore.theme === "dark");

const { startLoading, stopLoading } = useLoading(1000);
const show = ref(false);

onLoad((options: any) => {
  const { id } = options;
  if (id) {
    handleGetBlogInfo(id as string);
  }
});

const blogInfo = ref<BlogInfo | null>(null);
const headings = ref<any[]>([]);
const article = ref<any>(null);
const handleGetBlogInfo = async (id: string) => {
  startLoading();
  try {
    const res = await getBlogDetail(id);
    blogInfo.value = res.data;

    article.value = towxml(blogInfo.value?.content, "markdown", {
      theme: isDark.value ? "dark" : "light",
      events: {
        tap: (e: any) => {
          // console.log(e);
          // 判断是不是图片,如果是图片就预览
          const { tag } = e.target.dataset.data;
          if (tag === "img") {
            const src = e.target.dataset.data.attrs;
            uni.previewImage({
              urls: [src.src],
            });
          }
        },
      },
    });

    // 给标题添加id属性，方便目录跳转
    show.value = true;

    // 等待组件挂载完成
    await nextTick();
    const pages = getCurrentPages();
    const currentPage: any = pages[pages.length - 1];
    const comp = currentPage.selectComponent("#my-towxml");
    // console.log("towxml node:", article);
    // 处理目录(并且给标题添加id属性)
    headings.value = extractHeadings(article.value?.children)!;
    if (comp) {
      comp.setData({ nodes: article.value });
    }
  } catch (error) {
    console.error(error);
  } finally {
    stopLoading();
  }
};

// 监听主题变化，更新文章组件的主题
watch(
  () => isDark.value,
  () => {
    const pages = getCurrentPages();
    const currentPage: any = pages[pages.length - 1];
    const comp = currentPage.selectComponent("#my-towxml");
    comp.setData({
      nodes: { ...article.value, theme: isDark.value ? "dark" : "light" },
    });
  },
);

const showBottomBar = ref(true);
const bottomBar_activeIndex = ref<number | null>(null);
let lastScrollTop = 0;
let scrollTimer: ReturnType<typeof setTimeout> | null = null;
onPageScroll((e: any) => {
  const currentScrollTop = e.scrollTop;

  // 向下滚动隐藏，向上滚动显示
  if (currentScrollTop > lastScrollTop) {
    showBottomBar.value = false;
  } else {
    showBottomBar.value = true;
  }
  lastScrollTop = currentScrollTop;

  // 停止滚动后自动显示
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    showBottomBar.value = true;
  }, 800);
});
const handleClickItem = (index: number) => {
  bottomBar_activeIndex.value === index
    ? (bottomBar_activeIndex.value = -1)
    : (bottomBar_activeIndex.value = index);

  bottomBar_activeIndex.value === 0
    ? (showMenuPopup.value = true)
    : (showMenuPopup.value = false);
};

const showMenuPopup = ref(false);

// 点击目录
const handleClickHeading = (id: string) => {
  // console.log("点击了目录项，id:", id);
  const pages = getCurrentPages();
  const currentPage: any = pages[pages.length - 1];
  const towxmlComp = currentPage.selectComponent("#my-towxml");

  if (towxmlComp) {
    towxmlComp.getHeadings((rects: any) => {
      // console.log("🚀 ~ handleClickHeading ~ rects:", rects);
      const targetRect = rects.find((rect: any) => rect.id === id);
      if (!targetRect) return;

      uni
        .createSelectorQuery()
        .selectViewport()
        .scrollOffset((viewportRect: any) => {
          const scrollTop = viewportRect.scrollTop + targetRect.top;
          showMenuPopup.value = false; // 先关闭目录弹窗
          bottomBar_activeIndex.value = -1;
          // console.log("🚀 ~ handleClickHeading ~ targetRect:", targetRect.top);
          uni.pageScrollTo({
            scrollTop,
            duration: 300,
          });
        })
        .exec();
    });
  }
};

// 点击遮罩层
const handleClickOverlay = () => {
  showMenuPopup.value = false;
  bottomBar_activeIndex.value = -1;
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
