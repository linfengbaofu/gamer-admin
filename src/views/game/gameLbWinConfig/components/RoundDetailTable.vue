<template>
  <div>
    <el-table :data="tableData" border style="width: 100%;" show-summary :summary-method="getSummary">
      <el-table-column label="轮次" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="匹配下注金额" prop="amountLimit" align="center"></el-table-column>
      <el-table-column label="赔率" prop="rate" align="center"></el-table-column>
      <el-table-column label="对应金额" prop="betAmount" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "RoundDetailTable",
  props: {
    detailData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    tableData() {
      if (!this.detailData.betRateList || !this.detailData.amountLimit) {
        return [];
      }
      
      const rates = this.detailData.betRateList.split(',');
      const amounts = this.detailData.betAmountMatch ? this.detailData.betAmountMatch.split(',') : [];
      
      return rates.map((rate, index) => ({
        amountLimit: this.detailData.amountLimit,
        rate: rate,
        betAmount: amounts[index] || 'N/A'
      }));
    }
  },
  methods: {
    /** 计算表格汇总行 */
    getSummary(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总';
          return;
        }
        if (index === 1) {
          // 匹配下注金额列，不显示汇总内容
          return;
        }
        if (index === 2) {
          // 赔率列，不显示汇总内容
          return;
        }
        if (index === 3) {
          // 对应金额列，计算总和
          const values = data.map(item => {
            const amount = parseFloat(item.betAmount);
            return isNaN(amount) ? 0 : amount;
          });
          if (!values.every(value => value === 0)) {
            const total = values.reduce((prev, curr) => {
              return prev + curr;
            }, 0);
            sums[index] = total.toFixed(6);
          } else {
            sums[index] = 'N/A';
          }
          return;
        }
        sums[index] = '';
      });
      return sums;
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-bottom: 20px;
}
</style>
