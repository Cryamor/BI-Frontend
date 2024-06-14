<template>
  <div>
    <el-row :gutter="20" justify="space-evenly" style="margin-top:20px;">
      <el-col :span="15">
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

      <el-col :span="8">
        <el-card shadow="never" class="content-wrapper">
          <div class="content-container" v-if="showNewsDetail">
            <h2> {{newsSelected.title}} </h2>
            <div class="news-time">发布时间: {{newsSelected.time}} </div>
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


defineOptions({
  name: "LifeCircle"
})

let Chart = null
let xdata = []
let ydata = []

const newsSelected = ref()
const showNewsDetail = ref(false)

interface SearchForm {
  id: string,
  time: Date[]
}

const searchForm = reactive<SearchForm>({
  id: '',
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

onMounted(() => {
  init()
  getData()
  // test3()
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

function test1() {

  axios.get('http://localhost:8080/news/getNewsById', {
    params: {
      newsId:1
    }
  })
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })

  /*
  data:
    browser_duration
    browser_num
    category
    content
    headline
    news_id
    topic
  */

}

function test2() {

  axios.get('http://localhost:8080/news/getNewsLifeCircle', {
    params: {
      newsId:13894,
      startTime: '2010-01-01 00:00:00',
      endTime: '2030-01-01 00:00:00',
    }
  })
  .then(res => {
    console.log('res',res)
  })
  .catch(err => {
    console.log(err)
  })

  /*
  data:
    Array({clickNum, date})
  */

}

function test3() {

  axios.get('http://localhost:8080/news/getCategoryClickChange', {
    params: {
      category:'entertainment',
      startTime: '2010-01-01 00:00:00',
      endTime: '2030-01-01 00:00:00',
    }
  })
  .then(res => {
    console.log('res',res)
  })
  .catch(err => {
    console.log(err)
  })

  /*
  data:
    Array({clickNum, date})
  */

}

function init() {
  Chart = echarts.init(document.getElementById("ct1"))
  let options = {
    title: {
      text: '新闻日流量变化',
      left: 'center'
    },
    tooltip: {},
    xAxis: {
      name: '时间',
      boundaryGap: false,
      data: ["def"],
    },
    yAxis: {
      name: '日流量'
    },
    series: [
      {
        name: "日流量",
        type: "line",
        smooth: true,
        data: [1],
        // itemStyle: {
        //     color: function (params) {
        //         var colorList = ['#FF3030', '#7CFC00', '#409EFF', '#bda29a', '#6e7074', '#546570',];
        //         return colorList[params.dataIndex]
        //     }
        // }
      },
    ],
  }

  // 渲染图表
  Chart.setOption(options)

}

function getData() {
  // 请求后端
  // axios.get(...)

  xdata = ["2018-03-02", "2018-03-03", "2018-03-04", "2018-03-05", "2018-03-06", "2018-03-07"]
  ydata = [5, 20, 36, 10, 10, 20]
  updateChart()

}

function clearData() {
  xdata = []
  ydata = []
}

function updateChart() {
  Chart.setOption({
    xAxis: {
      data: xdata
    },
    series: [
      {
        name: "日流量",
        data: ydata
      }
    ]
  })
}

function search() {
  // console.log(formatDateTime(dateSelected.value[0]), formatDateTime(dateSelected.value[1]))

  console.log(searchForm)

  clearData()
  simulateData()
  updateChart()
  showNewsDetail.value = true
}

function formatDateTime(date: Date) {
  // 转换为 yyyy-mm-dd hh:mm:ss
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要+1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    ydata.push(ele.clickNum)
  })

  newsSelected.value = {
    title: '标题',
    time: '2019-06-17',
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