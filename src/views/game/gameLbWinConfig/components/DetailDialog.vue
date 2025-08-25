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
        <el-descriptions-item label="游戏ID">{{
          detailData.gameid
        }}</el-descriptions-item>
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

      <!-- 合并后的配置信息表格 -->
      <div class="detail-section">
        <h4>配置详情</h4>
        <el-table
          :data="combinedTableData"
          border
          style="width: 100%"
          show-summary
          :summary-method="getSummary"
        >
          <el-table-column
            label="轮次"
            type="index"
            width="60"
            align="center"
          ></el-table-column>
          <el-table-column
            label="匹配下注金额"
            prop="amountLimit"
            align="center"
          ></el-table-column>
          <el-table-column label="倍率" prop="rate" align="center"></el-table-column>
          <el-table-column
            label="对应金额"
            prop="betAmount"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DetailDialog",
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
    return {
      combinedTableData: [],
    };
  },
  watch: {
    visible(newVal) {
      if (newVal && this.detailData) {
        this.initTableData();
      }
    },
  },
  methods: {
    /** 初始化表格数据 */
    initTableData() {
      this.combinedTableData = [];

      if (this.detailData.betRateList && this.detailData.amountLimit) {
        const rates = this.detailData.betRateList.split(",");
        const amounts = this.detailData.betAmountMatch
          ? this.detailData.betAmountMatch.split(",")
          : [];

        rates.forEach((rate, index) => {
          this.combinedTableData.push({
            amountLimit: this.detailData.amountLimit,
            rate: rate,
            betAmount: amounts[index] || "N/A",
          });
        });
      }
    },

    /** 计算表格汇总行 */
    getSummary(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "汇总";
          return;
        }
        if (index === 1) {
          // 匹配下注金额列，显示第一个值
          // sums[index] = data.length > 0 ? data[0].amountLimit : '';
          return;
        }
        if (index === 2) {
          // 倍率列，显示"合计"
          // sums[index] = '合计';
          return;
        }
        if (index === 3) {
          // 对应金额列，计算总和
          const values = data.map((item) => {
            const amount = parseFloat(item.betAmount);
            return isNaN(amount) ? 0 : amount;
          });
          if (!values.every((value) => value === 0)) {
            const total = values.reduce((prev, curr) => {
              return Number((Number(prev) + Number(curr)).toFixed(8));
            }, 0);
            sums[index] = total;
          } else {
            sums[index] = "N/A";
          }
          return;
        }
        sums[index] = "";
      });
      return sums;
    },

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
