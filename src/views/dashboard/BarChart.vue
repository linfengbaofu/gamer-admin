<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      default: () => ({
        title: '每日数据统计',
        xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [
          {
            name: '充值金额',
            data: [1200, 1500, 1800, 1600, 2000, 2200, 2500]
          },
          {
            name: '提现金额',
            data: [800, 1000, 1200, 1100, 1300, 1400, 1600]
          },
          {
            name: '新用户',
            data: [50, 80, 120, 100, 150, 180, 200]
          }
        ]
      })
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.chartData.xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: this.chartData.series.map(item => ({
          name: item.name,
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: item.data,
          animationDuration
        }))
      })
    }
  }
}
</script>
