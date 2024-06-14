<template>
  <div style="margin: 0 30px;">
    <el-card shadow="never" class="search-wrapper">
      <el-radio-group v-model="radio" style="margin-bottom:20px;">
        <el-radio-button label="按ID查询" value="按ID查询" />
        <el-radio-button label="按标题查询" value="按标题查询" />
        <el-radio-button label="按类别查询" value="按类别查询" />
      </el-radio-group>
      <!-- 按ID查询的表单 -->
      <el-form 
        ref="searchFormRef"
        :model="searchForm1"
        :rules="rules1"
        label-width="auto" 
        label-position="left" 
        :size="formSize"
        status-icon
        style="max-width:600px"
        v-if="radio=='按ID查询'"
      >
        <el-form-item label="新闻ID" prop="id">
          <el-input v-model="searchForm1.id" clearable placeholder="请输入要查询的新闻ID" />
        </el-form-item>
        <el-form-item label="">
          <el-button @click="submitForm(searchFormRef)" type="primary">查询</el-button>
          <el-button @click="resetForm(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 按标题查询的表单 -->
      <el-form 
        ref="searchFormRef"
        :model="searchForm2"
        :rules="rules2"
        label-width="auto" 
        label-position="left" 
        :size="formSize"
        status-icon
        style="max-width:600px"
        v-if="radio=='按标题查询'"
      >
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="searchForm2.title" clearable placeholder="请输入要查询的新闻标题" />
        </el-form-item>
        <el-form-item label="">
          <el-button @click="submitForm(searchFormRef)" type="primary">查询</el-button>
          <el-button @click="resetForm(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 按标题查询的表单 -->
      <el-form 
        ref="searchFormRef"
        :model="searchForm3"
        :rules="rules3"
        label-width="auto" 
        label-position="left" 
        :size="formSize"
        status-icon
        style="max-width:600px"
        v-if="radio=='按类别查询'"
      >
        <el-form-item label="新闻标题" prop="category">
          <el-select v-model="searchForm3.category" placeholder="选择要查询的新闻类别">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="submitForm(searchFormRef)" type="primary">查询</el-button>
          <el-button @click="resetForm(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>      

    </el-card>

    <el-card shadow="never">
      <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" prop="id" width="200"/>
      <el-table-column label="标题" prop="title" width="200"/>
      <el-table-column label="类别" prop="category" width="150"/>
      <el-table-column label="主题" prop="topic" width="150"/>
      <el-table-column label="内容" prop="content"/>

      </el-table>
    </el-card>

  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: "NewsSearch"
})

import { ref, reactive, onMounted, CSSProperties } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import axios from 'axios';
import { table } from 'console';

const radio = ref('按ID查询')
const tableData = [
  {
    id: '1',
    title: '',
    content: '',
    category: '',
    topic: ''
  },
  {
    id: '2',
    title: '',
    content: '',
    category: '',
    topic: ''
  },
]
const showNewsDetail = ref(false)
const newsSelected = ref({
  title: '',
  content: '',
  category: '',
  topic: '',
  id: '',
})

interface SearchForm1 {
  id: string
}
interface SearchForm2 {
  title: string
}
interface SearchForm3 {
  category: string
}
const searchForm1 = reactive<SearchForm1>({
  id: ''
})
const searchForm2 = reactive<SearchForm2>({
  title: ''
})
const searchForm3 = reactive<SearchForm3>({
  category: ''
})

const formSize = ref<ComponentSize>('default')
const searchFormRef = ref<FormInstance>()

const rules1 = reactive<FormRules<SearchForm1>>({
  id: [{required: true, message:'新闻ID不能为空', trigger: 'blur'}]
})
const rules2 = reactive<FormRules<SearchForm2>>({
  title: [{required: true, message:'新闻标题不能为空', trigger: 'blur'}]
})
const rules3 = reactive<FormRules<SearchForm3>>({
  category: [{required: true, message:'请选择新闻类别', trigger: 'blur'}]
})

const options = [
  {
    value: '运动',
    label: '运动',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

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

const clearTable = () => {
  tableData.splice(0, tableData.length)
}

function search() {
  switch(radio.value) {
    case '按ID查询':{
      searchById()
      break
    }
    case '按标题查询':{
      searchByTitle()
      break
    }
    case '按类别查询':{
      searchByCategory()
      break
    }
  }
}

function searchById() {
  console.log('searchById:', searchForm1.id)
  axios.get('http://localhost:8080/news/getNewsById', {
    params: {
      newsId: searchForm1.id
    }
  })
  .then(res => {
    if (res.status == 200) {
      clearTable()
      newsSelected.value.title = res.data.title
      newsSelected.value.content = res.data.content
      newsSelected.value.id = res.data.news_id
      newsSelected.value.topic = res.data.topic
      newsSelected.value.category = res.data.category

      let ele = {
        id: res.data.news_id,
        title: res.data.title,
        content: res.data.headline,
        category: res.data.category,
        topic: res.data.topic
      }
      tableData.push(ele)
    }
  })
  .catch(err => {
    console.log(err)
  })
}

function searchByTitle() {
  console.log('searchByTitle:', searchForm2.title)
  axios.get('http://localhost:8080/news/getNewsByTitle',{
    params: {
      category: searchForm2.title 
    }
  })
  .then(res => {
    if (res.status == 200) {
      clearTable()
      const data = res.data
      data.forEach(ele => {
        let item = {
          id: ele.news_id,
          title: ele.title,
          content: ele.headline,
          category: ele.category,
          topic: ele.topic
        }
        tableData.push(item)
      })
    }
  })
  .catch(err => {
    console.log(err)
  })  

}

function searchByCategory() {
  console.log('searchByCate:', searchForm3.category)
  axios.get('http://localhost:8080/news/getNewsByCategory',{
    params: {
      category: searchForm3.category 
    }
  })
  .then(res => {
    if (res.status == 200) {
      clearTable()
      const data = res.data
      data.forEach(ele => {
        let item = {
          id: ele.news_id,
          title: ele.title,
          content: ele.headline,
          category: ele.category,
          topic: ele.topic
        }
        tableData.push(item)
      })
    }
  })
  .catch(err => {
    console.log(err)
  })
}

</script>

<style scoped>
.search-wrapper {
  margin-top: 20px;
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

</style>