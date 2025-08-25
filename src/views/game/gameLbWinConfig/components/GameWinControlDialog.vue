<template>
  <el-dialog :title="title" :visible="value" width="800px" append-to-body @close="handleClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <!-- 左列 -->
        <el-col :span="12">
          <el-form-item label="会员ID" prop="mbId">
            <MemberInfoSelect v-model="form.mbId" style="width: 100%;" @change="handleMemberChange"/>
          </el-form-item>

          <el-form-item label="游戏ID" prop="gameid">
            <BetGameInfoSelect v-model="form.gameid" style="width: 100%;" @change="handleGameChange"/>
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
            <el-select v-model="form.amountLimit" placeholder="请选择匹配下注金额" @change="handleAmountLimitChange" style="width: 100%;">
              <el-option
                v-for="amount in betAmountOptions"
                :key="amount"
                :label="amount"
                :value="amount"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="下注次数" prop="betCount">
            <span slot="label">
              <span>下注次数</span>
              <el-tooltip content="最大支持100次" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <el-input v-model="form.betCount" placeholder="请输入下注次数" @input="handleBetCountChange" />
          </el-form-item>
          <el-form-item label="要赢的金额" prop="winAmount">
            <el-input 
              v-model="form.winAmount" 
              placeholder="请输入要赢的金额" 
              @input="handleWinAmountChange"
              type="number"
              :min="getMinWinAmount()"
              step="0.01" />
            <div class="form-tip" style="font-size: 12px; color: #909399; margin-top: 5px;">
              允许范围：{{ getMinWinAmount() }} 到无限大
            </div>
          </el-form-item>     
        </el-col>
      </el-row>
      <el-divider content-position="center">
        <el-switch v-model="form.enableAdvanced" active-text="显示高级配置" inactive-text="隐藏高级配置" />
      </el-divider>
      <div v-if="form.enableAdvanced">
          <!-- 高级配置选项 -->
          <template v-if="form.enableAdvanced">
            <el-form-item label="是否开启" prop="isOpen">
              <el-select v-model="form.isOpen" placeholder="请选择是否开启" style="width: 100%;"> 
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="零率" prop="zeroRate">
              <span slot="label">
                <span>零率</span>
                <el-tooltip content="零率范围" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.zeroRate" placeholder="请输入零率" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </template>
      </div>
      <!-- 轮次列表（生成参数后显示） -->
      <el-divider v-if="showRoundList" content-position="left">轮次配置 总赢金额：{{ form.totalWinAmount }}</el-divider>
      
      <div v-if="showRoundList" class="round-list-section">
        <el-table height="300" :data="roundList" border style="width: 100%;overflow-y: auto;" show-summary :summary-method="getRoundSummary">
          <el-table-column label="轮次" type="index" width="100" align="center"></el-table-column>
          <el-table-column label="匹配下注金额" prop="amountLimit" align="center"></el-table-column>
          <el-table-column label="倍率" align="center" >
            <template slot-scope="scope">
              <el-input 
                v-model="scope.row.rate" 
                size="mini" 
                @input="handleRateChange(scope.$index)"
                placeholder="请输入倍率">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="对应金额" prop="betAmount" align="center" ></el-table-column>
        </el-table>
        
        <div class="round-actions" style="margin-top: 15px;">
          <el-button type="success" size="mini" @click="recalculateTotal">重新计算</el-button>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button 
        type="warning" 
        icon="el-icon-refresh" 
        @click="generateRandomParams"
        :loading="randomParamsLoading"
        :disabled="!canClickRandomButton || randomParamsLoading"
        >
        {{ randomParamsLoading ? '生成中...' : '随机生成参数' }}
      </el-button>
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

  },
  data() {
    return {
      betAmountOptions: [],
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
        zeroRate: null,
        totalWinAmount: null,
        enableAdvanced: false
      },
      // 轮次列表
      roundList: [],
      // 是否显示轮次列表
      showRoundList: false,
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
          { required: true, message: "要赢的金额不能为空", trigger: "blur" },
          { 
            validator: this.validateWinAmountRule, 
            trigger: "blur" 
          }
        ],
        betCount: [
          { required: true, message: "下注次数不能为空", trigger: "blur" }
        ],
        // totalWinAmount: [
        //   { required: true, message: "总赢金额不能为空", trigger: "blur" }
        // ],
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
    this.initForm();
    this.getConfig();
  },
  methods: {
    getConfig() {
      getBaseConfig().then(response => {
        this.form.zeroRate = response.data.zeroRate;
      });
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

      this.roundList = [];
      this.showRoundList = false;
      this.canClickRandomButton = false;
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
      });
    },
    
    /** 检查是否显示随机生成按钮 */
    checkCanClickRandomButton() {
      console.log(this.form.amountLimit, this.form.winAmount, this.form.betCount, this.form.mbId, this.form.gameid);
      this.canClickRandomButton = !!(this.form.amountLimit && 
                                     this.form.winAmount && 
                                     this.form.betCount && 
                                     this.form.mbId && 
                                     this.form.gameid);
    },

    /** 处理要赢金额变化 */
    handleWinAmountChange() {
      this.checkCanClickRandomButton();
      this.validateWinAmount();
      this.resetRoundList();
    },

    /** 重置轮次列表 */
    resetRoundList() {
      this.roundList = [];
      this.showRoundList = false;
      this.form.betRateList = null;
      this.form.totalWinAmount = null;
    },

    /** 验证要赢金额是否在允许范围内 */
    validateWinAmount() {
      const minAmount = this.getMinWinAmount();
      const currentAmount = Number(this.form.winAmount);
      
      if (this.form.winAmount !== '' && currentAmount < minAmount) {
        this.$message.warning(`要赢的金额不能小于 ${minAmount}`);
        this.form.winAmount = minAmount;
      }
    },

    /** 计算最小允许的要赢金额 */
    getMinWinAmount() {
      const amountLimit = Number(this.form.amountLimit || 0);
      const betCount = Number(this.form.betCount || 0);
      return -(amountLimit * betCount);
    },

    /** 要赢金额的自定义验证器 */
    validateWinAmountRule(rule, value, callback) {
      if (value === '' || value === null) {
        callback();
        return;
      }
      
      const minAmount = this.getMinWinAmount();
      const currentAmount = Number(value);
      
      if (currentAmount < minAmount) {
        callback(new Error(`要赢的金额不能小于 ${minAmount}`));
      } else {
        callback();
      }
    },

    /** 处理匹配下注金额变化 */
    handleAmountLimitChange() {
      this.checkCanClickRandomButton();
      this.validateWinAmount();
      this.resetRoundList();
    },

    /** 处理下注次数变化 */
    handleBetCountChange() {
      this.checkCanClickRandomButton();
      this.validateWinAmount();
      this.resetRoundList();
    },
    
    /** 随机生成参数 */
    generateRandomParams() {
      this.randomParamsLoading = true;
      
      const randomParams = {
        amountLimit: this.form.amountLimit,
        winAmount: this.form.winAmount,
        betCount: this.form.betCount,
        zeroRate: this.form.zeroRate,
        mbId: this.form.mbId,
        gameid: this.form.gameid
      };
      
      gameLbWinConfig(randomParams).then(response => {
        const formData = response.data;
        if (formData.betRateList) {
          this.form.betRateList = formData.betRateList;
          // 生成轮次列表
          this.generateRoundList();
        }
        if (formData.totalWinAmount) {
          this.form.totalWinAmount = formData.totalWinAmount;
        }
        this.showRoundList = true;
        this.$modal.msgSuccess("参数验证成功，数据已回显！");
      }).catch(error => {
        this.$modal.msgError("参数验证失败：" + (error.message || "未知错误"));
      }).finally(() => {
        this.randomParamsLoading = false;
      });
    },

    /** 生成轮次列表 */
    generateRoundList() {
      if (!this.form.betRateList || !this.form.amountLimit) return;
      
      const rates = this.form.betRateList.split(',');
      const amountLimit = Number(this.form.amountLimit || 0);
      
      this.roundList = rates.map((rate, index) => {
        const rateValue = Number(rate || 0);
        const betAmount = amountLimit > 0 && rateValue > 0 ? 
          Number(Number((amountLimit * rateValue).toFixed(8))) : 0;
        
        return {
          index: index,
          amountLimit: amountLimit,
          rate: rateValue,
          betAmount: betAmount
        };
      });
      
      // 生成轮次列表后，计算总赢金额
      this.calculateTotalWinAmount();
    },

    /** 处理倍率变化 */
    handleRateChange(index) {
      const round = this.roundList[index];
      const amountLimit = Number(this.form.amountLimit || 0);
      const rateValue = Number(round.rate || 0);
      
      if (amountLimit > 0 && rateValue > 0) {
        round.betAmount = Number(Number((amountLimit * rateValue).toFixed(8)));
      } else {
        round.betAmount = 0;
      }
      
      // 更新倍率列表和总赢金额
      this.updateBetRateList();
      this.calculateTotalWinAmount();
    },

    /** 更新倍率列表 */
    updateBetRateList() {
      this.form.betRateList = this.roundList.map(round => round.rate).join(',');
    },

    /** 计算总赢金额 */
    calculateTotalWinAmount() {
      // 计算对应金额总和
      const totalBetAmount = this.roundList.reduce((sum, round) => {
        return sum + (Number(round.betAmount) || 0);
      }, 0);
      
      // 计算下注次数 * 匹配下注金额
      const betCount = Number(this.form.betCount || 0);
      const amountLimit = Number(this.form.amountLimit || 0);
      const totalBetCost = betCount * amountLimit;
      
      // 总赢金额 = 对应金额总和 - （下注次数 * 匹配下注金额）
      this.form.totalWinAmount = Number(Number((totalBetAmount - totalBetCost).toFixed(8)));
    },



    /** 重新计算 */
    recalculateTotal() {
      this.roundList.forEach((round, index) => {
        this.handleRateChange(index);
      });
    },

    /** 计算轮次表格汇总行 */
    getRoundSummary(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 1) {
          // 匹配下注金额列，不显示汇总内容
          return;
        }
        if (index === 2) {
          // 倍率列，不显示汇总内容
          return;
        }
        if (index === 3) {
          // 对应金额列，计算总和
          const values = data.map(item => {
            if (item.betAmount === '0') return 0;
            const amount = parseFloat(item.betAmount);
            return isNaN(amount) ? 0 : amount;
          });
          if (!values.every(value => value === 0)) {
            const total = values.reduce((prev, curr) => {
              return Number(Number(prev) + Number(curr)).toFixed(8);
            }, 0);
            sums[index] = total;
          } else {
            sums[index] = '0';
          }
          return;
        }
        sums[index] = '';
      });
      return sums;
    },
    
    /** 提交表单 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 检查是否有轮次配置数据
          if (!this.showRoundList || this.roundList.length === 0) {
            this.$message.warning('请先点击"随机生成参数"按钮生成轮次配置数据');
            return;
          }
          
          // 如果没有开启高级配置，设置默认值
          if (!this.form.enableAdvanced) {
            this.form.isOpen = 1;
            this.form.remark = '';
            this.form.zeroRate = this.form.zeroRate || 0.01; // 使用已设置的零率或默认值
          }
          
          this.submitLoading = true;
          const params = {
            ...this.form,
            beginTime: this.form.createTime[0],
            endTime: this.form.createTime[1]
          };
          delete params.createTime;
          delete params.enableAdvanced;
          
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
      console.log(data);
      if(data.selectedItems){
        this.form.mbAccount = data.selectedItems.mbAccount;
      }
    },
    
    handleGameChange(data) {
      console.log(data);
      if(data.selectedItems){
        this.form.twName = data.selectedItems.twName;
        this.betAmountOptions = data.selectedItems.betAmount.split(',') || [];
      }
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

.round-list-section {
  margin-top: 20px;
}

.round-actions {
  text-align: center;
}

.round-actions .el-button {
  margin: 0 5px;
}
</style>
