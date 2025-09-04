<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

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
        indicators: [
          { name: '台球', max: 1000 },
          { name: '扑克', max: 1000 },
          { name: '麻将', max: 1000 },
          { name: '老虎机', max: 1000 },
          { name: '体育', max: 1000 },
          { name: '彩票', max: 1000 }
        ],
        data: [
          {
            value: [500, 700, 800, 600, 400, 300],
            name: '用户活跃度'
          },
          {
            value: [300, 500, 600, 400, 200, 100],
            name: '充值金额'
          },
          {
            value: [200, 300, 400, 200, 100, 50],
            name: '提现金额'
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
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: this.chartData.indicators
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.chartData.data.map(item => item.name)
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: this.chartData.data,
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
