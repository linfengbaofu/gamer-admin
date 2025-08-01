<template>
  <!-- 查看竞猜详情对话框 -->
  <el-dialog :title="title" :visible.sync="dialogVisible" width="700px" append-to-body>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="竞猜基本信息" name="basic">
        <el-form ref="form" :model="formData" label-width="100px" size="small">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="竞猜ID">
                <span>{{ formData.guessId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="赛事ID">
                <span>{{ formData.matchId }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="赛事名称">
            <div style="border: 1px solid #dcdfe6; padding: 10px; border-radius: 4px; background-color: #f5f7fa;">
              {{ formData.matchName || '-' }}
            </div>
          </el-form-item>
          <el-form-item label="竞猜内容">
            <div style="border: 1px solid #dcdfe6; padding: 10px; border-radius: 4px; background-color: #f5f7fa;">
              {{ formData.guessContent || '-' }}
            </div>
          </el-form-item>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="竞猜状态">
                <dict-tag :options="dict.type.guess_status" :value="formData.guessStatus"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序">
                <span>{{ formData.sorted }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="备注信息">
            <div style="border: 1px solid #dcdfe6; padding: 10px; border-radius: 4px; background-color: #f5f7fa;">
              {{ formData.remark || '-' }}
            </div>
          </el-form-item>
          
          <el-row :gutter="20" v-if="formData.drawingUser || formData.drawingTime">
            <el-col :span="12">
              <el-form-item label="开奖人">
                <span>{{ formData.drawingUser || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开奖时间">
                <span>{{ formData.drawingTime ? parseTime(formData.drawingTime, '{y}-{m}-{d} {h}:{i}:{s}') : '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="竞猜选项" name="options">
        <div v-loading="optionLoading">
          <div v-if="optionList && optionList.length > 0">
            <div v-for="(option, index) in optionList" :key="index" class="option-item">
              <el-row :gutter="20">
                <el-col :span="8">
                  <strong>选项名称：</strong>{{ option.optionsInfo }}
                </el-col>
                <el-col :span="8">
                  <strong>赔率：</strong>{{ option.odds }}
                </el-col>
                <el-col :span="8">
                  <strong>是否中奖：</strong>
                  <el-tag :type="option.winFlag === 1 ? 'success' : option.winFlag === 2 ? 'danger' : 'info'">
                    {{ option.winFlag === 1 ? '是' : option.winFlag === 2 ? '否' : '未开奖' }}
                  </el-tag>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top: 8px;">
                <el-col :span="12">
                  <strong>选项ID：</strong>{{ option.optionId }}
                </el-col>
                <el-col :span="12">
                  <strong>排序：</strong>{{ option.sorted }}
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-else style="text-align: center; padding: 40px; color: #909399;">
            暂无竞猜选项
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { listGuessOptionRecord } from "@/api/billard/guessOptionRecord";

export default {
  dicts: ['guess_status'],
  name: "ViewGuessDialog",
  props: {
    title: {
      type: String,
      default: "查看竞猜审批详情"
    },
    open: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeTab: "basic",
      dialogVisible: false,
      optionLoading: false,
      optionList: [],
      formData: {
        guessId: null,
        matchId: null,
        guessContent: null,
        guessStatus: null,
        remark: null,
        drawingUser: null,
        drawingTime: null,
        sorted: null
      }
    };
  },
  watch: {
    open(val) {
      this.dialogVisible = val;
      if (val) {
        this.formData = {...this.form};
        this.getGuessOptions();
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit("cancel");
      }
    },
    form: {
      handler(val) {
        if (val?.guessId) {
          this.formData = {...val};
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.formData = {...this.form};
  },
  methods: {
    parseTime,
    handleCancel() {
      this.dialogVisible = false;
    },
    handleTabClick(tab) {
      // 当切换到竞猜选项tab时，获取选项数据
      if (tab.name === 'options' && this.formData.guessId) {
        this.getGuessOptions();
      }
    },
    // 获取竞猜选项数据
    getGuessOptions() {
      console.log('getGuessOptions', this.formData);
      if (!this.formData.recordId) {
        return;
      }
      
      this.optionLoading = true;
      const queryParams = {
        recordId: this.formData.recordId,
        pageNum: 1,
        pageSize: 999
      };
      
      listGuessOptionRecord(queryParams).then(response => {
        this.optionList = response.rows || [];
      }).catch(error => {
        console.error('获取竞猜选项失败:', error);
        this.optionList = [];
      }).finally(() => {
        this.optionLoading = false;
      });
    }
  }
};
</script>

<style scoped>
.option-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.option-item:last-child {
  margin-bottom: 0;
}

.el-form-item {
  margin-bottom: 18px;
}
</style> 