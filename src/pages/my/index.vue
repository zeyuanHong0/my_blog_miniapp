<template>
  <view :class="['my-container', { 'is-dark': isDarkMode }]">
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
          <text :class="['status-dot', isOnline ? 'online' : 'offline']"></text>
        </view>
        <view class="slogan">{{ statusDesc || SLOGAN }}</view>
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
      <view class="list-item" @click="showStatusModal = true" v-if="canISee">
        <text class="item-title">状态管理</text>
        <view class="right-box">
          <text class="item-value"
            >{{ isOnline ? "在线" : "离线" }} · {{ statusText || "默认" }}</text
          >
          <image
            class="arrow"
            src="@/static/image/common/icon_right_arrow.png"
            mode="aspectFit"
          />
        </view>
      </view>
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
      <view class="list-item" @click="showLinkModal = true">
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
            :checked="isOnline"
            @change="handleStatusChange"
            color="#1a1a1a"
            style="transform: scale(0.8)"
          />
        </view>
        <view class="form-item">
          <text class="form-label">具体状态</text>
          <input
            class="form-input"
            v-model="statusText"
            placeholder="例如: 工作中, 睡觉中"
            maxlength="10"
          />
        </view>
        <view class="form-item">
          <text class="form-label">状态描述</text>
          <textarea
            auto-height
            class="form-textarea"
            v-model="statusDesc"
            placeholder="写一句简短的描述..."
            maxlength="50"
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
import { NICKNAME, GITHUB_PAGE, SLOGAN, EMAIL, WEB_URL } from "@/constans";
import { vibratePhone } from "@/utils";
import { changeStatus } from "@/api/status";

import CountTo from "@/components/count-to.vue";

const blogStatsStore = useBlogStatsStore();

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

// 切换深色模式
const toggleDarkMode = (e: any) => {
  isDarkMode.value = e.detail.value;
  // uni.showToast({
  //   title: isDarkMode.value ? "已开启深色模式" : "已关闭深色模式",
  //   icon: "none",
  // });
  uni.showToast({
    title: "深色模式还在开发中，敬请期待！",
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
const canISee = ref(true);
const showStatusModal = ref(false);
const isOnline = ref(true);
const statusText = ref("");
const statusDesc = ref("");

const saveStatus = async () => {
  try {
    await changeStatus({
      is_online: isOnline.value ? 1 : 0,
      status_text: statusText.value,
      status_desc: statusDesc.value,
    });
    uni.showToast({ title: "状态已保存", icon: "success" });
    showStatusModal.value = false;
  } catch (error) {
    uni.showToast({ title: "保存状态失败，请稍后再试", icon: "none" });
  }
};

const handleStatusChange = (e: any) => {
  isOnline.value = e.detail.value;
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
      display: flex;
      align-items: center;

      .status-dot {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        margin-left: 16rpx;

        &.online {
          background-color: #52c41a;
          box-shadow: 0 0 8rpx rgba(82, 196, 26, 0.5);
        }
        &.offline {
          background-color: #bfbfbf;
        }
      }
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

/* 链接弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  width: 580rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx 36rpx;

  .modal-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333333;
    text-align: center;
    margin-bottom: 20rpx;
  }

  .modal-desc {
    font-size: 26rpx;
    color: #888888;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 32rpx;
  }

  .modal-url {
    background-color: #f5f5f5;
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
    margin-bottom: 40rpx;
    text-align: center;

    text {
      font-size: 26rpx;
      color: #555555;
      word-break: break-all;
    }
  }

  .modal-actions {
    display: flex;
    gap: 20rpx;

    .modal-btn {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;

      &.cancel {
        background-color: #f0f0f0;
        color: #666666;
      }

      &.confirm {
        background-color: #1a1a1a;
        color: #ffffff;
      }
    }
  }

  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;

    .form-label {
      width: 140rpx;
      font-size: 28rpx;
      color: #333333;
    }

    .form-input {
      flex: 1;
      height: 64rpx;
      background-color: #f5f5f5;
      border-radius: 12rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: #333333;
    }

    .form-textarea {
      flex: 1;
      min-height: 64rpx;
      background-color: #f5f5f5;
      border-radius: 12rpx;
      padding: 16rpx 20rpx;
      font-size: 28rpx;
      color: #333333;
      line-height: 1.4;
    }
  }
}
</style>
