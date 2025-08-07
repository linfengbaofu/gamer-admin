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
    this.loadMemberInfoList()
  },
  methods: {
    async loadMemberInfoList() {
      try {
        const response = await listInfo({
          pageNum: 1,
          pageSize: 9999 // 获取所有会员信息
        })
        this.memberInfoList = response.rows || []
      } catch (error) {
        console.error('加载会员信息失败:', error)
        this.$message.error('加载会员信息失败')
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