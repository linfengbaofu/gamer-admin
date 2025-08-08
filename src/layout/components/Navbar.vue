<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <div v-if="userInfo.agentType === 1" class="right-menu-item" style="color: #409EFF;font-size: 12px;">
          积分：{{ userInfo.mbPoint }}
        </div>
        <search id="header-search" class="right-menu-item" />

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-dropdown class="right-menu-item hover-effect" trigger="click" @command="handleRecordCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-bell" style="font-size: 18px;"></i>
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </span>
          <el-dropdown-menu slot="dropdown" class="record-dropdown">
            <div class="record-header">待审核记录</div>
            
            <!-- Tab 切换 -->
            <div class="record-tabs">
              <div 
                class="tab-item" 
                :class="{ active: activeTab === 'recharge' }"
                @click="activeTab = 'recharge'"
              >
                充值记录 <span v-if="recentRechargeRecordstotal > 0" class="tab-count">({{ recentRechargeRecordstotal }})</span>
              </div>
              <div 
                class="tab-item" 
                :class="{ active: activeTab === 'withdrawal' }"
                @click="activeTab = 'withdrawal'"
              >
                提现记录 <span v-if="recentWithdrawalRecordstotal > 0" class="tab-count">({{  recentWithdrawalRecordstotal }})</span>
              </div>
            </div>

            <!-- 充值记录 -->
            <div v-show="activeTab === 'recharge'" class="record-content">
              <div v-if="recentRechargeRecords.length === 0" class="no-records">暂无待审核充值记录</div>
              <div v-else>
                <div 
                  v-for="record in recentRechargeRecords" 
                  :key="'recharge-' + record.recordId"
                  class="record-item"
                >
                  <div class="record-info">
                    <div class="record-row">
                      <span class="label">用户ID：</span>
                      <span class="value">{{ record.mbId }}</span>
                    </div>
                    <div class="record-row">
                      <span class="label">用户账号：</span>
                      <span class="value">{{ record.mbAccount }}</span>
                    </div>
                    <div class="record-row">
                      <span class="label">充值金额：</span>
                      <span class="amount">{{ record.rechargeAmount }}</span>
                    </div>
                    <div class="record-row">
                      <span class="label">实际金额：</span>
                      <span class="amount">{{ record.actualAmount }}</span>
                      <span class="label ml-2">赠送金额：</span>
                      <span class="points">{{ record.givePoints }}</span>
                    </div>
                  </div>
                </div>
                <el-dropdown-item command="recharge-more" class="more-button">
                  查看更多充值记录 →
                </el-dropdown-item>
              </div>
            </div>

            <!-- 提现记录 -->
            <div v-show="activeTab === 'withdrawal'" class="record-content">
              <div v-if="recentWithdrawalRecords.length === 0" class="no-records">暂无待审核提现记录</div>
              <div v-else>
                <div 
                  v-for="record in recentWithdrawalRecords" 
                  :key="'withdrawal-' + record.recordId"
                  class="record-item"
                >
                  <div class="record-info">
                    <div class="record-row">
                      <span class="label">用户ID：</span>
                      <span class="value">{{ record.mbId }}</span>
                    </div>
                    <div class="record-row">
                      <span class="label">用户账号：</span>
                      <span class="value">{{ record.mbAccount }}</span>
                    </div>
                    <div class="record-row">
                      <span class="label">提现金额：</span>
                      <span class="amount">{{ record.withdrawalAmount }}</span>
                    </div>
                    <div class="record-row">
                      <span class="label">实际金额：</span>
                      <span class="amount">{{ record.actualAmount }}</span>
                      <span class="label ml-2">手续费率：</span>
                      <span class="points">{{ record.freeRate }}</span>
                    </div>
                  </div>
                </div>
                <el-dropdown-item command="withdrawal-more" class="more-button">
                  查看更多提现记录 →
                </el-dropdown-item>
              </div>
            </div>
          </el-dropdown-menu>
        </el-dropdown>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> 
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { listGameRechargeRecord } from "@/api/member/GameRechargeRecord";
import { listGameWithdrawalRecord } from "@/api/member/GameWithdrawalRecord";

import { getInfo } from '@/api/login'

import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import notification from './notification.mp3'
export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  data() {
    return {
      recentRechargeRecordstotal: 0,
      recentWithdrawalRecordstotal: 0,
      url: '',
      message: "",
      text_content: "",
      ws: null,
      userInfo: {
        agentType: 0,
        mbPoint: 0
      },
      timer: null,
    notificationAudio: null,
      recentRechargeRecords: [],
      recentWithdrawalRecords: [],
      unreadCount: 0,
      activeTab: 'recharge'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'id'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  mounted() {
    // 初始化通知音频
    this.initNotificationAudio()
    
    // 组件挂载时立即获取用户信息
    this.getUserInfo().then(() => {
      this.join()
      this.getRecentRecords()
    })
    // 设置定时器，每10秒调用一次
    this.timer = setInterval(() => {
      this.getUserInfo()
      this.getRecentRecords()
    }, 10000)
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    // 清理音频资源
    if (this.notificationAudio) {
      this.notificationAudio.pause()
      this.notificationAudio = null
    }
    this.exit()
  },
  methods: {
    initNotificationAudio() {
      try {
        this.notificationAudio = new Audio(notification)
        this.notificationAudio.volume = 0.5 // 设置音量为50%
        this.notificationAudio.preload = 'auto'
      } catch (error) {
        console.error('初始化通知音频失败:', error)
      }
    },
    playNotificationSound() {
      if (this.notificationAudio) {
        try {
          // 重置音频到开始位置
          this.notificationAudio.currentTime = 0
          // 播放音频
          const playPromise = this.notificationAudio.play()
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn('音频播放失败，可能需要用户交互:', error)
            })
          }
        } catch (error) {
          console.error('播放通知音频失败:', error)
        }
      }
    },
    join() {
      console.log("连接到服务器:", this.id, this.userInfo.userId, process.env.NODE_ENV );
      // process.env.NODE_ENV === 'development'
      const wsuri = process.env.NODE_ENV === 'production' ? "wss://" + window.location.host + process.env.VUE_APP_WS_BASE_API + "?userId=" + this.userInfo.userId : "wss://" + process.env.VUE_APP_WS_BASE_API + "?userId=" + this.userInfo.userId;
      this.ws = new WebSocket(wsuri);
      const self = this;
      this.ws.onopen = function (event) {
        console.log("已经打开连接!", event);
      };
      this.ws.onmessage = function (event) {
        console.log("收到原始消息:", event.data);
        
        // 过滤心跳消息
        if (event.data === '1' || event.data === 'ping') {
          return;
        }
        if (event.data === 'userId: 1') {
          return;
        }
        try {
          const message = JSON.parse(event.data);
          
          // 过滤ping消息
          if (message.ping) {
            return;
          }
          
          console.log("解析后的消息:", message);
          self.handleWebSocketMessage(message);
        } catch (error) {
          console.error("解析WebSocket消息失败:", error, "原始数据:", event.data);
        }
      };
      this.ws.onclose = function (event) {
        console.log("已经关闭连接!", event);
      };
    },
    exit() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    },
    send() {
      if (this.ws) {
        this.ws.send(this.message);
      } else {
        alert("未连接到服务器");
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
    },
    async getUserInfo() {
      try {
        const response = await getInfo()
        if (response.code === 200) {
          this.userInfo = response.userInfo || { agentType: 0 }
        }
        return response
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },
    handleWebSocketMessage(message) {
      if (message && message.wsType) {
        switch (message.wsType) {
          case 1:
            // 充值通知
            if (message.gameRechargeRecord) {
              this.handleRechargeNotification(message.gameRechargeRecord);
            }
            break;
          case 2:
            // 提现通知
            if (message.gameWithdrawalRecord) {
              this.handleWithdrawalNotification(message.gameWithdrawalRecord);
            }
            break;
          default:
            console.log("未知的WebSocket消息类型:", message.wsType);
        }
      }
    },
    handleRechargeNotification(rechargeRecord) {
      // 处理充值记录通知
      console.log("收到充值记录通知:", rechargeRecord);
      
      // 播放通知音效
      this.playNotificationSound();
      
      const amount = rechargeRecord.rechargeAmount || 0;
      const actualAmount = rechargeRecord.actualAmount || 0;
      const givePoints = rechargeRecord.givePoints || 0;
      const mbId = rechargeRecord.mbId || '';
      const mbAccount = rechargeRecord.mbAccount || '';
      

      const payType = rechargeRecord.rechargeChannel || rechargeRecord.withdrawalChannel || "其他";
      
      // 如果有recordStatus字段，根据状态显示不同通知
      if (rechargeRecord.recordStatus !== undefined) {
        const statusMap = {
          0: "待审核",
          1: "已通过", 
          2: "已拒绝"
        };
        
        const status = statusMap[rechargeRecord.recordStatus] || "未知状态";
        
        this.$notify({
          title: '充值状态更新',
          message: `
          用户ID：${mbId}<br/>用户账号：${mbAccount}<br/>充值金额：${amount}<br/>实际金额：${actualAmount}<br/>赠送金额：${givePoints}<br/>支付方式：${payType}<br/>状态：${status}<br/> 申请时间:${rechargeRecord.createTime}`,
          dangerouslyUseHTMLString: true,
          type: rechargeRecord.recordStatus === 1 ? 'success' : rechargeRecord.recordStatus === 2 ? 'error' : 'info',
          duration: 8000
        });
        
        // 如果充值成功，刷新用户信息
        if (rechargeRecord.recordStatus === 1) {
          this.getUserInfo();
        }
        
        // 更新记录列表
        this.getRecentRecords();
      } else {
        // 新充值申请通知
        this.$notify({
          title: '新充值申请',
          message: `用户ID：${mbId}<br/>用户账号：${mbAccount}<br/>充值金额：${amount}<br/>实际金额：${actualAmount}<br/>赠送金额：${givePoints}<br/>支付方式：${payType}`,
          dangerouslyUseHTMLString: true,
          type: 'info',
          duration: 8000
        });
        
        // 更新记录列表
        this.getRecentRecords();
      }
    },
    handleWithdrawalNotification(withdrawalRecord) {
      // 处理提现记录通知
      console.log("收到提现记录通知:", withdrawalRecord);
      
      // 播放通知音效
      this.playNotificationSound();
      
      const amount = withdrawalRecord.withdrawalAmount || 0;
      const actualAmount = withdrawalRecord.actualAmount || 0;
      const freeRate = withdrawalRecord.freeRate || 0;
      const rates = withdrawalRecord.rates || 0;
      const mbId = withdrawalRecord.mbId || '';
      const mbAccount = withdrawalRecord.mbAccount || '';
      
      // 根据支付类型显示
      const payTypeMap = {
        1: "支付宝",
        2: "微信", 
        3: "银行卡",
        4: "TRC-20 USDT",
        5: "ERC-20 USDT",
        6: "云闪付",

      };
      const payType = payTypeMap[withdrawalRecord.payType] || "其他";
      
      // 如果有recordStatus字段，根据状态显示不同通知
      if (withdrawalRecord.recordStatus !== undefined) {
        const statusMap = {
          0: "待审核",
          1: "已通过",
          2: "已拒绝"
        };
        
        const status = statusMap[withdrawalRecord.recordStatus] || "未知状态";
        
        let message = `用户ID：${mbId}<br/>用户账号：${mbAccount}<br/>提现金额：${amount}<br/>实际金额：${actualAmount}<br/>手续费率：${freeRate}<br/>支付方式：${payType}`;
        if (rates > 0) {
          message += `<br/>手续费率：${rates}`;
        }
        message += `<br/>状态：${status}`;
        
        this.$notify({
          title: '提现状态更新',
          message: message,
          dangerouslyUseHTMLString: true,
          type: withdrawalRecord.recordStatus === 1 ? 'success' : withdrawalRecord.recordStatus === 2 ? 'error' : 'info',
          duration: 8000
        });
        
        // 如果提现成功，刷新用户信息
        if (withdrawalRecord.recordStatus === 1) {
          this.getUserInfo();
        }
        
        // 更新记录列表
        this.getRecentRecords();
      } else {
        // 新提现申请通知
        let message = `用户ID：${mbId}<br/>用户账号：${mbAccount}<br/>提现金额：${amount}<br/>实际金额：${actualAmount}<br/>手续费率：${freeRate}<br/>支付方式：${payType}`;
        if (rates > 0) {
          message += `<br/>手续费率：${rates}`;
        }
        
        this.$notify({
          title: '新提现申请',
          message: message,
          dangerouslyUseHTMLString: true,
          type: 'warning',
          duration: 8000
        });
        
        // 更新记录列表
        this.getRecentRecords();
      }
    },
    async getRecentRecords() {
      try {
        // 获取最近5条待审核充值记录
        const rechargeParams = {
          pageNum: 1,
          pageSize: 5,
          approvalStatus: 0  // 只查询待审核状态
        }
        const rechargeResponse = await listGameRechargeRecord(rechargeParams)
        if (rechargeResponse.code === 200) {
          this.recentRechargeRecords = rechargeResponse.rows || []
          this.recentRechargeRecordstotal = rechargeResponse.total || 0
        }

        // 获取最近5条待审核提现记录
        const withdrawalParams = {
          pageNum: 1,
          pageSize: 5,
          approverStatus: 0  // 只查询待审核状态
        }
        const withdrawalResponse = await listGameWithdrawalRecord(withdrawalParams)
        if (withdrawalResponse.code === 200) {
          this.recentWithdrawalRecords = withdrawalResponse.rows || []
          this.recentWithdrawalRecordstotal = withdrawalResponse.total || 0
        }

        // 计算未读数量（所有待审核记录）
        this.updateUnreadCount()
      } catch (error) {
        console.error('获取最近记录失败:', error)
      }
    },
    updateUnreadCount() {
      // 由于已经只查询待审核状态，所以未读数量就是记录总数
      this.unreadCount = this.recentRechargeRecordstotal + this.recentWithdrawalRecordstotal
    },
    handleRecordCommand(command) {
      switch (command) {
        case 'recharge-more':
          this.$router.push({
            name: 'GameRechargeRecord',
          })
          break
        case 'withdrawal-more':
          this.$router.push({
            name: 'GameWithdrawalRecord', 
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

/* 记录下拉菜单样式 */
.record-dropdown {
  width: 380px;
  max-height: 500px;
  overflow-y: auto;
}

.record-header {
  padding: 12px 16px;
  font-weight: bold;
  font-size: 16px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
}

/* Tab 切换样式 */
.record-tabs {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}

.tab-item {
  flex: 1;
  padding: 10px 16px;
  text-align: center;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  
  &:hover {
    color: #409eff;
    background: #f5f7fa;
  }
  
  &.active {
    color: #409eff;
    border-bottom-color: #409eff;
    background: #fff;
  }
}

.tab-count {
  color: #f56c6c;
  font-weight: 600;
}

.record-content {
  max-height: 350px;
  overflow-y: auto;
}



.record-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f7fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.record-info {
  width: 100%;
}

.record-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  font-size: 12px;
  color: #909399;
  min-width: 50px;
  flex-shrink: 0;
}

.value {
  font-size: 12px;
  color: #303133;
  margin-right: 8px;
  flex: 1;
  word-break: break-all;
}

.amount {
  font-weight: 600;
  font-size: 12px;
  color: #f56c6c;
  margin-right: 8px;
}

.points {
  font-weight: 600;
  font-size: 12px;
  color: #67c23a;
}

.ml-2 {
  margin-left: 8px;
}

.no-records {
  padding: 16px;
  text-align: center;
  color: #909399;
  font-size: 13px;
}

.more-button {
  color: #409eff !important;
  font-size: 12px;
  text-align: center;
  
  &:hover {
    background-color: #ecf5ff;
  }
}

/* 消息铃铛图标和徽章样式 */
.el-dropdown-link {
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f56c6c;
  color: white;
  border-radius: 10px;
  padding: 0 6px;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  z-index: 10;
}
</style>
