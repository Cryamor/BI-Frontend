<template>
  <div>
    <el-row :gutter="20" justify="space-evenly" style="margin-top:20px;">
      <el-col :span="12">
        <el-card shadow="never" class="search-wrapper">
          <el-form 
            :model="searchForm" 
            :rules="rules"
            ref="searchFormRef"
            label-width="auto" 
            label-position="left" 
            :size="formSize"
            status-icon
            style="max-width:600px"
          >
          <el-form-item label="新闻ID" prop="id">
            <el-input v-model="searchForm.id" clearable placeholder="请输入要查询的新闻ID" />
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
          <el-form-item label="">
            <el-button @click="submitForm(searchFormRef)" type="primary">查询</el-button>
            <el-button @click="resetForm(searchFormRef)">重置</el-button>
          </el-form-item>
        </el-form>
        </el-card>

        <el-card shadow="never" class="echart-wrapper">
          <el-row>
            <el-col :span="24">
              <div id="ct1"></div>
            </el-col>
          </el-row>
        </el-card>

      </el-col>

      <el-col :span="11">
        <el-card shadow="never" class="content-wrapper">
          <div class="content-container" v-if="showNewsDetail">
            <h2> {{newsSelected.title}} </h2>
            <div class="news-time">类别: {{newsSelected.category}}&nbsp&nbsp&nbsp&nbsp 主题: {{newsSelected.topic}} </div>
            <div class="news-content">{{newsSelected.content}} </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script lang="ts" setup>

import * as echarts from "echarts";
import { onMounted, ref, reactive } from "vue";
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import axios from "axios";
import { formatDateTime, shortcuts } from '@/api/format/format-time'

defineOptions({
  name: "LifeCircle"
})

let Chart = null
let xdata = []
let clickydata = []
let browseydata = []

const newsSelected = ref({
  title: '',
  content: '',
  category: '',
  topic: '',
  id: '',
})
const showNewsDetail = ref(false)

interface SearchForm {
  id: string,
  time: Date[]
}

const searchForm = reactive<SearchForm>({
  id: '111',
  time: [],
})

const formSize = ref<ComponentSize>('default')
const searchFormRef = ref<FormInstance>()

const rules = reactive<FormRules<SearchForm>>({
  id: [
    {
      required: true,
      message: '新闻ID不能为空',
      trigger: 'blur'
    }
  ],
  time: [
    {
      required: true,
      message: '请选择起止时间',
      trigger: 'change'
    }
  ]
})

onMounted(() => {
  init()
});

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

const clear = (arr) => {
  arr.splice(0, arr.length)
}

function init() {
  Chart = echarts.init(document.getElementById("ct1"))
  let options = {
    title: {
      text: '新闻日流量变化',
      left: 'center'
    },
    tooltip: {},
    legend: {
      right: '20',
      data: ['点击量', '浏览时间']
    },
    xAxis: {
      name: '时间',
      boundaryGap: false,
      data: [],
    },
    yAxis: [
      {
        name: '点击量',
        position: 'left'
      },
      {
        name: '浏览时间',
        position: 'right'
      }
    ],
    series: [
      {
        name: "点击量",
        type: "line",
        smooth: true,
        data: clickydata,
        yAxisIndex: 0,
      },
      {
        name: "浏览时间",
        type: "line",
        smooth: true,
        data: browseydata,
        yAxisIndex: 1,
      }
    ],
  }

  // 渲染图表
  Chart.setOption(options)

}

function clearData() {
  xdata = []
  clickydata = []
  browseydata = []
}

function updateChart() {
  Chart.setOption({
    xAxis: {
      data: xdata
    },
    series: [
      {
        name: "点击量",
        data: clickydata
      },
      {
        name: "浏览时间",
        data: browseydata
      }
    ]
  })
}

async function search() {
  console.log(`news id: ${searchForm.id} time:`, searchForm.time)
  await axios.get('http://localhost:8080/news/getNewsLifeCircleTimes', {
    params: {
      newsId: searchForm.id,
      startTime: formatDateTime(searchForm.time[0]),
      endTime: formatDateTime(searchForm.time[1]),
    }
  })
  .then(res => {
    if (res.status == 200) {
      console.log(res)
      const dataArr = res.data
      clear(xdata)
      clear(clickydata)
      dataArr.forEach(ele => {
        xdata.push(ele.date)
        clickydata.push(ele.clickNum)
      })
    }
  })
  .catch(err => {
    console.log(err)
  })

  await axios.get('http://localhost:8080/news/getNewsLifeCircleDuration', {
    params: {
      newsId: searchForm.id,
      startTime: formatDateTime(searchForm.time[0]),
      endTime: formatDateTime(searchForm.time[1]),
    }
  })
  .then(res => {
    if (res.status == 200) {
      console.log(res)
      const dataArr = res.data
      clear(browseydata)
      dataArr.forEach(ele => {
        // xdata.push(ele.date)
        browseydata.push(ele.browseTime)
      })
    }
  })
  .catch(err => {
    console.log(err)
  })

  axios.get('http://localhost:8080/news/getNewsById', {
    params: {
      newsId: searchForm.id
    }
  })
  .then(res => {
    if (res.status == 200) {
      const data = res.data
      newsSelected.value.title = data.headline
      newsSelected.value.content = data.content
      newsSelected.value.id = data.news_id
      newsSelected.value.topic = data.topic
      newsSelected.value.category = data.category
    }
  })
  .catch(err => {
    console.log(err)
  })

  updateChart()
  showNewsDetail.value = true
}

function simulateData() {
  // 模拟数据
  const data = [
    {
        "date": "2019-06-17",
        "clickNum": "2"
    },
    {
        "date": "2019-06-20",
        "clickNum": "1"
    },
    {
        "date": "2019-07-01",
        "clickNum": "1"
    }
  ]

  data.forEach(ele => {
    xdata.push(ele.date)
    // ydata.push(ele.clickNum)
  })

  newsSelected.value = {
    title: '标题',
    category: 'entertainment',
    topic: 'Sport',
    id: '1',
    content: '新闻内容zsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbd',
  }

}

</script>

<style scoped>

h1 {
  text-align: center; 
  padding-bottom:20px;
}

#ct1 {
  height: 500px;
  width: 100%;
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.content-container {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  margin-right: 20px;
}

.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.title-wrapper {
  margin: 20px 40px;
}

.content-wrapper {
  height: 100%;
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