<template>
  <div class="app-container">
    <el-form :model="form" ref="configForm" :rules="rules" size="small" label-width="120px">
      <el-form-item label="最小充值金额" prop="minRechargeAmout">
        <el-input
          v-model="form.minRechargeAmout"
          placeholder="请输入最小充值金额"
          clearable
        />
      </el-form-item>
      <el-form-item label="最大充值金额" prop="maxRechargeAmout">
        <el-input
          v-model="form.maxRechargeAmout"
          placeholder="请输入最大充值金额"
          clearable
        />
      </el-form-item>
      <el-form-item label="赠送积分比例" prop="givePointRate">
        <el-input
          v-model="form.givePointRate"
          placeholder="请输入赠送积分比例(如0.1)"
          clearable
          @input="handleGivePointRateInput"
        />
      </el-form-item>
      <el-form-item label="TRX USDT地址" prop="trxUsdtAddr">
        <el-input
          v-model="form.trxUsdtAddr"
          placeholder="请输入TRX USDT地址"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入备注"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="updateLoading" @click="handleUpdate">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getRechargeConfig, updateRechargeConfig } from "@/api/billard/rechargeConfig";

export default {
  name: "RechargeConfig",
  data() {
    return {
      // 更新按钮loading状态
      updateLoading: false,
      // 表单验证规则
      rules: {
        givePointRate: [
          { required: true, message: "赠送积分比例不能为空", trigger: "blur" },
          { validator: this.validateGivePointRate, trigger: "blur" }
        ]
      },
      // 配置表单数据
      form: {
        configId: null,
        minRechargeAmout: null,
        maxRechargeAmout: null,
        givePointRate: null,
        payChannel: null,
        mbId: null,
        trxUsdtAddr: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
    };
  },
  created() {
    this.getConfig();
  },
  methods: {
    /** 获取充值配置 */
    getConfig() {
      getRechargeConfig().then(({code, data}) => {
        if (code === 200) {
          this.form = data;
        }
      });
    },
    /** 处理赠送积分比例输入，限制最多3位小数 */
    handleGivePointRateInput(value) {
      if (value) {
        // 只允许数字和小数点
        let newValue = value.replace(/[^\d.]/g, '');
        
        // 防止多个小数点
        let dotIndex = newValue.indexOf('.');
        if (dotIndex !== -1) {
          newValue = newValue.substring(0, dotIndex + 1) + newValue.substring(dotIndex + 1).replace(/\./g, '');
        }
        
        // 限制小数点后最多3位
        if (dotIndex !== -1 && newValue.length > dotIndex + 4) {
          newValue = newValue.substring(0, dotIndex + 4);
        }
        
        this.form.givePointRate = newValue;
      }
    },
    /** 验证赠送积分比例 */
    validateGivePointRate(rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback(new Error('赠送积分比例不能为空'));
      } else {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
          callback(new Error('赠送积分比例必须大于等于0'));
        } else {
          callback();
        }
      }
    },
    /** 更新配置操作 */
    handleUpdate() {
      this.$refs.configForm.validate(valid => {
        if (valid) {
          this.updateLoading = true;
          updateRechargeConfig(this.form).then(response => {
            this.$modal.msgSuccess("更新成功");
            this.getConfig();
          }).catch(() => {
            this.$modal.msgError("更新失败");
          }).finally(() => {
            this.updateLoading = false;
          });
        } else {
          this.$modal.msgError("请检查输入信息");
        }
      });
    }
  }
};
</script>
