<template>
  <div>
    <el-table :data="tableData" border style="width: 100%;" show-summary :summary-method="getSummary">
      <el-table-column label="轮次" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="单局下注金额" prop="amountLimit" align="center"></el-table-column>
      <el-table-column label="赔率" prop="rate" align="center"></el-table-column>
      <el-table-column label="单局获奖金额" prop="betAmount" align="center"></el-table-column>
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
      const amountLimit = Number(this.detailData.amountLimit || 0);
      
      return rates.map((rate, index) => {
        const rateValue = Number(rate || 0);
        const betAmount = amountLimit > 0 && rateValue > 0 ? 
          Number(Number((amountLimit * rateValue).toFixed(8))) : '0';
        
        return {
          amountLimit: this.detailData.amountLimit,
          rate: rate,
          betAmount: betAmount
        };
      });
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
          // 单局下注金额列，不显示汇总内容
          return;
        }
        if (index === 2) {
          // 赔率列，不显示汇总内容
          return;
        }
        if (index === 3) {
          // 单局获奖金额列，计算总和
          const values = data.map(item => {
            if (item.betAmount === '0') return 0;
            const amount = parseFloat(item.betAmount);
            return isNaN(amount) ? 0 : amount;
          });
          if (!values.every(value => value === 0)) {
            const total = values.reduce((prev, curr) => {
              return Number(Number(Number(prev) + Number(curr)).toFixed(8));
            }, 0);
            sums[index] = total;
          } else {
            sums[index] = '0';
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
