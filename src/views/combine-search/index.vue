<template>
  <div style="margin: 0 30px;">
    <el-card shadow="never" class="search-wrapper">
      <el-form 
        ref="searchFormRef"
        :model="searchForm"
        :rules="rules"
        label-width="auto" 
        label-position="left" 
        :size="formSize"
        status-icon
        style="max-width:1000px;"
        :inline="true"
      >
        <el-form-item label="新闻主题" prop="category">
          <el-select v-model="searchForm.category" placeholder="选择要查询的新闻主题">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间" prop="time">
          <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="起始时间"
            end-placeholder="终止时间"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item label="标题长度" prop="titleLen">
          <el-slider 
            v-model="searchForm.titleLen" 
            range 
            :max="200" 
            :min="0"
            :marks="marks"
            style="margin-bottom: 10px;"
          />
        </el-form-item>
        <!-- <el-form-item label="内容长度" prop="contentLen">
          <el-input-number
            v-model="searchForm.contentLen[0]" 
            :min="0"
            controls-position="right"
          />
          <span style="width: 50px; text-align:center;">To</span>
          <el-input-number 
            v-model="searchForm.contentLen[1]" 
            :max="9999999"
            controls-position="right"
          />
        </el-form-item> -->
        <el-form-item label="用户" prop="user">
          <el-input v-model="searchForm.user" clearable placeholder="请输入用户ID"> </el-input>
        </el-form-item>
        <el-form-item label="" style="width:800px;">
          <el-button @click="submitForm(searchFormRef)" type="primary">查询</el-button>
          <el-button @click="resetForm(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" prop="id" width="150"/>
      <el-table-column label="标题" prop="title" width="200"/>
      <el-table-column label="种类" prop="category" width="150"/>
      <el-table-column label="主题" prop="topic" width="150"/>
      <el-table-column label="内容" prop="content" :show-overflow-tooltip="true"/>

      </el-table>
      <div class="pagination-block">
        <el-button :disabled="curPage <= 1" @click="lastPage">上一页</el-button>
        <el-button :disabled="!hasSearched" type="primary" @click="nextPage">下一页</el-button>
      </div>
    </el-card>

  </div>
</template>

<script lang="ts" setup>

import { ref, reactive, onMounted, CSSProperties } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { formatDateTime } from '@/api/format/format-time'
import axios from 'axios';

defineOptions({
  name: "CombineSearch"
})

const tableData = reactive([])
const showNewsDetail = ref(false)
const newsSelected = ref({
  title: '',
  time: '',
  content: ''
})

const curPage = ref(1)
const pageSize = 10
const hasSearched = ref(false)

const nextPage = () => {
  curPage.value += 1
  search()
}
const lastPage = () => {
  curPage.value -= 1
  search()
}

interface SearchForm {
  category: string,
  time: Date[],
  titleLen: number[],
  contentLen: number[],
  user: string
}

const searchForm = reactive<SearchForm>({
  category: '',
  time: [new Date(2010,0,1), new Date()],
  titleLen: [10,200],
  contentLen: [20,200],
  user: '1'
})

const formSize = ref<ComponentSize>('default')
const searchFormRef = ref<FormInstance>()

const rules = reactive<FormRules<SearchForm>>({
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

const shortcuts = [
  {
    text: '2010~2030',
    value: () => {
      const start = new Date(2010,2,14)
      const end = new Date(2030,2,14)
      return [start, end]
    }
  },
  {
    text: 'This month',
    value: [new Date(), new Date()],
  },
  {
    text: 'This year',
    value: () => {
      const end = new Date()
      const start = new Date(new Date().getFullYear(), 0)
      return [start, end]
    },
  },
  {
    text: 'Last 6 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
]

interface Mark {
  style: CSSProperties
  label: string
}
type Marks = Record<number, Mark | string>

const marks = reactive<Marks>({
  0: '0',
  // 20: '20',
  // 15: '15',
  // 5: '5',
  50: '50',
  150: '150',
  100: {
    style: {
      color: '#1989FA',
    },
    label: '10',
  },
})


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      curPage.value = 1
      hasSearched.value = true
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

async function search() {
  console.log('search:', searchForm, 'page:', curPage.value)
  await axios.get('http://localhost:8080/news/getNewsByMultipleConditions', {
    params: {
      category: searchForm.category,
      startTime: formatDateTime(searchForm.time[0]),
      endTime: formatDateTime(searchForm.time[1]),
      minLen: searchForm.titleLen[0],
      maxLen: searchForm.titleLen[1],
      userId: searchForm.user,
      pageNum: curPage.value,
      pageSize: pageSize
    }
  })
  .then(res => {
    console.log(res)
    if (res.status == 200) {
      const data = res.data
      clearTable()
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

.content-wrapper {
  margin-top: 20px;
  height: 100%;
}

.content-container {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  margin-right: 20px;
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

/* 在版本 2.5.0之后， el-select 的默认宽度更改为 100% 当使用内联形式时，宽度将显示异常。 */
.el-form--inline {
  .el-form-item {
    & > .el-input, .el-cascader, .el-select, .el-date-editor, .el-autocomplete, .el-slider {
      width: 400px;
    }
  }
}

</style>