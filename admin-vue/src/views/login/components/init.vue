<template>
  <el-button v-if="!isInited" style="margin-top: 12px;" round type="danger" size="large">初始化</el-button>
</template>

<script setup lang="ts">
import { reactive, toRefs } from "vue";

const reactiveData = reactive({
  isInited: false
});

const getIsInited = async () => {
  const num = Math.random()
  reactiveData.isInited = num > 0.5
};
getIsInited()

const { isInited } = toRefs(reactiveData);
</script>

<style scoped lang="scss"></style>
