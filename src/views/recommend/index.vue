<template>
  <div style="margin: 0 30px;">
    <!-- <h1>新闻推荐</h1> -->
     <el-card shadow="never" class="content-wrapper">
      <p style="padding-bottom:10px;">根据您的历史浏览情况，为你推荐以下新闻:</p>
        <div class="content-container">
          <h2> {{news.title}} </h2>
          <div class="news-time">发布时间: {{news.time}} </div>
          <div class="news-content">{{news.content}} </div>
        </div>
     </el-card>
  </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'

defineOptions({
  name: "Recommend"
})

const news = reactive({
  title: '新闻标题',
  time: '2003-07-04',
  content: '1234567890qwertyuiiozjdafdai商务智能nsfiafnoadnfad'
})

</script>

<style scoped>

.content-wrapper {
  margin: 20px 0;
}

.news-time {
  color: #999;
  font-size: small;
  margin-bottom: 20px;
}

.news-content {
  padding-right: 30px;
  font-size: medium;
  overflow-wrap: break-word;
}

</style>