<template>
  <div style="margin: 0 30px;">
    <!-- <h1>新闻推荐</h1> -->
     <el-card shadow="never" class="content-wrapper">
      <p style="margin-left:50px;">根据您的历史浏览情况，为你推荐以下新闻:</p>
     </el-card>
  </div>
</template>

<script lang="ts" setup>

defineOptions({
  name: "Recommend"
})

</script>

<style scoped>

.content-wrapper {
  margin: 20px 0;
}

</style>