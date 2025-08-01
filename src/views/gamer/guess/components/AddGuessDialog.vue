<template>
  <!-- 添加或修改竞猜对话框 -->
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" append-to-body>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="竞猜基本设置" name="basic">
        <el-form ref="form" inline :model="formData" :rules="rules" label-width="100px" size="small">
          <el-form-item label="竞猜内容" prop="guessContent">
            <el-input v-model="formData.guessContent" type="textarea" :rows="3" placeholder="请输入竞猜内容" />
          </el-form-item>
          <el-form-item label="备注信息" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注信息" />
          </el-form-item>
     
          <el-form-item label="排序" prop="sorted">
            <el-input v-model="formData.sorted" placeholder="请输入排序" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="竞猜选项配置" name="options">
        <el-button style="margin-bottom: 10px;" type="primary" icon="el-icon-plus" @click="handleAddOption" size="mini">添加选项</el-button>

        <el-form ref="optionsForm" :model="formData" label-width="100px">
          <div v-for="(item, index) in formData.optionList" :key="index" class="option-item">
            <el-divider content-position="left">选项 {{ index + 1 }}</el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="'选项内容'" :prop="'optionList.' + index + '.optionsInfo'" :rules="{ required: true, message: '选项内容不能为空', trigger: 'blur' }">
                  <el-input v-model="item.optionsInfo" placeholder="请输入选项内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'当前赔率'" :prop="'optionList.' + index + '.odds'" :rules="{ required: true, message: '当前赔率不能为空', trigger: 'blur' }">
                  <el-input-number v-model="item.odds" :precision="2" :step="0.1" :min="1" placeholder="请输入当前赔率" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'排序'" :prop="'optionList.' + index + '.sorted'" :rules="{ required: true, message: '排序不能为空', trigger: 'blur' }">
                  <el-input-number v-model="item.sorted" :precision="0" :step="1" :min="0" placeholder="排序" />
                  <el-button style="margin-left: 10px;" type="danger" icon="el-icon-delete" circle @click="handleDeleteOption(index)"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

        </el-form>
      </el-tab-pane>
    </el-tabs>
    
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "GuessDialog",
  props: {
    title: {
      type: String,
      default: ""
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
      formData: {},
      loading: false,
      rules: {
        guessContent: [
          { required: true, message: "竞猜内容不能为空", trigger: "blur" }
        ],
        sorted: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    open(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit("cancel");
      }
    },
    form: {
      handler(val) {
        this.formData = JSON.parse(JSON.stringify(val));
        if (!this.formData.optionList) {
          this.formData.optionList = [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false;
    },
    submit() {
      // 验证基本表单
      this.$refs.form.validate(valid => {
        if (valid) {
          // 验证选项表单
          if (this.formData.optionList.length === 0) {
            this.$message.warning("请至少添加一个竞猜选项");
            this.activeTab = "options";
            return;
          }
          
          // 验证所有选项是否有效
          let optionsValid = true;
          this.formData.optionList.forEach((item, index) => {
            if (!item.optionsInfo || !item.odds || item.sorted === undefined || item.sorted === null) {
              optionsValid = false;
            }
          });
          
          if (!optionsValid) {
            this.$message.warning("请完善所有竞猜选项信息");
            this.activeTab = "options";
            return;
          }
          
          // 提交表单
          this.loading = true;
          this.$emit("submitForm", this.formData);
        }
      });
    },
    handleAddOption() {
      this.formData.optionList.push({
        optionsInfo: "",
        odds: 1,
        sorted: this.formData.optionList.length
      });
    },
    handleDeleteOption(index) {
      this.formData.optionList.splice(index, 1);
      // 更新排序
      this.formData.optionList.forEach((item, idx) => {
        item.sorted = idx;
      });
    }
  }
};
</script>

<style scoped>
.option-item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.option-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-top: 10px;
}
</style> 