<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :filterable="filterable"
    :remote="true"
    :remote-method="remoteSearch"
    :loading="loading"
    @change="handleChange"
    @clear="handleClear"
    @focus="handleFocus"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option
      v-for="item in memberInfoList"
      :key="item.mbId"
      :label="item.mbAccount || item.mbId"
      :value="item.mbId"
    >
      <span style="float: left">{{ item.mbAccount || item.mbId }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mbId }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { listInfo } from '@/api/member/info'

export default {
  name: 'MemberInfoSelect',
  props: {
    value: {
      type: [String, Number, Array],
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择会员'
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
      memberInfoList: [],
      selectedValue: this.value,
      loading: false,
      searchKeyword: '',
      hasInitialized: false
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.selectedValue = newVal
        // 如果value有值且还未初始化，则根据mbId搜索
        if (newVal && !this.hasInitialized) {
          this.searchByMbId(newVal)
        }
      },
      immediate: true
    },
    selectedValue(newVal) {
      this.$emit('input', newVal)
    }
  },
  created() {
    // 如果初始值存在，则根据mbId搜索；否则加载默认列表
    if (this.value) {
      this.searchByMbId(this.value)
    } else {
      this.loadDefaultMemberList()
    }
  },
  methods: {
    // 根据mbId搜索会员
    async searchByMbId(mbId) {
      if (!mbId) return
      
      this.loading = true
      try {
        const response = await listInfo({
          pageNum: 1,
          pageSize: 10,
          mbId: mbId
        })
        
        if (response.rows && response.rows.length > 0) {
          this.memberInfoList = response.rows
          this.hasInitialized = true
        } else {
          // 如果没找到，尝试加载默认列表
          this.loadDefaultMemberList()
        }
      } catch (error) {
        console.error('根据mbId搜索会员失败:', error)
        this.$message.error('搜索会员失败')
        this.loadDefaultMemberList()
      } finally {
        this.loading = false
      }
    },
    
    // 加载默认会员列表
    async loadDefaultMemberList() {
      this.loading = true
      try {
        const response = await listInfo({
          pageNum: 1,
          pageSize: 20 // 减少默认加载数量
        })
        this.memberInfoList = response.rows || []
      } catch (error) {
        console.error('加载会员信息失败:', error)
        this.$message.error('加载会员信息失败')
      } finally {
        this.loading = false
      }
    },
    
    // 远程搜索方法
    async remoteSearch(query) {
      if (query === '') {
        // 如果搜索词为空，加载默认列表
        this.loadDefaultMemberList()
        return
      }
      
      this.searchKeyword = query
      this.loading = true
      
      try {
        const response = await listInfo({
          pageNum: 1,
          pageSize: 20,
          mbAccount: query // 使用mbAccount进行搜索
        })
        
        this.memberInfoList = response.rows || []
      } catch (error) {
        console.error('远程搜索会员失败:', error)
        this.$message.error('搜索会员失败')
        this.memberInfoList = []
      } finally {
        this.loading = false
      }
    },
    
    // 处理焦点事件
    handleFocus() {
      // 如果当前没有数据且没有搜索关键词，加载默认列表
      if (this.memberInfoList.length === 0 && !this.searchKeyword) {
        this.loadDefaultMemberList()
      }
    },
    
    handleChange(value) {
      this.selectedValue = value
      const selectedItems = this.multiple 
        ? this.memberInfoList.filter(item => value.includes(item.mbId))
        : this.memberInfoList.find(item => item.mbId === value)
      
      this.$emit('change', {
        value,
        selectedItems
      })
    },
    
    handleClear() {
      this.selectedValue = this.multiple ? [] : null
      this.searchKeyword = ''
      this.loadDefaultMemberList() // 清空后重新加载默认列表
      this.$emit('change', {
        value: this.selectedValue,
        selectedItems: this.multiple ? [] : null
      })
    },
    
    // 获取选中项的完整数据
    getSelectedData() {
      if (this.multiple) {
        return this.memberInfoList.filter(item => this.selectedValue.includes(item.mbId))
      } else {
        return this.memberInfoList.find(item => item.mbId === this.selectedValue)
      }
    }
  }
}
</script> 