<template>
  <div style="margin: 0 30px;">
    <!-- <h1>新闻推荐</h1> -->
    <el-card shadow="never" class="search-wrapper">
      <el-form 
        :model="searchForm" 
        :rules="rules"
        ref="searchFormRef"
        label-width="auto" 
        label-position="left" 
        :size="formSize"
        status-icon
        style="max-width:900px"
        :inline="true"
      >
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="searchForm.id" clearable placeholder="请输入要查询的用户ID" />
        </el-form-item>
        <el-form-item label="">
          <el-button @click="submitForm(searchFormRef)" type="primary">查询</el-button>
          <el-button @click="resetForm(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
     <el-card shadow="never" class="content-wrapper">
        <div class="content-container">
          <h2> {{news.title}} </h2>
          <div class="news-time">类别: {{news.category}}&nbsp&nbsp&nbsp&nbsp 主题: {{news.topic}} </div>
          <div class="news-content">{{news.content}} </div>
        </div>
     </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import axios from 'axios';

defineOptions({
  name: "Recommend"
})

interface SearchForm {
  id: string
}
const searchForm = reactive<SearchForm>({
  id: '123'
})
const searchFormRef = ref<FormInstance>()
const formSize = ref<ComponentSize>('default')
const rules = reactive<FormRules<SearchForm>>({
  id: [
    {
      required: true,
      message: '用户ID不能为空',
      trigger: 'blur'
    }
  ]
})

const news = reactive({
  title: '',
  id: '',
  category: '',
  topic: '',
  content: ''
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      search()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const search = () => {
  console.log('recommend for:', searchForm.id)

  axios.get('http://localhost:8080/news/getUserRecommend',{
    params: {
      userId: searchForm.id
    }
  })
  .then(res => {
    if (res.status == 200) {
      const data = res.data
      news.category = data.category
      news.title = data.headline
      news.content = data.content
      news.id = data.news_id
      news.topic = data.topic
    }
  })
  .catch(err => {
    console.log(err)
  })
  
}

</script>

<style scoped>
.search-wrapper {
  margin: 20px 0;
}

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