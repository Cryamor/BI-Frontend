<template>
  <div style="margin: 0 30px;">
    <!-- <h1>新闻种类变化情况</h1> -->
    <el-card shadow="never" class="search-wrapper">
      <el-form 
        :model="searchForm" 
        :rules="rules"
        ref="searchFormRef"
        label-width="auto" 
        label-position="left" 
        :size="formSize"
        status-icon
        :inline="true"
      >
        <el-form-item label="新闻种类" prop="type">
          <el-select v-model="searchForm.type" placeholder="选择要查询的新闻种类">
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
        <el-form-item label="">
          <el-button @click="submitForm(searchFormRef)" type="primary">查询</el-button>
          <el-button @click="resetForm(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-row>
        <div id="ct2"></div>
      </el-row>
    </el-card>

  </div>

</template>

<script lang="ts" setup>

import * as echarts from "echarts";
import { onMounted, ref, reactive } from "vue";
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

defineOptions({
  name: "NewsType"
})

let Chart = null
let xdata = []
let ydata = []

interface SearchForm {
  type: string
  time: Date[]
}

const searchForm = reactive<SearchForm>({
  type: '运动',
  time: [new Date(2010,0,1), new Date()],
})

const formSize = ref<ComponentSize>('default')
const searchFormRef = ref<FormInstance>()

const options = [
  {
    value: '运动',
    label: '运动',
  },
  {
    value: '经济',
    label: '经济',
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

const rules = reactive<FormRules<SearchForm>>({
  type: [
    {
      required: true,
      message: '请选择新闻种类',
      trigger: 'change'
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
      text: `${searchForm.type}新闻日流量变化`
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
  console.log(searchForm)
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

.search-wrapper {
  margin-top: 20px;
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

/* 在版本 2.5.0之后， el-select 的默认宽度更改为 100% 当使用内联形式时，宽度将显示异常。 */
.el-form--inline {
  .el-form-item {
    & > .el-input, .el-cascader, .el-select, .el-date-editor, .el-autocomplete {
      width: 240px;
    }
  }
}

</style>