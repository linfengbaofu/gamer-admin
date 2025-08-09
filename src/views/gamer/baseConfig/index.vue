<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 基础配置 -->
      <el-tab-pane label="基础配置" name="basic">
        <el-form :model="form" ref="configForm" size="small" label-width="120px">
          <el-form-item label="邀请抽水比例" prop="inviteCommissionRate">
            <el-input v-model="form.inviteCommissionRate" placeholder="请输入邀请抽水比例" />
          </el-form-item>
          <el-form-item label="下注反水比例" prop="betCommissionRate">
            <el-input v-model="form.betCommissionRate" placeholder="请输入下注反水比例" />
          </el-form-item>
          <!-- <el-form-item label="USDT兑换比率" prop="exchangeRate">
            <el-input
              type="number"
              v-model="form.exchangeRate"
              placeholder="请输入USDT兑换比率"
              clearable
            />
          </el-form-item> -->
          <el-form-item label="一级佣金比例" prop="firstLevelCommissionRate">
            <el-input v-model="form.firstLevelCommissionRate" placeholder="请输入一级佣金比例" />
          </el-form-item>
          <el-form-item label="二级佣金比例" prop="secondLevelCommissionRate">
            <el-input v-model="form.secondLevelCommissionRate" placeholder="请输入二级佣金比例" />
          </el-form-item>
          <el-form-item label="三级佣金比例" prop="threeLevelCommissionRate">
            <el-input v-model="form.threeLevelCommissionRate" placeholder="请输入三级佣金比例" />
          </el-form-item>
          <el-form-item label="下属累计存款" prop="lowerLevelTotalDeposit">
            <el-input
              type="number"
              v-model="form.lowerLevelTotalDeposit"
              placeholder="请输入下属累计存款"
              clearable
            />
          </el-form-item>
          <el-form-item label="下属累计投注" prop="lowerLevelTotalBet">
            <el-input
              type="number"
              v-model="form.lowerLevelTotalBet"
              placeholder="请输入下属累计投注"
              clearable
            />
          </el-form-item>
          <el-form-item label="充值播报金额" prop="rechargeBroadcast">
            <el-tooltip content="充值多少U以上播报" placement="top">
              <el-input
                type="number"
                v-model="form.rechargeBroadcast"
                placeholder="请输入充值播报金额"
                clearable
              />
            </el-tooltip>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 充值配置 -->
      <el-tab-pane label="充值配置" name="recharge">
        <el-form :model="form" ref="configForm" size="small" label-width="120px">
          <el-form-item label="最小充值金额" prop="minRecharge">
            <el-input
              type="number"
              v-model="form.minRecharge"
              placeholder="请输入最小充值金额"
              clearable
            />
          </el-form-item>
          <el-form-item label="最大充值金额" prop="maxRecharge">
            <el-input
              type="number"
              v-model="form.maxRecharge"
              placeholder="请输入最大充值金额"
              clearable
            />
          </el-form-item>
          <!-- <el-form-item label="充值TRC20地址" prop="trcAddr">
            <el-input v-model="form.trcAddr" placeholder="请输入TRC20地址" clearable />
          </el-form-item>
          <el-form-item label="充值ERC20地址" prop="ercAddr">
            <el-input v-model="form.ercAddr" placeholder="请输入ERC20地址" clearable />
          </el-form-item> -->
        </el-form>
      </el-tab-pane>

      <!-- 提现配置 -->
      <el-tab-pane label="提现配置" name="withdrawal">
        <el-form :model="form" ref="configForm" size="small" label-width="120px">
          <el-form-item label="最小提现金额" prop="minWithdrawal">
            <el-input
              type="number"
              v-model="form.minWithdrawal"
              placeholder="请输入最小提现金额"
              clearable
            />
          </el-form-item>
          <el-form-item label="最大提现金额" prop="maxWithdrawal">
            <el-input
              type="number"
              v-model="form.maxWithdrawal"
              placeholder="请输入最大提现金额"
              clearable
            />
          </el-form-item>
          <el-form-item label="提现手续费" prop="withdrawalCommissionRate">
            <el-input v-model="form.withdrawalCommissionRate" placeholder="请输入提现手续费比例" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div style="margin-top: 20px; text-align: center;">
      <el-button type="primary" :loading="updateLoading" @click="handleUpdate">确定</el-button>
    </div>
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
        // 当前激活的tab
        activeTab: "basic",
        // 配置表单数据
        form: {
          createBy: null, // 创建人
          createTime: null, // 创建时间
          updateBy: null, // 更新人
          updateTime: null, // 更新时间
          remark: null, // 备注
          configId: null, // 配置ID
          inviteCommissionRate: null, // 邀请抽水比例
          betCommissionRate: null, // 下注反水比例
          exchangeRate: null, // USDT兑换比率
          firstLevelCommissionRate: null, // 一级佣金比例
          secondLevelCommissionRate: null, // 二级佣金比例
          threeLevelCommissionRate: null, // 三级佣金比例
          lowerLevelTotalDeposit: null, // 下属累计存款
          lowerLevelTotalBet: null, // 下属累计投注
          minRecharge: null, // 最小充值金额
          maxRecharge: null, // 最大充值金额
          trcAddr: null, // 充值TRC20地址
          ercAddr: null, // 充值ERC20地址
          minWithdrawal: null, // 最小提现金额
          maxWithdrawal: null, // 最大提现金额
          withdrawalCommissionRate: null, // 提现手续费比例
          rechargeBroadcast: null // 充值播报金额
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
            lowerLevelTotalDeposit: data.lowerLevelTotalDeposit || null,
            lowerLevelTotalBet: data.lowerLevelTotalBet || null,
            minRecharge: data.minRecharge || null,
            maxRecharge: data.maxRecharge || null,
            trcAddr: data.trcAddr || null,
            ercAddr: data.ercAddr || null,
            minWithdrawal: data.minWithdrawal || null,
            maxWithdrawal: data.maxWithdrawal || null,
            rechargeBroadcast: data.rechargeBroadcast || null
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
        lowerLevelTotalDeposit: this.form.lowerLevelTotalDeposit || null,
        lowerLevelTotalBet: this.form.lowerLevelTotalBet || null,
        minRecharge: this.form.minRecharge || null,
        maxRecharge: this.form.maxRecharge || null,
        trcAddr: this.form.trcAddr || null,
        ercAddr: this.form.ercAddr || null,
        minWithdrawal: this.form.minWithdrawal || null,
        maxWithdrawal: this.form.maxWithdrawal || null,
        rechargeBroadcast: this.form.rechargeBroadcast || null
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
