<template>
  <view class="article-container">
    <towxml :nodes="toRaw(article)" />
  </view>
</template>

<script lang="ts">
export default {
  name: "MarkdownViewer",
};
</script>

<script setup lang="ts">
import { ref, watch, toRaw } from "vue";
const towxml = require("../static/towxml/index");

const props = defineProps<{
  content: string;
}>();

const article = ref(null);
const getWxml = (markdown: string) => {
  article.value = towxml(markdown, "markdown", {
    theme: "light",
    events: {
      tap: (e: any) => {
        console.log(e);
      },
    },
  });
  console.log("article.value:", article.value);
};

watch(
  () => props.content,
  (newContent) => {
    getWxml(newContent);
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.article-container {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
