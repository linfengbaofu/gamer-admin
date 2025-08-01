<template>
  <!-- 修改竞猜对话框 -->
  <el-dialog :title="title" :visible.sync="dialogVisible" width="700px" append-to-body>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="竞猜基本设置" name="basic">
        <el-form ref="form" inline :model="formData" :rules="rules" label-width="100px" size="small">
          <el-form-item label="竞猜内容" prop="guessContent">
            <el-input v-model="formData.guessContent" type="textarea" :rows="3" placeholder="请输入竞猜内容" />
            <!-- <editor v-model="formData.guessContent" :min-height="192"/> -->
          </el-form-item>
          <el-form-item label="备注信息" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注信息" />
          </el-form-item>
          <el-form-item label="排序" prop="sorted">
            <el-input v-model="formData.sorted" placeholder="请输入排序" />
          </el-form-item>
          <el-form-item label="竞猜状态" prop="guessStatus">
            <el-select v-model="formData.guessStatus" placeholder="请选择竞猜状态">
              <el-option v-for="item in dict.type.guess_status" :key="item.value" :label="item.label" :value="+item.value" />
            </el-select>
          </el-form-item>
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
  dicts: ['guess_status'],
  name: "EditGuessDialog",
  props: {
    title: {
      type: String,
      default: "修改竞猜"
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
      formData: {
        guessId: null,
        guessContent: null,
        remark: null,
        sorted: null,
        guessStatus: null
      },
      rules: {
        sorted: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        guessContent: [
          { required: true, message: "竞猜内容不能为空", trigger: "blur" }
        ],
        guessStatus: [
          { required: true, message: "竞猜状态不能为空", trigger: "blur" }
        ]
      },
      loading: false
    };
  },
  watch: {
    open(val) {
      this.dialogVisible = val;
      if (val) {
        this.formData = {...this.form};
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit("cancel");
      }
    },
    form: {
      handler(val) {
        console.log(val);
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
    handleCancel() {
      this.dialogVisible = false;
    },
    submit() {
      // 验证基本表单
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$emit("submitForm", {...this.formData});
        }
      });
    },
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