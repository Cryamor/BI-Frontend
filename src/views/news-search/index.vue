<template>
  <div>
    <h1>新闻生命周期查询</h1>

    <el-row :gutter="20" justify="space-evenly">

      <el-col :span="14">
        <el-row :gutter="20" justify="space-evenly">
          <el-col :span="6">
            <el-input v-model="idSelected" clearable placeholder="请输入要查询的新闻ID" />
          </el-col>
          <el-col :span="10">
            <el-date-picker
              v-model="dateSelected"
              type="daterange"
              unlink-panels
              range-separator="To"
              start-placeholder="Start month"
              end-placeholder="End month"
              :shortcuts="shortcuts"
            />
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div id="ct1"></div>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="8">
        <div class="content-container" v-if="showNewsDetail">
          <h2> {{newsSelected.title}} </h2>
          <div class="news-time">发布时间: {{newsSelected.time}} </div>
          <div class="news-content">{{newsSelected.content}} </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script lang="ts" setup>

import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import { update } from "lodash-es";
import { onMounted, ref } from "vue";

defineOptions({
  name: "NewsSearch"
})

let Chart = null

const idSelected = ref()
const dateSelected = ref()
const newsSelected = ref()
const showNewsDetail = ref(false)

let xdata = []
let ydata = []

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
});

function init() {
  Chart = echarts.init(document.getElementById("ct1"));
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
  };

  // 渲染图表
  Chart.setOption(options);

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

  console.log(idSelected.value)
  if (idSelected.value === undefined || idSelected.value == '') {
    ElMessage.error('ID不能为空')
    return
  }

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
  border: 1px solid #999;
  border-radius: 0%;
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