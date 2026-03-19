<template>
  <view :class="['my-container', { 'is-dark': isDarkMode }]">
    <!-- 个人资料卡片 -->
    <view class="profile-card">
      <image
        class="avatar"
        src="/static/image/common/avatar.jpg"
        mode="aspectFill"
      ></image>
      <view class="info">
        <view class="name">{{ NICKNAME }}</view>
        <view class="slogan">{{ SLOGAN }}</view>
      </view>
    </view>

    <!-- 博客数据统计 -->
    <view class="stats-card card-box">
      <view class="stat-item" v-for="item in stats" :key="item.label">
        <view class="value">{{ item.value }}</view>
        <view class="label">{{ item.label }}</view>
      </view>
    </view>

    <!-- 常用设置卡片 -->
    <view class="list-card card-box">
      <view class="list-item">
        <text class="item-title">深色模式</text>
        <switch
          :checked="isDarkMode"
          @change="toggleDarkMode"
          color="#1a1a1a"
          style="transform: scale(0.8)"
        />
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
      <view class="list-item" @click="copyText(WEB_URL, '博客链接已复制！')">
        <view class="left-box">
          <image
            class="item-icon"
            src="@/static/image/common/icon_web.png"
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
            src="@/static/image/common/icon_github.png"
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
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onTabItemTap } from "@dcloudio/uni-app";

import { NICKNAME, GITHUB_PAGE, SLOGAN, EMAIL, WEB_URL } from "@/constans";
import { vibratePhone } from "@/utils";

const stats = ref([
  { label: "文章", value: 42 },
  { label: "分类", value: 8 },
  { label: "标签", value: 24 },
]);

// 页面状态
const isDarkMode = ref(false);
const cacheSize = ref("0 B");

onMounted(() => {
  calculateCache();
});

// 点击底部 Tab 触发震动反馈
onTabItemTap(() => {
  vibratePhone();
});

// 切换深色模式
const toggleDarkMode = (e: any) => {
  isDarkMode.value = e.detail.value;
  uni.showToast({
    title: isDarkMode.value ? "已开启深色模式" : "已关闭深色模式",
    icon: "none",
  });
};

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

// 复制文本到剪贴板
const copyText = (text: string, msg: string) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      setTimeout(() => {
        uni.showToast({ title: msg, icon: "none" });
      }, 100);
    },
  });
};
</script>

<style lang="scss" scoped>
.my-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 30rpx;
  box-sizing: border-box;
  transition: all 0.3s;
}

// 可复用的通用卡片样式
.card-box {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
  transition: all 0.3s;
}

/* 顶部个人资料卡片 */
.profile-card {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 20rpx 10rpx;

  .avatar {
    width: 130rpx;
    height: 130rpx;
    border-radius: 50%;
    background-color: #e0e0e0;
    margin-right: 30rpx;
    border: 4rpx solid #ffffff;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  }

  .info {
    flex: 1;
    .name {
      font-size: 44rpx;
      font-weight: 600;
      color: #333333;
      margin-bottom: 12rpx;
    }
    .slogan {
      font-size: 26rpx;
      color: #888888;
    }
  }
}

/* 数据统计区 */
.stats-card {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 0;

  .stat-item {
    text-align: center;
    .value {
      font-size: 40rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 10rpx;
    }
    .label {
      font-size: 24rpx;
      color: #999999;
    }
  }
}

/* 列表选项卡片 */
.list-card {
  padding: 0 30rpx;

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    font-size: 32rpx;
    color: #333333;
    background-color: transparent;

    &:last-child {
      border-bottom: none;
    }

    .left-box {
      display: flex;
      align-items: center;

      .item-icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 20rpx;
      }
    }

    .right-box {
      display: flex;
      align-items: center;

      .item-value {
        color: #999999;
        font-size: 28rpx;
        margin-right: 16rpx;
      }

      .arrow {
        width: 32rpx;
        height: 32rpx;
        opacity: 0.4;
        margin-left: 6rpx;
      }
    }
  }

  /* 消除 button 原生样式 */
  .feedback-btn {
    margin: 0;
    line-height: normal;
    border-radius: 0;
    text-align: left;
    overflow: visible;

    &::after {
      border: none;
    }
  }
}

/* 底部版本和版权信息 */
.footer {
  text-align: center;
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;

  .copyright {
    color: #bbbbbb;
    font-size: 24rpx;
    margin-bottom: 8rpx;
  }
  .version {
    color: #cccccc;
    font-size: 22rpx;
  }
}
</style>
