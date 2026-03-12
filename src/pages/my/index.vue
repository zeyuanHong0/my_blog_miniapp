<template>
  <div></div>
</template>

<script lang="ts">
export default {
  name: "",
};
</script>

<script setup lang="ts">
import { onTabItemTap } from "@dcloudio/uni-app";

import { vibratePhone } from "@/utils";

onTabItemTap(() => {
  vibratePhone();
});
</script>

<style lang="scss" scoped></style>
