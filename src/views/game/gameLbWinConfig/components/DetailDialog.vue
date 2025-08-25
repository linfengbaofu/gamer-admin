<template>
  <el-dialog
    title="查看详情"
    :visible.sync="visible"
    width="900px"
    append-to-body
    @close="handleClose"
  >
    <div style="height: 500px; overflow-y: auto">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="会员ID">{{ detailData.mbId }}</el-descriptions-item>
        <el-descriptions-item label="会员账号">{{ detailData.mbAccount }}</el-descriptions-item>
        <el-descriptions-item label="游戏ID">{{
          detailData.gameid
        }}</el-descriptions-item>
        <el-descriptions-item label="游戏名称">{{ detailData.twName }}</el-descriptions-item>
        <el-descriptions-item label="匹配下注金额">{{
          detailData.amountLimit
        }}</el-descriptions-item>
        <el-descriptions-item label="要赢的金额">{{
          detailData.winAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="下注次数">{{
          detailData.betCount
        }}</el-descriptions-item>
        <el-descriptions-item label="误差率">{{
          detailData.allowRate
        }}</el-descriptions-item>
        <el-descriptions-item label="总赢金额">{{
          detailData.totalWinAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="是否开启">{{
          detailData.isOpen === 1 ? "是" : "否"
        }}</el-descriptions-item>
        <el-descriptions-item label="控制开始时间">{{
          detailData.beginTime
        }}</el-descriptions-item>
        <el-descriptions-item label="控制结束时间">{{
          detailData.endTime
        }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{
          detailData.remark || "无"
        }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">详细配置信息</el-divider>

      <!-- 轮次详情表格 -->
      <div class="detail-section">
        <h4>轮次详情</h4>
        <RoundDetailTable :detailData="detailData" />
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RoundDetailTable from './RoundDetailTable.vue'

export default {
  name: "DetailDialog",
  components: {
    RoundDetailTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detailData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  watch: {},
  methods: {
    /** 初始化表格数据 */
    initTableData() {
      this.combinedTableData = [];

      if (this.detailData.betRateList && this.detailData.amountLimit) {
        const rates = this.detailData.betRateList.split(",");
        const amounts = this.detailData.betAmountMatch
          ? this.detailData.betAmountMatch.split(",")
          : [];

        // 数据现在由子组件处理
      }
    },

    // 汇总方法现在由子组件处理

    /** 关闭对话框 */
    handleClose() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.el-descriptions {
  margin-bottom: 20px;
}

.el-divider {
  margin: 20px 0;
}

.el-table {
  margin-bottom: 20px;
}
</style>
