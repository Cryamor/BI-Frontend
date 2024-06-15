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
let ydata = []
let lastydata = []

interface SearchForm {
  id: string
  time: Date[]
}

const formSize = ref<ComponentSize>('default')

const searchForm = reactive<SearchForm>({
  id: '111',
  time: [new Date(2009,0,31), new Date()],
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
    legend: {
      right: '20',
      data: ['所选范围浏览量', '上次所选范围浏览量']
    },
    xAxis: {
      name: '主题',
      data: xdata
    },
    yAxis: {
      name: '浏览量'
    },
    series: [
      {
        name: '所选范围浏览量',
        type: 'bar',
        data: ydata
      },
      {
        name: '上次所选范围浏览量',
        type: 'bar',
        data: lastydata
      }
    ]
    
  }

  Chart.setOption(options)
}

async function search() {
  console.log('user id:', searchForm.id, 'time:', searchForm.time)
  Object.assign(lastydata, ydata)

  await axios.get('http://localhost:8080/news/getUserTopic', {
    params: {
      userId: searchForm.id,
      startTime: formatDateTime(searchForm.time[0]),
      endTime: formatDateTime(searchForm.time[1])
    }
  })
  .then(res => {
    console.log(res)
    if (res.status == 200) {

    }
  })
  .catch(err => {
    console.log(err)
  })

  ydata = [11,45,14,191,98,10,233,33]

  Chart.setOption({
    series: [
      {
        name: '所选范围浏览量',
        data: ydata
      },
      {
        name: '上次所选范围浏览量',
        data: lastydata
      }
    ],
  })

  let lastid = lastSearchForm.id
  let lasttime = [new Date(lastSearchForm.time[0]), new Date(lastSearchForm.time[1])]

  if (lastid != null && lastid != '') {
    Chart.setOption({
      title: {
        subtext: `上次所选范围: [用户ID: ${lastid}, 时间范围: ${lasttime[0].toLocaleDateString()} ~ ${lasttime[1].toLocaleDateString()}]`
      }
    })
  }

  Object.assign(lastSearchForm, searchForm)

}

function arrange() {
  
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