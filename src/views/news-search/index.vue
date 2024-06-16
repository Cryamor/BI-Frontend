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
        <el-form-item label="新闻类别" prop="category">
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
      <el-table :data="tableData" style="width: 100%" @row-click="showDetail">
      <el-table-column label="ID" prop="id" width="150"/>
      <el-table-column label="标题" prop="title" width="300"/>
      <el-table-column label="类别" prop="category" width="150"/>
      <el-table-column label="主题" prop="topic" width="150"/>
      <el-table-column label="内容" prop="content" show-overflow-tooltip/>
      </el-table>
      <div style="margin-top:20px;">
        <el-button :disabled="curPage <= 1" @click="lastPage">上一页</el-button>
        <el-button :disabled="!hasSearched" type="primary" @click="nextPage">下一页</el-button>
      </div>
    </el-card>

    <el-dialog v-model="showNewsDetail" width="85%">
      <div class="content-container">
        <h2> {{newsSelected.title}} </h2>
        <div class="news-time">类别: {{newsSelected.category}}&nbsp&nbsp&nbsp&nbsp 主题: {{newsSelected.topic}} </div>
        <div class="news-content">{{newsSelected.content}} </div>
      </div>
    </el-dialog>

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

const curPage = ref(1)
const pageSize = 10
const radio = ref('按ID查询')
const tableData = reactive([])
const showNewsDetail = ref(false)
const newsSelected = ref({
  title: '',
  content: '',
  category: '',
  topic: '',
  id: '',
})
const hasSearched = ref(false)

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
    value: 'sports',
    label: 'sports',
  },
  {
    value: 'news',
    label: 'news',
  },
  {
    value: 'autos',
    label: 'autos',
  },
  {
    value: 'foodanddrink',
    label: 'foodanddrink',
  },
  {
    value: 'finance',
    label: 'finance',
  },
  {
    value: 'music',
    label: 'music',
  },
  {
    value: 'lifestyle',
    label: 'lifestyle',
  },
  {
    value: 'weather',
    label: 'weather',
  },
  {
    value: 'health',
    label: 'health',
  },
  {
    value: 'video',
    label: 'video',
  },
  {
    value: 'movies',
    label: 'movies',
  },
  {
    value: 'tv',
    label: 'tv',
  },
  {
    value: 'travel',
    label: 'travel',
  },
  {
    value: 'entertainment',
    label: 'entertainment',
  },
  {
    value: 'kids',
    label: 'kids',
  },
  {
    value: 'europe',
    label: 'europe',
  },
  {
    value: 'northamerica',
    label: 'northamerica',
  },
  {
    value: 'adexperience',
    label: 'adexperience',
  },
]

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      curPage.value = 1;
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

const nextPage = () => {
  curPage.value += 1
  search()
}
const lastPage = () => {
  curPage.value -= 1
  search()
}

function showDetail(row, event, column) {
  newsSelected.value.title = row.title
  newsSelected.value.content = row.content
  newsSelected.value.id = row.id
  newsSelected.value.topic = row.topic
  newsSelected.value.category = row.category
  showNewsDetail.value = true
}

function search() {
  hasSearched.value = true
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
      let ele = {
        id: res.data.news_id,
        title: res.data.headline,
        content: res.data.content,
        category: res.data.category,
        topic: res.data.topic
      }
      tableData.push(ele)
      console.log(res)
    }
  })
  .catch(err => {
    console.log(err)
  })
}

function searchByTitle() {
  console.log('searchByTitle:', searchForm2.title, 'page:', curPage.value)
  axios.get('http://localhost:8080/news/getNewsByHeadline',{
    params: {
      headline: searchForm2.title,
      pageNum: curPage.value,
      pageSize: pageSize
    }
  })
  .then(res => {
    console.log(11,res)
    if (res.status == 200) {
      clearTable()
      const data = res.data
      data.forEach(ele => {
        let item = {
          id: ele.news_id,
          title: ele.headline,
          content: ele.content,
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
  console.log('searchByCate:', searchForm3.category, 'page:', curPage.value)
  axios.get('http://localhost:8080/news/getNewsByCategory',{
    params: {
      category: searchForm3.category,
      pageNum: curPage.value,
      pageSize: pageSize
    }
  })
  .then(res => {
    if (res.status == 200) {
      clearTable()
      const data = res.data
      data.forEach(ele => {
        let item = {
          id: ele.news_id,
          title: ele.headline,
          content: ele.content,
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