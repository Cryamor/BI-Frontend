<template>
  <div style="margin: 0 30px;">
    <!-- <h1>用户兴趣变化情况</h1> -->
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
      <div id="ct3"></div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { onMounted, reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { title } from "process";
import axios from "axios";
import { formatDateTime } from '@/api/format/format-time'

defineOptions({
  name: "Interest"
})

let Chart = null
let xdata = []
let ydata1 = []
let ydata2 = []
let lastxdata = []
let lastydata1 = []
let lastydata2 = []
let showxdata = []
let showydata1 = []
let showydata2 = []
let showlastydata1 = []
let showlastydata2 = []

interface SearchForm {
  id: string
  time: Date[]
}

const formSize = ref<ComponentSize>('default')

const searchForm = reactive<SearchForm>({
  id: '',
  time: [],
})

let lastSearchForm = JSON.parse(JSON.stringify(searchForm))

const searchFormRef = ref<FormInstance>()

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

const clear = (arr) => {
  arr.splice(0, arr.length)
}

const rules = reactive<FormRules<SearchForm>>({
  id: [
    {
      required: true,
      message: '用户ID不能为空',
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
})

function init() {
  Chart = echarts.init(document.getElementById("ct3"))
  let options = {
    title: {
      text: '用户兴趣偏好',
      left: 'center',
      subtext: '上次所选范围: 无',
    },
    tooltip: {},
    grid: {
      top: '20%'
    },
    legend: {
      right: '0',
      width: '300',
      data: ['本次所选范围浏览量','本次所选范围浏览时间', '上次所选范围浏览量','上次所选范围浏览时间']
    },
    xAxis: {
      name: '主题',
      data: []
    },
    yAxis: [
      {
        name: '浏览量',
        position: 'left'
      },
      {
        name: '浏览时间',
        position: 'right'
      }
    ],
    series: [
      {
        name: '本次所选范围浏览量',
        type: 'bar',
        data: [],
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            color: '#0366fc'
          }
        }
      },
      {
        name: '上次所选范围浏览量',
        type: 'bar',
        data: [],
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            opacity: 0.5,
            color: '#91aad9'
          }
        }
      },
      {
        name: '本次所选范围浏览时间',
        type: 'bar',
        data: [],
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: '#03a82f'
          }
        }
      },
      {
        name: '上次所选范围浏览时间',
        type: 'bar',
        data: [],
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            opacity: 0.5,
            color: '#95ba9f'
          }
        }
      }
    ]
    
  }

  Chart.setOption(options)
}

async function search() {
  console.log('user id:', searchForm.id, 'time:', searchForm.time)
  clear(lastxdata)
  clear(lastydata1)
  clear(lastydata2)
  Object.assign(lastydata1, ydata1)
  Object.assign(lastydata2, ydata2)
  Object.assign(lastxdata, xdata)

  await axios.get('http://localhost:8080/news/getUserTopicTimes', {
    params: {
      userId: searchForm.id,
      startTime: formatDateTime(searchForm.time[0]),
      endTime: formatDateTime(searchForm.time[1])
    }
  })
  .then(res => {
    console.log(res)
    if (res.status == 200) {
      const data = res.data
      clear(xdata)
      clear(ydata1)
      data.forEach(ele => {
        xdata.push(ele.topic)
        ydata1.push(ele.clickNum)
      })

      const m = mergeArrays(lastxdata, lastydata1, xdata, ydata1)
      showxdata = m[0]
      showydata1 = m[1]
      showlastydata1 = m[2]

      console.log(m)
    }
  })
  .catch(err => {
    console.log(err)
  })

  await axios.get('http://localhost:8080/news/getUserTopicDuration', {
    params: {
      userId: searchForm.id,
      startTime: formatDateTime(searchForm.time[0]),
      endTime: formatDateTime(searchForm.time[1])
    }
  })
  .then(res => {
    console.log(res)
    if (res.status == 200) {
      const data = res.data
      clear(ydata2)
      data.forEach(ele => {
        // xdata.push(ele.topic)
        ydata2.push(ele.browseTime)
      })

      const n = mergeArrays(lastxdata, lastydata2, xdata, ydata2)
      showydata2 = n[1]
      showlastydata2 = n[2]

      console.log(n)
    }
  })
  .catch(err => {
    console.log(err)
  })

  Chart.setOption({
    xAxis: {
      name: '主题',
      data: showxdata,
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 8,
        overflow: 'breakAll',
        width: 60
      }
    },
    series: [
      {
        name: '本次所选范围浏览量',
        data: showydata1
      },
      {
        name: '上次所选范围浏览量',
        data: showlastydata1
      },
      {
        name: '本次所选范围浏览时间',
        data: showydata2
      },
      {
        name: '上次所选范围浏览时间',
        data: showlastydata2
      }
    ],
  })

  let lastid = lastSearchForm.id
  let lasttime = [new Date(lastSearchForm.time[0]), new Date(lastSearchForm.time[1])]

  if (lastid != null && lastid != '') {
    Chart.setOption({
      title: {
        subtext: `上次所选范围: [ID: ${lastid}, 时间: ${lasttime[0].toLocaleDateString()} ~ ${lasttime[1].toLocaleDateString()}]`
      }
    })
  }

  Object.assign(lastSearchForm, searchForm)

}

function mergeArrays(xdata: string[], ydata: number[], x: string[], y: number[]): [string[], number[], number[]] {
  // 合并xdata数组，得到所有唯一的x值
  const newXdata = Array.from(new Set([...xdata, ...x]));
  // 初始化新的ydata数组，初始值为0
  const newYdata = new Array(newXdata.length).fill(0);
  // 根据新的x和y数据更新newYdata数组
  for (let i = 0; i < x.length; i++) {
    const index = newXdata.indexOf(x[i]);
    if (index !== -1) {
      newYdata[index] = y[i];
    }
  }
  // 创建last数组，原始ydata值保持不变，新加入的x值对应的y值为0
  const last = ydata.concat(new Array(newXdata.length - xdata.length).fill(0));

  return [newXdata, newYdata, last];
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

#ct3 {
  width: 100%;
  height: 500px;
}

</style>