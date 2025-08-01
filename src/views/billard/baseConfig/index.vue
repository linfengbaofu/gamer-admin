<template>
  <div class="app-container">
    <el-form :model="form" ref="configForm" size="small" label-width="120px">
      <el-form-item label="邀请抽水比例(%)" prop="inviteCommissionRate">
        <el-input v-model="form.inviteCommissionRate" placeholder="请输入邀请抽水比例" />
      </el-form-item>
      <el-form-item label="下注反水比例(%)" prop="betCommissionRate">
        <el-input v-model="form.betCommissionRate" placeholder="请输入下注反水比例" />
      </el-form-item>
      <el-form-item label="USDT兑换比率" prop="exchangeRate">
        <el-input
          type="number"
          v-model="form.exchangeRate"
          placeholder="请输入USDT兑换比率"
          clearable
        />
      </el-form-item>
      <el-form-item label="百州API地址" prop="baizhouApiUrl">
        <el-input v-model="form.baizhouApiUrl" placeholder="请输入百州支付接口地址" />
      </el-form-item>
      <el-form-item label="百州商户ID" prop="baizhouMchId">
        <el-input v-model="form.baizhouMchId" placeholder="请输入百州商户ID" />
      </el-form-item>
      <el-form-item label="百州接口密钥" prop="baizhouApiKey">
        <el-input v-model="form.baizhouApiKey" placeholder="请输入百州接口密钥" type="password" show-password />
      </el-form-item>
      <el-form-item label="百州签名类型" prop="baizhouSignType">
        <el-input v-model="form.baizhouSignType" placeholder="请输入百州签名类型" />
      </el-form-item>
      <el-form-item label="百州接口版本" prop="baizhouVersion">
        <el-input v-model="form.baizhouVersion" placeholder="请输入百州接口版本" />
      </el-form-item>
      <el-form-item label="百州回调地址" prop="baizhouNotifyUrl">
        <el-input v-model="form.baizhouNotifyUrl" placeholder="请输入百州回调地址" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="updateLoading" @click="handleUpdate">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getBaseConfig, updateBaseConfig, addBaseConfig } from "@/api/billard/baseConfig";

export default {
  name: "RechargeConfig",
  data() {
    return {
      // 更新按钮loading状态
      updateLoading: false,
      // 配置表单数据
      form: {
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        configId: null,
        inviteCommissionRate: null,
        betCommissionRate: null,
        exchangeRate: null,
        baizhouApiUrl: null,
        baizhouMchId: null,
        baizhouApiKey: null,
        baizhouSignType: null,
        baizhouVersion: null,
        baizhouNotifyUrl: null
      }
    };
  },
  created() {
    this.getConfig();
  },
  methods: {
    /** 获取充值配置 */
    getConfig() {
      getBaseConfig().then(({code, data}) => {
        if (code === 200) {
          // 将后端返回的小数比例转换为百分比显示
          this.form = {
            ...data,
            inviteCommissionRate: data.inviteCommissionRate ? Number((data.inviteCommissionRate * 100).toFixed(8)) : null,
            betCommissionRate: data.betCommissionRate ? Number((data.betCommissionRate * 100).toFixed(8)) : null
          };
        }
      });
    },
    /** 更新配置操作 */
    handleUpdate() {
      this.updateLoading = true;
      // 创建提交数据副本，将百分比转换为小数
      const submitData = {
        ...this.form,
        inviteCommissionRate: this.form.inviteCommissionRate ? Number((this.form.inviteCommissionRate / 100).toFixed(8)) : null,
        betCommissionRate: this.form.betCommissionRate ? Number((this.form.betCommissionRate / 100).toFixed(8)) : null
      };
      updateBaseConfig(submitData).then(response => {
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
