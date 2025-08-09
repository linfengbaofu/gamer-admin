<template>
  <div class="app-container">
    <!-- 刷新按钮 -->
    <div class="refresh-container">
      <el-button type="primary" @click="refreshData" :loading="loading">
        <i class="el-icon-refresh"></i>
        刷新数据
      </el-button>
    </div>
    
    <!-- 组织架构图 -->
    <div class="chart-container" v-if="!loading">
      <vo-basic :data="chartData" :pan="true"  :ntoggleSiblingsResp="true"></vo-basic>
    </div>
  </div>
</template>

<script>
import 'vue-orgchart/dist/style.min.css'
import { listInfo } from '@/api/member/info'
import { VoBasic } from 'vue-orgchart'
export default {
  components: { VoBasic },
  data() {
    return {
      chartData: [],
      loading: false
    }
  },
  created () {
    this.getList()
    // this.chartData = {
    //   name: 'Root',
    //   children: []
    // }
  },
  methods: {
    getList() {
      this.loading = true
      listInfo({
        pageNum: 1,
        pageSize: 9999,
      }).then(res => {
        console.log(res)
        this.transformToHierarchy(res.rows)
        this.loading = false
      }).catch(error => {
        console.error('获取数据失败:', error)
        this.loading = false
      })
    },
    
    refreshData() {
      this.getList()
    },
    
    transformToHierarchy(rows) {
      // 创建用户映射表，以mbId为key
      const userMap = new Map()
      
      // 初始化所有用户节点
      rows.forEach(user => {
        userMap.set(user.mbId, {
          name: `${user.nickName || user.mbAccount || user.mbId}`,
          mbId: user.mbId,
          mbAccount: user.mbAccount,
          nickName: user.nickName,
          inviteCount: user.inviteCount,
          mbPoint: user.mbPoint,
          children: [],
          inMbId: user.inMbId
        })
      })
      
      // 构建层级关系 - inMbId是父ID
      const rootNodes = []
      
      rows.forEach(user => {
        const node = userMap.get(user.mbId)
        
        if (user.inMbId && userMap.has(user.inMbId)) {
          // 如果有父ID(inMbId)，添加到父节点的children中
          const parentNode = userMap.get(user.inMbId)
          parentNode.children.push(node)
        } else {
          // node.inMbId = node.mbId
          // 如果没有父ID，作为根节点
          rootNodes.push(node)
        }
      })
      console.log(rootNodes)
      // 更新chartData
      this.chartData = {
        name: '用户层级关系',
        children: rootNodes
      }
    }
  }
}
</script>

<style>
.orgchart .node {
  width: 230px !important;
  word-break: break-all;
  white-space: normal;
  text-overflow: none;
  
}
.orgchart .node .title {
  height: auto;
  font-size: 16px;
  white-space:none;
}
</style>
<style scoped>
.orgchart .node {
  width: 180px;
}
.refresh-container {
  margin-bottom: 20px;
  text-align: center;
}

.chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 自定义节点样式 - 让节点更大 */
:deep(.orgchart) {
  background: #fff;
}

:deep(.orgchart .node) {
  width: 180px;
  height: 80px;
  border: 2px solid #409eff;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  color: white;
  font-weight: bold;
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

:deep(.orgchart .node:hover) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

:deep(.orgchart .lines .topLine) {
  background-color: #409eff;
  height: 3px;
}

:deep(.orgchart .lines .rightLine) {
  border-right: 3px solid #409eff;
}

:deep(.orgchart .lines .leftLine) {
  border-left: 3px solid #409eff;
}

:deep(.orgchart .lines .topLine.leftLine) {
  border-left: 3px solid #409eff;
}

:deep(.orgchart .lines .topLine.rightLine) {
  border-right: 3px solid #409eff;
}
</style>
