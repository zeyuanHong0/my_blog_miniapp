# Blog Mini App - 个人博客微信小程序

基于 UniApp + Vue 3 开发的个人博客微信小程序，支持 Markdown 文章浏览、分类标签管理、深色主题切换等功能。

### 小程序码

<img src="https://www.zlyhub.com/images/wechat-qr.jpg" width="200" alt="小程序码" />

## 功能特性

- **首页 3D 翻转卡片** - 正面展示个人信息，背面展示博客统计（数字动画）和兴趣标签
- **博客文章列表** - 支持分页加载、下拉刷新
- **Markdown 文章渲染** - 使用 towxml 组件进行原生渲染
- **分类和标签系统** - 支持按分类、标签浏览文章
- **深色/亮色主题切换** - 全局主题管理
- **微信登录** - 基于微信小程序 code 获取 Token
- **Token 自动刷新** - 双 Token 机制（access_token + refresh_token）
- **WebSocket 实时连接** - 支持在线状态管理
- **交互动效** - 卡片翻转振动反馈、数字计数动画、滚动视差效果

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4.21 | Composition API + Setup 语法 |
| UniApp | 3.0.0 | 跨端开发框架 |
| TypeScript | 4.9.4 | 类型系统 |
| Vite | 5.2.8 | 构建工具 |
| Pinia | 2.1.7 | 状态管理 |
| TDesign UniApp | ^0.7.3 | UI 组件库 |
| markdown-it | ^14.1.1 | Markdown 解析 |
| dayjs | ^1.11.19 | 时间处理 |
| countup.js | ^2.10.0 | 数字滚动动画 |
| vue-i18n | ^9.1.9 | 国际化 |
| SCSS/Sass | - | CSS 预处理器 |

## 快速开始

### 环境要求

- Node.js v22.21.0（推荐使用 nvm 管理版本）
- 微信开发者工具（AppID: `wxdc153fdb84ba745b`）

### 安装步骤

```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
npm install

# 启动微信小程序开发
npm run dev:mp-weixin
```

启动后使用微信开发者工具导入 `dist/dev/mp-weixin` 目录即可预览。

### 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev:mp-weixin` | 开发微信小程序 |
| `npm run build:mp-weixin` | 打包微信小程序 |
| `npm run dev:h5` | 开发 H5 页面 |
| `npm run build:h5` | 打包 H5 页面 |
| `npm run type-check` | TypeScript 类型检查 |

## 项目结构

```
src/
├── api/               # API 接口模块（blog, category, login, stats, status, tag）
├── components/        # 可复用组件（articleList, count-to, loading, markdownViewer）
├── constants/         # 常量定义
├── hooks/             # Vue Hooks（useLoading）
├── pages/             # 页面
├── store/             # Pinia 状态管理（blogStats, settings, user）
├── styles/            # 全局样式 + 主题（dark/light）
├── static/            # 静态资源（图片、towxml 库）
├── utils/             # 工具函数（request, websocket）
├── App.vue            # 应用根组件
├── main.ts            # 应用入口
├── pages.json         # 路由和导航配置
└── manifest.json      # 应用配置
```

### 状态管理模块

- **useSettingsStore** - 主题管理（light/dark 切换）
- **useUserStore** - 用户认证（微信登录、Token 管理、管理员权限检查）
- **useBlogStatsStore** - 博客统计（文章数、标签数、分类数）


## 主要页面

**TabBar 页面：**

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `pages/home/index` | 个人信息 + 最新博客 |
| 分类 | `pages/categories/list/index` | 分类列表 |
| 标签 | `pages/tags/list/index` | 标签列表 |
| 关于 | `pages/my/index` | 个人信息页 |

**其他页面：**

| 页面 | 路径 | 说明 |
|------|------|------|
| 分类详情 | `pages/categories/info/index` | 分类下的文章列表 |
| 标签详情 | `pages/tags/info/index` | 标签下的文章列表 |
| 博客列表 | `pages/blogs/index` | 支持下拉刷新 |
| 博客详情 | `pages/blog-view/index` | Markdown 渲染 |

## 开发指南

1. 确保本地后端服务已启动（默认端口 3000）
2. 运行 `npm run dev:mp-weixin` 编译小程序
3. 打开微信开发者工具，导入 `dist/dev/mp-weixin` 目录
4. 在开发者工具中进行调试和预览

> 项目主要面向微信小程序平台，H5 等其他端需自行验证兼容性。

## 构建部署

```bash
# 构建生产版本
npm run build:mp-weixin
```

构建产物位于 `dist/build/mp-weixin`，通过微信开发者工具上传提交审核即可发布。
