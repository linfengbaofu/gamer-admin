<template>
  <div class="dashboard-editor-container">
    <!-- 数据概览卡片 -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <!-- 趋势图表 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <!-- 排行榜区域 -->
    <el-row :gutter="32" style="margin-bottom: 32px;">
      <el-col :xs="24" :sm="24" :lg="12">
        <ranking-list type="recharge" title="充值排行榜" :limit="8" />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <ranking-list type="withdrawal" title="提现排行榜" :limit="8" />
      </el-col>
    </el-row>

    <!-- 其他图表 -->
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import RankingList from './dashboard/RankingList'

const lineChartData = {
  totalRecharge: {
    expectedData: [1200, 1500, 1800, 1600, 2000, 2200, 2500],
    actualData: [1100, 1400, 1700, 1500, 1900, 2100, 2400]
  },
  totalWithdrawal: {
    expectedData: [800, 1000, 1200, 1100, 1300, 1400, 1600],
    actualData: [750, 950, 1150, 1050, 1250, 1350, 1550]
  },
  todayRecharge: {
    expectedData: [50, 80, 120, 100, 150, 180, 200],
    actualData: [45, 75, 110, 95, 140, 170, 190]
  },
  todayWithdrawal: {
    expectedData: [30, 50, 80, 60, 90, 100, 120],
    actualData: [25, 45, 75, 55, 85, 95, 115]
  },
  // 新增：注册人数和在线人数数据
  userRegistration: {
    expectedData: [120, 150, 180, 160, 200, 220, 250],
    actualData: [110, 140, 170, 150, 190, 210, 240]
  },
  onlineUsers: {
    expectedData: [800, 1000, 1200, 1100, 1300, 1400, 1600],
    actualData: [750, 950, 1150, 1050, 1250, 1350, 1550]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    RankingList
  },
  data() {
    return {
      lineChartData: lineChartData.userRegistration
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type] || lineChartData.totalRecharge
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
