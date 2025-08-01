<template>
  <div class="app-container">
    <el-form :model="form" ref="configForm" size="small" label-width="120px">
      <el-form-item label="最小提现金额" prop="minWithdrawalAmout">
        <el-input
          v-model="form.minWithdrawalAmout"
          placeholder="请输入最小提现金额"
          clearable
        />
      </el-form-item>
      <el-form-item label="最大提现金额" prop="maxRechargeAmout">
        <el-input
          v-model="form.maxRechargeAmout"
          placeholder="请输入最大提现金额"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item label="抽水比例" prop="pumpRate">
        <el-input
          v-model="form.pumpRate"
          placeholder="请输入抽水比例"
          clearable
        />
      </el-form-item> -->
      <el-form-item label="提现开关" prop="isOpen">
        <el-switch
          v-model="form.isOpen"
          :active-value="1"
          :inactive-value="0"
          active-text="开启"
          inactive-text="关闭"
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
import { getWithdrawalConfig, updateWithdrawalConfig } from "@/api/billard/withdrawalConfig";

export default {
  name: "RechargeConfig",
  data() {
    return {
      // 更新按钮loading状态
      updateLoading: false,
      // 配置表单数据
      form: {
        configId: null,
        minWithdrawalAmout: null,
        maxRechargeAmout: null,
        payChannel: null,
        mbId: null,
        pumpRate: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        isOpen: 1
      }
    };
  },
  created() {
    this.getConfig();
  },
  methods: {
    /** 获取充值配置 */
    getConfig() {
      getWithdrawalConfig().then(({code, data}) => {
        if (code === 200) {
          this.form = data;
        }
      });
    },
    /** 更新配置操作 */
    handleUpdate() {
      this.updateLoading = true;
      updateWithdrawalConfig(this.form).then(response => {
        this.$modal.msgSuccess("更新成功");
        this.getConfig();
      }).catch(() => {
        this.$modal.msgError("更新失败");
      }).finally(() => {
        this.updateLoading = false;
      });
    }
  }
};
</script>
