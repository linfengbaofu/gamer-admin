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
      <el-form-item label="一级佣金比例(%)" prop="firstLevelCommissionRate">
        <el-input v-model="form.firstLevelCommissionRate" placeholder="请输入一级佣金比例" />
      </el-form-item>
      <el-form-item label="二级佣金比例(%)" prop="secondLevelCommissionRate">
        <el-input v-model="form.secondLevelCommissionRate" placeholder="请输入二级佣金比例" />
      </el-form-item>
      <el-form-item label="三级佣金比例(%)" prop="threeLevelCommissionRate">
        <el-input v-model="form.threeLevelCommissionRate" placeholder="请输入三级佣金比例" />
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
  name: "BaseConfig",
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
        firstLevelCommissionRate: null,
        secondLevelCommissionRate: null,
        threeLevelCommissionRate: null
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
            betCommissionRate: data.betCommissionRate ? Number((data.betCommissionRate * 100).toFixed(8)) : null,
            firstLevelCommissionRate: data.firstLevelCommissionRate ? Number((data.firstLevelCommissionRate * 100).toFixed(8)) : null,
            secondLevelCommissionRate: data.secondLevelCommissionRate ? Number((data.secondLevelCommissionRate * 100).toFixed(8)) : null,
            threeLevelCommissionRate: data.threeLevelCommissionRate ? Number((data.threeLevelCommissionRate * 100).toFixed(8)) : null
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
        betCommissionRate: this.form.betCommissionRate ? Number((this.form.betCommissionRate / 100).toFixed(8)) : null,
        firstLevelCommissionRate: this.form.firstLevelCommissionRate ? Number((this.form.firstLevelCommissionRate / 100).toFixed(8)) : null,
        secondLevelCommissionRate: this.form.secondLevelCommissionRate ? Number((this.form.secondLevelCommissionRate / 100).toFixed(8)) : null,
        threeLevelCommissionRate: this.form.threeLevelCommissionRate ? Number((this.form.threeLevelCommissionRate / 100).toFixed(8)) : null
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
