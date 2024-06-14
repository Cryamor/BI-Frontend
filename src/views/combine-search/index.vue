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
        style="max-width:600px"
      >
        <el-form-item label="新闻主题" prop="topic">
          <el-select v-model="searchForm.topic" placeholder="选择要查询的新闻主题">
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
            show-stops 
            :max="20" 
            :min="0"
            :marks="marks"
            style="margin-bottom: 10px;"
          />
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
      <el-table-column label="发布时间" prop="time" width="200"/>
      <el-table-column label="种类" prop="type" width="150"/>
      <el-table-column label="主题" prop="topic" width="150"/>
      <el-table-column label="内容" prop="content"/>

      </el-table>
    </el-card>

  </div>
</template>

<script lang="ts" setup>

import { ref, reactive, onMounted, CSSProperties } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

defineOptions({
  name: "CombineSearch"
})

const tableData = [
  {
    id: '1',
    time: new Date().toLocaleString(),
    title: '',
    content: '',
    type: '',
    topic: ''
  },
  {
    id: '2',
    time: new Date().toLocaleString(),
    title: '',
    content: '',
    type: '',
    topic: ''
  },
]
const showNewsDetail = ref(false)
const newsSelected = ref({
  title: '',
  time: '',
  content: ''
})

interface SearchForm {
  topic: string,
  time: Date[],
  titleLen: number[],
}

const searchForm = reactive<SearchForm>({
  topic: '',
  time: [],
  titleLen: [5,20]
})

const formSize = ref<ComponentSize>('default')
const searchFormRef = ref<FormInstance>()

const rules = reactive<FormRules<SearchForm>>({

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
  20: '20',
  15: '15',
  5: '5',
  10: {
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

function search() {
  console.log(searchForm)
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


</style>