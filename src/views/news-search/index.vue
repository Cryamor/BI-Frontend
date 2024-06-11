<template>
  <div>
    <h1>News Search</h1>
    <div id="ct1"></div>
  </div>
</template>

<script lang="ts" setup>

import * as echarts from "echarts";
import { onMounted } from "vue";

defineOptions({
  name: "NewsSearch"
})

onMounted(() => {
  init();
});
//初始化函数
function init() {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("ct1"));
  // 绘制图表
  let options = {
    title: {
      text: "ECharts test",
    },
    tooltip: {},
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
        itemStyle: {
            color: function (params) {
                var colorList = ['#FF3030', '#7CFC00', '#409EFF', '#bda29a', '#6e7074', '#546570',];
                return colorList[params.dataIndex]
            }
        }
      },
    ],
  };

  // 渲染图表
  Chart.setOption(options);
}

</script>

<style scoped>

#ct1 {
  height: 600px;
  width: 400px;
}

</style>