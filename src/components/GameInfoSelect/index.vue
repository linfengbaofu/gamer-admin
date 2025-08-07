<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :filterable="filterable"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="item in gameInfoList"
      :key="item.id"
      :label="item.gameName || item.gameId"
      :value="item.id"
    >
      <span style="float: left">{{ item.twName || item.usName }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { listGameInfo } from '@/api/member/GameInfo'

export default {
  name: 'GameInfoSelect',
  props: {
    value: {
      type: [String, Number, Array],
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择游戏'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      gameInfoList: [],
      selectedValue: this.value
    }
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal
    },
    selectedValue(newVal) {
      this.$emit('input', newVal)
    }
  },
  created() {
    this.loadGameInfoList()
  },
  methods: {
    async loadGameInfoList() {
      try {
        const response = await listGameInfo({
          pageNum: 1,
          pageSize: 1000 // 获取所有游戏信息
        })
        this.gameInfoList = response.rows || []
      } catch (error) {
        console.error('加载游戏信息失败:', error)
        this.$message.error('加载游戏信息失败')
      }
    },
    handleChange(value) {
      this.selectedValue = value
      const selectedItems = this.multiple 
        ? this.gameInfoList.filter(item => value.includes(item.id))
        : this.gameInfoList.find(item => item.id === value)
      
      this.$emit('change', {
        value,
        selectedItems
      })
    },
    handleClear() {
      this.selectedValue = this.multiple ? [] : null
      this.$emit('change', {
        value: this.selectedValue,
        selectedItems: this.multiple ? [] : null
      })
    },
    // 获取选中项的完整数据
    getSelectedData() {
      if (this.multiple) {
        return this.gameInfoList.filter(item => this.selectedValue.includes(item.id))
      } else {
        return this.gameInfoList.find(item => item.id === this.selectedValue)
      }
    }
  }
}
</script> 