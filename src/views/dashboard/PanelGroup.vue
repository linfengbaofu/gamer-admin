<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('totalRecharge')">
        <div class="card-panel-icon-wrapper icon-recharge">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总充值金额
          </div>
          <count-to :start-val="0" :end-val="totalRechargeAmount" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('totalWithdrawal')">
        <div class="card-panel-icon-wrapper icon-withdrawal">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总提现金额
          </div>
          <count-to :start-val="0" :end-val="totalWithdrawalAmount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('userRegistration')">
        <div class="card-panel-icon-wrapper icon-registration">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            注册人数
          </div>
          <count-to :start-val="0" :end-val="registrationCount" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('onlineUsers')">
        <div class="card-panel-icon-wrapper icon-online">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日在线
          </div>
          <count-to :start-val="0" :end-val="onlineUserCount" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      totalRechargeAmount: 1256800,
      totalWithdrawalAmount: 856400,
      registrationCount: 15680,
      onlineUserCount: 3240
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    loadData() {
      // 使用假数据，模拟数据加载
      console.log('加载假数据...')
      
      // 模拟数据加载延迟
      setTimeout(() => {
        this.totalRechargeAmount = 1256800
        this.totalWithdrawalAmount = 856400
        this.registrationCount = 15680
        this.onlineUserCount = 3240
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-recharge {
        background: #67c23a;
      }

      .icon-withdrawal {
        background: #f56c6c;
      }

      .icon-registration {
        background: #409eff;
      }

      .icon-online {
        background: #e6a23c;
      }
    }

    .icon-recharge {
      color: #67c23a;
    }

    .icon-withdrawal {
      color: #f56c6c;
    }

    .icon-registration {
      color: #409eff;
    }

    .icon-online {
      color: #e6a23c;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
