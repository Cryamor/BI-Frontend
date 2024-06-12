<template>
  <div>
    <h1>新闻种类变化情况</h1>
    <el-row :gutter="20" justify="space-evenly">
      <el-col :span="6">
        <el-select
          v-model="typeSelected"
          placeholder="Select"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          size="large"
        />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="search" size="large">查询</el-button>
      </el-col>
  
    </el-row>

    <el-row>
      <div id="ct2"></div>
    </el-row>
  </div>

</template>

<script lang="ts" setup>

import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";

defineOptions({
  name: "NewsType"
})

let Chart = null
let xdata = []
let ydata = []

const dateSelected = ref()
const typeSelected = ref()

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

onMounted(() => {
  init()
  getData()
});

function init() {
  Chart = echarts.init(document.getElementById("ct2"));
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
    title: {
      text: `[${typeSelected.value}]新闻日流量变化`
    },
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

  console.log(typeSelected.value)
  if (typeSelected.value === undefined || typeSelected.value == '') {
    ElMessage.error('种类不能为空')
    return
  }

  clearData()
  simulateData()
  updateChart()
}

function simulateData() {
  const data = [
    {
        "date": "2019-06-17",
        "clickNum": "23845"
    },
    {
        "date": "2019-06-16",
        "clickNum": "14342"
    },
    {
        "date": "2019-06-13",
        "clickNum": "14986"
    },
    {
        "date": "2019-06-14",
        "clickNum": "104586"
    },
    {
        "date": "2019-06-15",
        "clickNum": "35547"
    }
  ]


  data.forEach(ele => {
    xdata.push(ele.date)
    ydata.push(ele.clickNum)
  })

}



</script>


<style scoped>

h1 {
  text-align: center; 
  padding-bottom: 20px;
}

#ct2 {
  height: 500px;
  width: 100%;
  margin-top: 30px;
}

</style>