<template>
  <el-dialog :title="title" :visible="value" width="800px" append-to-body @close="handleClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <!-- 左列 -->
        <el-col :span="12">
          <el-form-item label="会员ID" prop="mbId">
            <MemberInfoSelect v-model="form.mbId" style="width: 100%;" @change="handleMemberChange"/>
          </el-form-item>

          <el-form-item label="游戏ID" prop="gameid">
            <BetGameInfoSelect v-model="form.gameid" style="width: 100%;" @change="handleGameChange"/>
          </el-form-item>

          <el-form-item label="是否开启" prop="isOpen">
            <el-select v-model="form.isOpen" placeholder="请选择是否开启" style="width: 100%;"> 
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="控制时间" prop="createTime">
            <el-date-picker clearable
              v-model="form.createTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择控制时间"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        
        <!-- 分割线 -->
        <el-col :span="1" style="display: flex; justify-content: center; align-items: center;">
          <el-divider direction="vertical" style="height: 100%; margin: 0;"></el-divider>
        </el-col>
        
        <!-- 右列 -->
        <el-col :span="11">
          <el-form-item label="匹配下注金额" prop="amountLimit">
            <span slot="label">
              <span>匹配下注金额</span>
              <el-tooltip content="金额匹配成功开始控制" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <el-select v-model="form.amountLimit" placeholder="请选择匹配下注金额" @change="checkCanClickRandomButton" style="width: 100%;">
              <el-option
                v-for="amount in betAmountOptions"
                :key="amount"
                :label="amount"
                :value="amount"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="误差率" prop="allowRate">
            <span slot="label">
              <span>误差率</span>
              <el-tooltip content="误差率范围" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <el-input v-model="form.allowRate" placeholder="请输入误差率" />
          </el-form-item>
          <el-form-item label="要赢的金额" prop="winAmount">
            <el-input v-model="form.winAmount" placeholder="请输入要赢的金额" @input="checkCanClickRandomButton" />
          </el-form-item>
          <el-form-item label="下注次数" prop="betCount">
            <span slot="label">
              <span>下注次数</span>
              <el-tooltip content="最大支持100次" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <el-input v-model="form.betCount" placeholder="请输入下注次数" @input="checkCanClickRandomButton" />
          </el-form-item>
          
          <!-- 总赢金额显示 -->
          <el-form-item label="总赢金额" prop="totalWinAmount">
            <el-input v-model="form.totalWinAmount" placeholder="总赢金额" readonly  />
          </el-form-item>
          
          <el-form-item label="倍率列表" prop="betRateList">
            <span slot="label">
              <span>倍率列表</span>
              <el-tooltip content="请输入倍率列表，格式为：1.0,2.0,3.0" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <el-input v-model="form.betRateList" type="textarea" placeholder="请输入内容" readonly />
          </el-form-item>
          
          <!-- 随机生成按钮 -->
          <el-form-item>
            <el-button 
              type="warning" 
              icon="el-icon-refresh" 
              @click="generateRandomParams"
              :loading="randomParamsLoading"
              :disabled="!canClickRandomButton || randomParamsLoading"
              style="width: 100%;">
              {{ randomParamsLoading ? '生成中...' : '随机生成参数' }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="submitLoading" :disabled="submitLoading">确 定</el-button>
      <el-button @click="handleClose" :disabled="submitLoading">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addGameLbWinConfig, gameLbWinConfig } from "@/api/game/gameLbWinConfig";
import { getBaseConfig } from "@/api/billard/baseConfig";
import BetGameInfoSelect from '../BetGameInfoSelect/index.vue'
import MemberInfoSelect from '@/components/MemberInfoSelect'
export default {
  name: "GameWinControlDialog",
  components: {
    BetGameInfoSelect,
    MemberInfoSelect
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "游戏输赢控制"
    },
    formData: {
      type: Object,
      default: () => ({})
    },

    betAmountOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        configId: null,
        mbId: null,
        mbAccount: null,
        gameid: null,
        twName: null,
        amountLimit: null,
        betRateList: null,
        betCount: null,
        isOpen: 1,
        beginTime: null,
        endTime: null,
        remark: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        createTime: [],
        winAmount: null,
        allowRate: null,
        totalWinAmount: null,

      },
      // 是否显示随机生成按钮
      canClickRandomButton: false,
      // 提交按钮loading状态
      submitLoading: false,
      // 随机生成参数loading状态
      randomParamsLoading: false,
      // 表单校验规则
      rules: {
        mbId: [
          { required: true, message: "会员ID不能为空", trigger: "blur" }
        ],
        mbAccount: [
          { required: true, message: "会员账号不能为空", trigger: "blur" }
        ],
        gameid: [
          { required: true, message: "游戏ID不能为空", trigger: "blur" }
        ],
        twName: [
          { required: true, message: "游戏名称不能为空", trigger: "blur" }
        ],
        isOpen: [
          { required: true, message: "是否开启不能为空", trigger: "change" }
        ],
        amountLimit: [
          { required: true, message: "匹配下注金额不能为空", trigger: "blur" }
        ],
        winAmount: [
          { required: true, message: "要赢的金额不能为空", trigger: "blur" }
        ],
        betCount: [
          { required: true, message: "下注次数不能为空", trigger: "blur" }
        ],
        totalWinAmount: [
          { required: true, message: "总赢金额不能为空", trigger: "blur" }
        ],
        betRateList: [
          { required: true, message: "倍率列表不能为空", trigger: "blur" }
        ],
        allowRate: [
          { required: true, message: "误差率不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "控制时间不能为空", trigger: "blur" }
        ]
      }
    };
  },

  created() { 
    this.getConfig();
    this.initForm();
  },
  methods: {
    getConfig() { 
      // 可以在这里获取其他配置信息
    },
    /** 初始化表单数据 */
    initForm() {
      if (this.formData && Object.keys(this.formData).length > 0) {
        const formData = { ...this.formData };
        if (formData.beginTime && formData.endTime) {
          formData.createTime = [formData.beginTime, formData.endTime];
        } else {
          formData.createTime = [];
        }
        this.form = { ...this.form, ...formData };
        this.checkCanClickRandomButton();
      } else {
        this.resetForm();
      }
    },
    
    /** 重置表单 */
    resetForm() {
      
      this.canClickRandomButton = false;
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
      });
    },
    
    /** 检查是否显示随机生成按钮 */
    checkCanClickRandomButton() {
      this.canClickRandomButton = !!(this.form.amountLimit && 
                                     this.form.winAmount && 
                                     this.form.betCount && 
                                     this.form.allowRate && 
                                     this.form.mbId && 
                                     this.form.gameid);
    },
    
    /** 随机生成参数 */
    generateRandomParams() {
      this.randomParamsLoading = true;
      
      const randomParams = {
        amountLimit: this.form.amountLimit,
        winAmount: this.form.winAmount,
        betCount: this.form.betCount,
        allowRate: this.form.allowRate,
        mbId: this.form.mbId,
        gameid: this.form.gameid
      };
      
      gameLbWinConfig(randomParams).then(response => {
        const formData = response.data;
        if (formData.betRateList) {
          this.form.betRateList = formData.betRateList;
        }
        if (formData.totalWinAmount) {
          this.form.totalWinAmount = formData.totalWinAmount;
        }
        this.$modal.msgSuccess("参数验证成功，数据已回显！");
      }).catch(error => {
        this.$modal.msgError("参数验证失败：" + (error.message || "未知错误"));
      }).finally(() => {
        this.randomParamsLoading = false;
      });
    },
    
    /** 提交表单 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const params = {
            ...this.form,
            beginTime: this.form.createTime[0],
            endTime: this.form.createTime[1]
          };
          delete params.createTime;
          
          addGameLbWinConfig(params).then(response => {
            this.$modal.msgSuccess("新增成功");
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
      this.$emit('update:visible', false);
      this.$emit('close');
      this.resetForm();
    },
    handleMemberChange(data) {
      this.form.mbAccount = data.mbAccount;
    },
    handleGameChange(data) {
      this.form.twName = data.twName;
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.el-form-item {
  margin-bottom: 18px;
}

.el-divider--vertical {
  height: 100%;
  margin: 0;
}
</style>
