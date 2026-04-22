<template>
  <page-meta :page-style="pageHidden ? 'overflow: hidden;' : ''" />
  <view class="my-container" :class="{ 'is-dark': isDark }">
    <!-- 个人资料卡片 -->
    <view class="profile-card">
      <image
        class="avatar"
        src="https://www.zlyhub.com/images/avatar.jpg"
        mode="aspectFill"
      ></image>
      <view class="info">
        <view class="name">
          {{ NICKNAME }}
          <text
            :class="['status-dot', statusInfo.is_online ? 'online' : 'offline']"
          ></text>
        </view>
        <view class="slogan">{{ statusInfo.status_desc || SLOGAN }}</view>
      </view>
    </view>

    <!-- 博客数据统计 -->
    <view class="stats-card card-box">
      <view class="stat-item" v-for="(item, index) in stats" :key="item.label">
        <view class="value">
          <CountTo
            :endVal="item.value"
            :auto="false"
            :ref="(el) => (countRefs[index] = el)"
          />
        </view>
        <view class="label">{{ item.label }}</view>
      </view>
    </view>

    <!-- 常用设置卡片 -->
    <view class="list-card card-box">
      <view
        class="list-item"
        @click="showStatusModal = true"
        v-if="userStore.isAdmin"
      >
        <text class="item-title">状态管理</text>
        <view class="right-box">
          <text class="item-value"
            >{{ statusInfo.is_online ? "在线" : "离线" }} ·
            {{ statusInfo.status_text || "默认" }}</text
          >
          <image
            class="arrow"
            src="@/static/image/common/icon_right_arrow.png"
            mode="aspectFit"
          />
        </view>
      </view>
      <view class="list-item" @click="clearCache">
        <text class="item-title">清除缓存</text>
        <view class="right-box">
          <text class="item-value">{{ cacheSize }}</text>
          <image
            class="arrow"
            src="@/static/image/common/icon_right_arrow.png"
            mode="aspectFit"
          />
        </view>
      </view>
      <button class="list-item feedback-btn" open-type="feedback">
        <text class="item-title">意见反馈</text>
        <view class="right-box">
          <image
            class="arrow"
            src="@/static/image/common/icon_right_arrow.png"
            mode="aspectFit"
          />
        </view>
      </button>
    </view>

    <!-- 社交网络与关联链接卡片 -->
    <view class="list-card card-box">
      <!-- 网页端博客 -->
      <view class="list-item" @click="showLinkModal = true">
        <view class="left-box">
          <image
            class="item-icon"
            :src="
              isDark
                ? '/static/image/common/icon_web_dark.png'
                : '/static/image/common/icon_web.png'
            "
            mode="aspectFit"
          />
          <text class="item-title">网页端博客</text>
        </view>
        <view class="right-box">
          <text class="item-value">{{ WEB_URL }}</text>
          <image
            class="arrow"
            src="@/static/image/common/icon_right_arrow.png"
            mode="aspectFit"
          />
        </view>
      </view>
      <!-- GitHub -->
      <view
        class="list-item"
        @click="copyText(GITHUB_PAGE, 'GitHub主页链接已复制！')"
      >
        <view class="left-box">
          <image
            class="item-icon"
            :src="
              isDark
                ? '/static/image/common/icon_github_dark.png'
                : '/static/image/common/icon_github.png'
            "
            mode="aspectFit"
          />
          <text class="item-title">GitHub</text>
        </view>
        <view class="right-box">
          <text class="item-value">zeyuanHong0</text>
          <image
            class="arrow"
            src="@/static/image/common/icon_right_arrow.png"
            mode="aspectFit"
          />
        </view>
      </view>
      <!-- Gmail -->
      <view class="list-item" @click="copyText(EMAIL, 'Gmail地址已复制！')">
        <view class="left-box">
          <image
            class="item-icon"
            src="@/static/image/common/icon_gmail.png"
            mode="aspectFit"
          />
          <text class="item-title">Gmail</text>
        </view>
        <view class="right-box">
          <text class="item-value">{{ EMAIL }}</text>
          <image
            class="arrow"
            src="@/static/image/common/icon_right_arrow.png"
            mode="aspectFit"
          />
        </view>
      </view>
    </view>

    <!-- 底部版本信息 -->
    <view class="footer">
      <text class="copyright">© 2026 {{ NICKNAME }}</text>
      <text class="version">v1.0.0</text>
    </view>

    <!-- 打开博客链接弹窗 -->
    <view
      v-if="showLinkModal"
      class="modal-mask"
      @click="showLinkModal = false"
    >
      <view class="modal-box" @click.stop>
        <view class="modal-title">打开网页端博客</view>
        <view class="modal-desc"
          >微信限制无法直接跳转浏览器，请复制链接后手动打开</view
        >
        <view class="modal-url">
          <text selectable>{{ WEB_URL }}</text>
        </view>
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="showLinkModal = false"
            >取消</view
          >
          <view class="modal-btn confirm" @click="copyAndClose">复制链接</view>
        </view>
      </view>
    </view>

    <!-- 状态管理弹窗 -->
    <view
      v-if="showStatusModal"
      class="modal-mask"
      @click="showStatusModal = false"
    >
      <view class="modal-box" @click.stop>
        <view class="modal-title">状态管理</view>
        <view class="form-item">
          <text class="form-label">在线状态</text>
          <switch
            :checked="statusInfo.is_online"
            @change="handleStatusChange"
            color="#1a1a1a"
            style="transform: scale(0.8)"
          />
        </view>
        <view class="form-item">
          <text class="form-label">具体状态</text>
          <input
            class="form-input"
            v-model="statusInfo.status_text"
            placeholder="例如: 工作中, 睡觉中"
            maxlength="10"
          />
        </view>
        <view class="form-item">
          <text class="form-label">状态描述</text>
          <input
            class="form-input"
            v-model="statusInfo.status_desc"
            placeholder="写一句简短的描述..."
            maxlength="20"
          />
        </view>
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="showStatusModal = false"
            >取消</view
          >
          <view class="modal-btn confirm" @click="saveStatus">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { onTabItemTap, onShow } from "@dcloudio/uni-app";

import useBlogStatsStore from "@/store/blogStats";
import useUserStore from "@/store/user";
import useSettingsStore from "@/store/settings";
import { storeToRefs } from "pinia";
import { NICKNAME, GITHUB_PAGE, SLOGAN, EMAIL, WEB_URL } from "@/constants";
import { vibratePhone } from "@/utils";
import { changeStatus } from "@/api/status";

import CountTo from "@/components/count-to.vue";

const blogStatsStore = useBlogStatsStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const { theme } = storeToRefs(settingsStore);
const isDark = computed(() => settingsStore.theme === "dark");

const pageHidden = computed(() => showLinkModal.value || showStatusModal.value);

const stats = computed(() => [
  { label: "文章", value: blogStatsStore.blogCount },
  { label: "分类", value: blogStatsStore.categoryCount },
  { label: "标签", value: blogStatsStore.tagCount },
]);

const countRefs = ref<any[]>([]);

// 页面状态
const isDarkMode = ref(false);
const cacheSize = ref("0 B");
const showLinkModal = ref(false);

onMounted(() => {
  calculateCache();
  countRefs.value.forEach((ref) => {
    ref?.startAnimation();
  });
});

onShow(() => {
  if (countRefs.value.length > 0) {
    countRefs.value.forEach((ref) => {
      ref?.startAnimation();
    });
  }
});

// 点击底部 Tab 触发震动反馈
onTabItemTap(() => {
  vibratePhone();
});

// 计算本地缓存大小
const calculateCache = () => {
  try {
    const res = uni.getStorageInfoSync();
    if (res.currentSize < 1024) {
      cacheSize.value = res.currentSize + " KB";
    } else {
      cacheSize.value = (res.currentSize / 1024).toFixed(2) + " MB";
    }
  } catch (e) {
    cacheSize.value = "0 B";
  }
};

// 清除本地缓存
const clearCache = () => {
  uni.showModal({
    title: "温馨提示",
    content: "确定要清除所有本地缓存吗？",
    success: function (res) {
      if (res.confirm) {
        uni.clearStorageSync();
        calculateCache();
        uni.showToast({ title: "清理完成", icon: "success" });
      }
    },
  });
};

// 复制博客链接并关闭弹窗
const copyAndClose = () => {
  copyText(WEB_URL, "链接已复制，请在浏览器中打开！");
  showLinkModal.value = false;
};

// 复制文本到剪贴板
const copyText = (text: string, msg: string) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({ title: msg, icon: "none" });
    },
  });
};

// 状态管理功能
const showStatusModal = ref(false);
const { statusInfo } = storeToRefs(userStore);

const saveStatus = async () => {
  try {
    await changeStatus({
      is_online: statusInfo.value.is_online ? 1 : 0,
      status_text: statusInfo.value.status_text,
      status_desc: statusInfo.value.status_desc,
    });
    uni.showToast({ title: "状态已保存", icon: "success" });
    showStatusModal.value = false;
  } catch (error) {
    uni.showToast({ title: "保存状态失败，请稍后再试", icon: "none" });
  }
};

const handleStatusChange = (e: any) => {
  userStore.statusInfo.is_online = e.detail.value;
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
