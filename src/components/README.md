# 业务组件使用说明

## GameInfoSelect - 游戏信息选择组件

### 功能
基于 `@/api/member/GameInfo` 的 `listGameInfo` API 创建的游戏信息下拉选择组件。

### 使用方法

```vue
<template>
  <div>
    <!-- 单选 -->
    <game-info-select
      v-model="selectedGameId"
      placeholder="请选择游戏"
      @change="handleGameChange"
    />
    
    <!-- 多选 -->
    <game-info-select
      v-model="selectedGameIds"
      :multiple="true"
      placeholder="请选择多个游戏"
      @change="handleGamesChange"
    />
  </div>
</template>

<script>
import GameInfoSelect from '@/components/GameInfoSelect'

export default {
  components: {
    GameInfoSelect
  },
  data() {
    return {
      selectedGameId: null,
      selectedGameIds: []
    }
  },
  methods: {
    handleGameChange(data) {
      console.log('选中的值:', data.value)
      console.log('选中的完整数据:', data.selectedItems)
    },
    handleGamesChange(data) {
      console.log('选中的值:', data.value)
      console.log('选中的完整数据:', data.selectedItems)
    }
  }
}
</script>
```

### Props
- `value`: 选中的值 (String/Number/Array)
- `placeholder`: 占位符文本 (String)
- `clearable`: 是否可清空 (Boolean, 默认 true)
- `disabled`: 是否禁用 (Boolean, 默认 false)
- `multiple`: 是否多选 (Boolean, 默认 false)
- `filterable`: 是否可搜索 (Boolean, 默认 true)

### Events
- `change`: 选择变化时触发，参数为 `{value, selectedItems}`

---

## MemberInfoSelect - 会员信息选择组件

### 功能
基于 `@/api/member/info` 的 `listInfo` API 创建的会员信息下拉选择组件。

### 使用方法

```vue
<template>
  <div>
    <!-- 单选 -->
    <member-info-select
      v-model="selectedMemberId"
      placeholder="请选择会员"
      @change="handleMemberChange"
    />
    
    <!-- 多选 -->
    <member-info-select
      v-model="selectedMemberIds"
      :multiple="true"
      placeholder="请选择多个会员"
      @change="handleMembersChange"
    />
  </div>
</template>

<script>
import MemberInfoSelect from '@/components/MemberInfoSelect'

export default {
  components: {
    MemberInfoSelect
  },
  data() {
    return {
      selectedMemberId: null,
      selectedMemberIds: []
    }
  },
  methods: {
    handleMemberChange(data) {
      console.log('选中的值:', data.value)
      console.log('选中的完整数据:', data.selectedItems)
    },
    handleMembersChange(data) {
      console.log('选中的值:', data.value)
      console.log('选中的完整数据:', data.selectedItems)
    }
  }
}
</script>
```

### Props
- `value`: 选中的值 (String/Number/Array)
- `placeholder`: 占位符文本 (String)
- `clearable`: 是否可清空 (Boolean, 默认 true)
- `disabled`: 是否禁用 (Boolean, 默认 false)
- `multiple`: 是否多选 (Boolean, 默认 false)
- `filterable`: 是否可搜索 (Boolean, 默认 true)

### Events
- `change`: 选择变化时触发，参数为 `{value, selectedItems}`

---

## 在 MbRtpConfig 页面中的使用示例

在 `src/views/member/MbRtpConfig/index.vue` 中已经集成了这两个组件：

1. **查询表单中**：替换了原来的用户ID和游戏ID输入框
2. **编辑表单中**：替换了原来的用户ID和游戏ID输入框

当用户选择会员时，会自动填充 `mbAccount` 字段；当用户选择游戏时，会获取完整的游戏信息。 