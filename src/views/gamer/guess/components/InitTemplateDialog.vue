<template>
  <!-- 初始化模板对话框 -->
  <el-dialog :title="title" :visible.sync="dialogVisible" width="80%" append-to-body>
    <div class="template-form">
      <div class="form-header">
        <el-alert
          title="模板初始化"
          description="您可以修改以下模板数据，确认后将批量添加这些竞猜项"
          type="info"
          show-icon
          :closable="false">
        </el-alert>
      </div>
      
      <el-form ref="templateForm" :model="templateData" label-width="120px">
        <div v-for="(guess, guessIndex) in templateData.guessList" :key="guessIndex" class="guess-item">
          <el-card :header="`竞猜项 ${guessIndex + 1}`" shadow="hover">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item 
                  label="竞猜内容" 
                  :prop="`guessList.${guessIndex}.guessContent`"
                  :rules="{ required: true, message: '竞猜内容不能为空', trigger: 'blur' }">
                  <el-input v-model="guess.guessContent" placeholder="请输入竞猜内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="排序" 
                  :prop="`guessList.${guessIndex}.sorted`"
                  :rules="{ required: true, message: '排序不能为空', trigger: 'blur' }">
                  <el-input-number 
                    v-model="guess.sorted" 
                    :min="0" 
                    placeholder="排序"
                    style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <!-- 竞猜选项 -->
            <div class="options-section">
              <div class="options-header">
                <span class="options-title">竞猜选项</span>
                <el-button 
                  type="primary" 
                  size="mini" 
                  icon="el-icon-plus" 
                  @click="handleAddOption(guessIndex)">
                  添加选项
                </el-button>
              </div>
              
              <div v-for="(option, optionIndex) in guess.optionList" :key="optionIndex" class="option-item">
                <el-row :gutter="10" align="middle">
                  <el-col :span="8">
                    <el-form-item 
                      :label="`选项 ${optionIndex + 1}`"
                      :prop="`guessList.${guessIndex}.optionList.${optionIndex}.optionsInfo`"
                      :rules="{ required: true, message: '选项内容不能为空', trigger: 'blur' }">
                      <el-input v-model="option.optionsInfo" placeholder="选项内容" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item 
                      label="赔率"
                      :prop="`guessList.${guessIndex}.optionList.${optionIndex}.odds`"
                      :rules="{ required: true, message: '赔率不能为空', trigger: 'blur' }">
                      <el-input-number 
                        v-model="option.odds" 
                        :precision="2" 
                        :step="0.1" 
                        :min="1" 
                        placeholder="赔率"
                        style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item 
                      label="排序"
                      :prop="`guessList.${guessIndex}.optionList.${optionIndex}.sorted`"
                      :rules="{ required: true, message: '排序不能为空', trigger: 'blur' }">
                      <el-input-number 
                        v-model="option.sorted" 
                        :min="0" 
                        placeholder="排序"
                        style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-button 
                      type="danger" 
                      size="mini" 
                      icon="el-icon-delete" 
                      @click="handleDeleteOption(guessIndex, optionIndex)"
                      v-if="guess.optionList.length > 1">
                      删除
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            
            <!-- 删除整个竞猜项 -->
            <div class="guess-actions">
              <el-button 
                type="danger" 
                size="mini" 
                icon="el-icon-delete" 
                @click="handleDeleteGuess(guessIndex)"
                v-if="templateData.guessList.length > 1">
                删除此竞猜项
              </el-button>
            </div>
          </el-card>
        </div>
        
        <!-- 添加新竞猜项 -->
        <div class="add-guess-section">
          <el-button 
            type="primary" 
            icon="el-icon-plus" 
            @click="handleAddGuess">
            添加新竞猜项
          </el-button>
        </div>
      </el-form>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" :loading="loading">确认初始化</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "InitTemplateDialog",
  props: {
    title: {
      type: String,
      default: "初始化模板"
    },
    open: {
      type: Boolean,
      default: false
    },
    templateList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      templateData: {
        guessList: []
      }
    };
  },
  watch: {
    open(val) {
      this.dialogVisible = val;
      if (val) {
        this.initTemplateData();
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit("cancel");
      }
    }
  },
  methods: {
    initTemplateData() {
      // 深拷贝模板数据
      this.templateData = {
        guessList: JSON.parse(JSON.stringify(this.templateList))
      };
    },
    
    handleCancel() {
      this.dialogVisible = false;
    },
    
    submit() {
      this.$refs.templateForm.validate(valid => {
        if (valid) {
          // 验证每个竞猜项都至少有一个选项
          const hasEmptyOptions = this.templateData.guessList.some(guess => 
            !guess.optionList || guess.optionList.length === 0
          );
          
          if (hasEmptyOptions) {
            this.$message.warning("每个竞猜项至少需要一个选项");
            return;
          }
          
          this.loading = true;
          this.$emit("submitTemplate", this.templateData.guessList);
        }
      });
    },
    
    handleAddGuess() {
      const newGuess = {
        matchId: this.templateData.guessList[0]?.matchId || '',
        guessContent: "",
        sorted: this.templateData.guessList.length,
        optionList: [
          {
            optionsInfo: "",
            odds: 1.5,
            sorted: 0
          }
        ]
      };
      this.templateData.guessList.push(newGuess);
    },
    
    handleDeleteGuess(guessIndex) {
      this.templateData.guessList.splice(guessIndex, 1);
      // 重新排序
      this.templateData.guessList.forEach((guess, index) => {
        guess.sorted = index;
      });
    },
    
    handleAddOption(guessIndex) {
      const guess = this.templateData.guessList[guessIndex];
      const newOption = {
        optionsInfo: "",
        odds: 1.5,
        sorted: guess.optionList.length
      };
      guess.optionList.push(newOption);
    },
    
    handleDeleteOption(guessIndex, optionIndex) {
      const guess = this.templateData.guessList[guessIndex];
      guess.optionList.splice(optionIndex, 1);
      // 重新排序选项
      guess.optionList.forEach((option, index) => {
        option.sorted = index;
      });
    }
  }
};
</script>

<style scoped>
.template-form {
  max-height: 600px;
  overflow-y: auto;
}

.form-header {
  margin-bottom: 20px;
}

.guess-item {
  margin-bottom: 20px;
}

.options-section {
  margin-top: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.options-title {
  font-weight: bold;
  color: #303133;
}

.option-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.guess-actions {
  margin-top: 15px;
  text-align: right;
}

.add-guess-section {
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
}

.add-guess-section:hover {
  border-color: #409eff;
}
</style> 