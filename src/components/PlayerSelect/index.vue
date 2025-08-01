<template>
  <el-select
    v-model="currentValue"
    :placeholder="placeholder"
    :loading="loading"
    :disabled="disabled"
    :clearable="clearable"
    :multiple="multiple"
    :size="size"
    :filterable="filterable"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="player in playerList"
      :key="player.playerId"
      :label="player.playerName"
      :value="player.playerId"
    >
      <span style="float: left">{{ player.playerName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ player.playerLevel || '暂无等级' }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { listPlayer } from '@/api/billard/player'

export default {
  name: 'PlayerSelect',
  props: {
    // 绑定值
    value: {
      type: [String, Number, Array],
      default: ''
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请选择球员'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 尺寸
    size: {
      type: String,
      default: ''
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: true
    },
    // 查询参数
    query: {
      type: Object,
      default: () => ({
        pageNum: 1,
        pageSize: 10000
      })
    }
  },
  data() {
    return {
      loading: false,
      playerList: [],
      currentValue: this.value
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.currentValue = newVal
      },
      immediate: true
    },
    query: {
      handler() {
        this.getPlayerList()
      },
      deep: true
    }
  },
  mounted() {
    this.getPlayerList()
  },
  methods: {
    // 获取球员列表
    async getPlayerList() {
      this.loading = true
      try {
        const response = await listPlayer(this.query)
        this.playerList = response.rows || []
      } catch (error) {
        console.error('获取球员列表失败:', error)
        this.$message.error('获取球员列表失败')
      } finally {
        this.loading = false
      }
    },
    // 选择改变事件
    handleChange(value) {
      this.currentValue = value
      this.$emit('input', value)
      this.$emit('change', value)
      
      // 获取选中的球员信息
      if (this.multiple) {
        const selectedPlayers = this.playerList.filter(player => 
          value.includes(player.playerId)
        )
        this.$emit('select', selectedPlayers)
      } else {
        const selectedPlayer = this.playerList.find(player => 
          player.playerId === value
        )
        this.$emit('select', selectedPlayer)
      }
    },
    // 清空事件
    handleClear() {
      this.currentValue = this.multiple ? [] : ''
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
      this.$emit('clear')
    },
    // 刷新数据
    refresh() {
      this.getPlayerList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style> 