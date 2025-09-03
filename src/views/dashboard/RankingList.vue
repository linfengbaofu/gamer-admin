<template>
  <div class="ranking-list-container">
    <div class="ranking-header">
      <h3>{{ title }}</h3>
      <el-button type="text" @click="refreshData" :loading="loading">
        <i class="el-icon-refresh"></i> 刷新
      </el-button>
    </div>
    <div class="ranking-content" ref="rankingContent">
      <div class="ranking-list" :style="{ transform: `translateY(-${scrollOffset}px)` }">
        <div 
          v-for="(item, index) in displayList" 
          :key="item.id || index"
          class="ranking-item"
          :class="{ 'top-three': index < 3 }"
        >
          <div class="rank-number">
            <span v-if="index < 3" class="medal">
              <i :class="getMedalClass(index)"></i>
            </span>
            <span v-else class="number">{{ index + 1 }}</span>
          </div>
          <div class="user-info">
            <div class="username">{{ item.username || item.playerName || '未知用户' }}</div>
            <div class="amount">¥{{ formatAmount(item.amount) }}</div>
          </div>
          <div class="time">{{ formatTime(item.createTime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankingList',
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['recharge', 'withdrawal'].includes(value)
    },
    title: {
      type: String,
      default: '排行榜'
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      list: [],
      displayList: [],
      scrollOffset: 0,
      scrollTimer: null,
      loading: false,
      currentIndex: 0
    }
  },
  mounted() {
    this.loadData()
    this.startScroll()
  },
  beforeDestroy() {
    this.stopScroll()
  },
  methods: {
    loadData() {
      this.loading = true
      
      // 模拟API调用延迟
      setTimeout(() => {
        this.list = this.generateMockData()
        this.displayList = [...this.list, ...this.list] // 复制一份用于无缝滚动
        this.currentIndex = 0
        this.loading = false
      }, 300)
    },
    generateMockData() {
      const mockData = []
      const userNames = ['游戏玩家', '高手玩家', 'VIP用户', '新手玩家', '资深玩家', '超级玩家', '顶级玩家', '传奇玩家', '王者玩家', '至尊玩家']
      
      for (let i = 0; i < this.limit; i++) {
        const baseAmount = this.type === 'recharge' ? 50000 : 30000
        const randomAmount = Math.floor(Math.random() * 80000) + baseAmount
        
        mockData.push({
          id: i + 1,
          username: userNames[i] || `玩家${i + 1}`,
          amount: randomAmount,
          createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
      return mockData.sort((a, b) => b.amount - a.amount)
    },
    startScroll() {
      this.scrollTimer = setInterval(() => {
        if (this.displayList.length > this.limit) {
          this.scrollOffset += 1
          if (this.scrollOffset >= this.limit * 60) { // 60px per item
            this.scrollOffset = 0
            this.currentIndex = (this.currentIndex + 1) % this.limit
          }
        }
      }, 50)
    },
    stopScroll() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer)
        this.scrollTimer = null
      }
    },
    refreshData() {
      this.stopScroll()
      this.loadData()
      this.$nextTick(() => {
        this.startScroll()
      })
    },
    getMedalClass(index) {
      const classes = ['el-icon-medal', 'el-icon-medal', 'el-icon-medal']
      return classes[index] || 'el-icon-medal'
    },
    formatAmount(amount) {
      return parseFloat(amount || 0).toLocaleString()
    },
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped>
.ranking-list-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  height: 400px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  .ranking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;

    h3 {
      margin: 0;
      color: #303133;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .ranking-content {
    height: 320px;
    overflow: hidden;
    position: relative;

    .ranking-list {
      transition: transform 0.1s linear;
    }
  }

  .ranking-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f7fa;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f5f7fa;
      transform: translateX(5px);
    }

    &.top-three {
      background: linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%);
      
      &:nth-child(1) {
        background: linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, transparent 100%);
      }
      
      &:nth-child(2) {
        background: linear-gradient(90deg, rgba(192, 192, 192, 0.2) 0%, transparent 100%);
      }
      
      &:nth-child(3) {
        background: linear-gradient(90deg, rgba(205, 127, 50, 0.2) 0%, transparent 100%);
      }
    }

    .rank-number {
      width: 40px;
      text-align: center;
      margin-right: 15px;

      .medal {
        font-size: 20px;
        
        &:nth-child(1) {
          color: #ffd700;
        }
        
        &:nth-child(2) {
          color: #c0c0c0;
        }
        
        &:nth-child(3) {
          color: #cd7f32;
        }
      }

      .number {
        font-size: 16px;
        font-weight: bold;
        color: #909399;
      }
    }

    .user-info {
      flex: 1;
      margin-right: 15px;

      .username {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .amount {
        font-size: 16px;
        color: #67c23a;
        font-weight: bold;
      }
    }

    .time {
      font-size: 12px;
      color: #909399;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .ranking-list-container {
    padding: 15px;
    height: 350px;

    .ranking-content {
      height: 270px;
    }

    .ranking-item {
      padding: 10px 0;

      .rank-number {
        width: 30px;
        margin-right: 10px;
      }

      .user-info {
        margin-right: 10px;

        .username {
          font-size: 13px;
        }

        .amount {
          font-size: 14px;
        }
      }

      .time {
        font-size: 11px;
      }
    }
  }
}
</style>
