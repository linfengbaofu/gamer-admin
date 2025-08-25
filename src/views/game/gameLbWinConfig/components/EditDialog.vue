<template>
  <el-dialog
    title="修改游戏输赢控制"
    :visible.sync="visible"
    width="900px"
    append-to-body
    @close="handleClose"
  >
    <div style="height: 400px; overflow-y: auto">
      <!-- 只读信息展示 -->
      <el-descriptions :column="2" border>
        <el-descriptions-item label="会员ID">{{ formData.mbId }}</el-descriptions-item>
        <el-descriptions-item label="会员账号">{{ formData.mbAccount }}</el-descriptions-item>
        <el-descriptions-item label="游戏ID">{{ formData.gameid }}</el-descriptions-item>
        <el-descriptions-item label="游戏名称">{{ formData.twName }}</el-descriptions-item>
        <el-descriptions-item label="单局下注金额">{{ formData.amountLimit }}</el-descriptions-item>
        <el-descriptions-item label="要赢的金额">{{ formData.winAmount }}</el-descriptions-item>
        <el-descriptions-item label="下注次数">{{ formData.betCount }}</el-descriptions-item>
        <el-descriptions-item label="零率">{{ formData.zeroRate }}</el-descriptions-item>
        <el-descriptions-item label="总赢金额">
          {{ formData.totalWinAmount }}
          <el-tooltip content="总赢金额= 多轮下注获奖金额总和 - (单局下注金额 * 下注次数)" placement="top">
            <i class="el-icon-question" style="margin-left: 5px; color: #909399;"></i>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ formData.remark || "无" }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">可修改配置</el-divider>

      <!-- 可修改的表单项 -->
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px">
        <el-form-item label="是否开启" prop="isOpen">
          <el-select v-model="editForm.isOpen" placeholder="请选择是否开启" style="width: 200px;"> 
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="控制时间" prop="createTime">
          <el-date-picker 
            clearable
            v-model="editForm.createTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择控制时间"
            style="width: 400px;">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">轮次详情</el-divider>

      <!-- 轮次详情表格 -->
      <div class="detail-section">
        <RoundDetailTable :detailData="formData" />
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateGameLbWinConfig } from "@/api/game/gameLbWinConfig";
import RoundDetailTable from './RoundDetailTable.vue'

export default {
  name: "EditDialog",
  components: {
    RoundDetailTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editForm: {
        configId: null,
        isOpen: 1,
        createTime: []
      },
      submitLoading: false,
      rules: {
        isOpen: [
          { required: true, message: "是否开启不能为空", trigger: "change" }
        ],
        createTime: [
          { required: true, message: "控制时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.initEditForm();
  },
  methods: {
    /** 初始化编辑表单数据 */
    initEditForm() {
      this.editForm = {
        configId: this.formData.configId,
        isOpen: this.formData.isOpen,
        createTime: this.formData.beginTime && this.formData.endTime ? 
          [this.formData.beginTime, this.formData.endTime] : []
      };
    },
    
    /** 提交表单 */
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const params = {
            configId: this.editForm.configId,
            isOpen: this.editForm.isOpen,
            beginTime: this.editForm.createTime[0],
            endTime: this.editForm.createTime[1]
          };
          
          updateGameLbWinConfig(params).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.$emit('success');
            this.handleClose();
          }).catch(() => {
            // 提交失败时重置loading状态
            this.submitLoading = false;
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    
    /** 关闭对话框 */
    handleClose() {
      this.$emit("update:visible", false);
      this.$emit("close");
      this.resetForm();
    },
    
    /** 重置表单 */
    resetForm() {
      this.editForm = {
        configId: null,
        isOpen: 1,
        createTime: []
      };
      this.$nextTick(() => {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
      });
    }
  },
};
</script>

<style scoped>
.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.el-descriptions {
  margin-bottom: 20px;
}

.el-divider {
  margin: 20px 0;
}

.el-table {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}

.el-form-item {
  margin-bottom: 18px;
}
</style>
