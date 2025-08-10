<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="链" prop="assetsChain">
        <el-input
          v-model="queryParams.assetsChain"
          placeholder="请输入链"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种" prop="coin">
        <el-input
          v-model="queryParams.coin"
          placeholder="请输入币种"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值地址" prop="payAddr">
        <el-input
          v-model="queryParams.payAddr"
          placeholder="请输入充值地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['member:financeConfig:add']"
          >新增</el-button
        >
      </el-col>
      
    </el-row>

    <el-table v-loading="loading" :data="financeConfigList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="配置id" align="center" prop="assetsId" :fixed="true"/>

      <el-table-column label="封面" align="center" prop="assetsImg">
        <template slot-scope="scope">
          <image-preview :src="scope.row.assetsImg" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="链" align="center" prop="assetsChain" />
      <el-table-column label="币种" align="center" prop="coin" />
      <el-table-column label="合约地址" align="center" prop="contractAddr" width="350"/>
      <el-table-column label="充值地址" align="center" prop="payAddr" width="350"/>
      <el-table-column label="充值类型" align="center" prop="rechargeType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.recharge_type"
            :value="scope.row.rechargeType"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="提现类型" align="center" prop="withdrawalType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.withdrawal_type"
            :value="scope.row.withdrawalType"
          />
        </template>
      </el-table-column> -->
      <el-table-column label="最小充值" align="center" prop="minRecharge" />
      <!-- <el-table-column label="最小提现" align="center" prop="minWithdrawal" /> -->
      <!-- <el-table-column label="精度" align="center" prop="accuracy" /> -->

      <el-table-column label="充值提现费率" align="center" prop="rates" show-overflow-tooltip="" width="150"/>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="150"/> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="150"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:financeConfig:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:financeConfig:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改充值提现配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="封面" prop="assetsImg">
          <image-upload v-model="form.assetsImg" />
        </el-form-item>
        <el-form-item label="链" prop="assetsChain">
          <el-input
            v-model="form.assetsChain"
            placeholder="请输入链"
            :disabled="!!form.assetsId"
          />
        </el-form-item>
        <el-form-item label="币种" prop="coin">
          <el-input
            v-model="form.coin"
            placeholder="请输入币种"
            :disabled="!!form.assetsId"
          />
        </el-form-item>
        <el-form-item label="合约地址" prop="contractAddr">
          <el-input
            v-model="form.contractAddr"
            placeholder="请输入合约地址"
            :disabled="!!form.assetsId"
          />
        </el-form-item>
        <el-form-item label="充值地址" prop="payAddr">
          <el-input
            v-model="form.payAddr"
            placeholder="请输入充值地址"
          />
        </el-form-item>
        <el-form-item label="最小充值" prop="minRecharge">
          <el-input v-model="form.minRecharge" placeholder="请输入最小充值" />
        </el-form-item>
        <el-form-item label="最小提现" prop="minWithdrawal">
          <el-input v-model="form.minWithdrawal" placeholder="请输入最小提现" />
        </el-form-item>
        <el-form-item label="充值类型" prop="rechargeType">
          <el-select
            v-model="form.rechargeType"
            placeholder="充值类型"
            clearable
          >
            <el-option
              v-for="dict in dict.type.recharge_type"
              :key="dict.value"
              :label="dict.label"
              :value="Number(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提现类型" prop="withdrawalType">
          <el-select
            v-model="form.withdrawalType"
            placeholder="提现类型"
            clearable
          >
            <el-option
              v-for="dict in dict.type.withdrawal_type"
              :key="dict.value"
              :label="dict.label"
              :value="Number(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="精度" prop="accuracy">
          <el-input v-model="form.accuracy" placeholder="请输入精度" />
        </el-form-item>
        <el-form-item label="充值提现费率" prop="rates">
          <el-input v-model="form.rates" placeholder="请输入充值提现费率" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFinanceConfig,
  getFinanceConfig,
  delFinanceConfig,
  addFinanceConfig,
  updateFinanceConfig,
} from "@/api/member/financeConfig";

export default {
  name: "FinanceConfig",
  dicts: ["recharge_type", "withdrawal_type"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 充值提现配置表格数据
      financeConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assetsChain: null,
        coin: null,
        assetsImg: null,
        contractAddr: null,
        payAddr: null,
        rechargeType: null,
        withdrawalType: null,
        minRecharge: null,
        minWithdrawal: null,
        rates: null,
      },
      // 表单参数
      form: {
        rechargeType: 1,
        withdrawalType: 0,
        // minRecharge: 0,
        // minWithdrawal: 0,
        accuracy: 6,
        // rates: 0,
        // remark: null,
      },
      // 表单校验
      rules: {
        assetsChain: [
          { required: true, message: "链不能为空", trigger: "blur" },
        ],
        coin: [{ required: true, message: "币种不能为空", trigger: "blur" }],
        assetsImg: [{ required: true, message: "封面不能为空", trigger: "blur" }],
        contractAddr: [{ required: true, message: "合约地址不能为空", trigger: "blur" }],
        payAddr: [{ required: true, message: "充值地址不能为空", trigger: "blur" }],
        minRecharge: [{ required: true, message: "最小充值不能为空", trigger: "blur" }],
        minWithdrawal: [{ required: true, message: "最小提现不能为空", trigger: "blur" }],
        // accuracy: [{ required: true, message: "精度不能为空", trigger: "blur" }],
        rates: [{ required: true, message: "充值提现费率不能为空", trigger: "blur" }],
        rechargeType: [
          { required: true, message: "充值类型不能为空", trigger: "blur" },
          { validator: this.validateType, trigger: "blur" },
        ],
        withdrawalType: [
          { required: true, message: "提现类型不能为空", trigger: "blur" },
          { validator: this.validateType, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    validateType(rule, value, callback) {
      if(this.form.withdrawalType == 1 && this.form.rechargeType == 1){
        callback(new Error("充值类型和提现类型不能同时开启"));
      }
      if (value === null) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    },
    /** 查询充值提现配置列表 */
    getList() {
      this.loading = true;
      listFinanceConfig(this.queryParams).then((response) => {
        this.financeConfigList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        assetsId: null,
        assetsChain: null,
        coin: null,
        assetsImg: null,
        contractAddr: null,
        payAddr: null,
        rechargeType: 1,
        withdrawalType: 0,
        minRecharge: null,
        minWithdrawal: null,
        accuracy: 6,
        rates: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加充值提现配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getFinanceConfig(row.assetsId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改充值提现配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // this.form.rechargeType = this.form.rechargeType.join(",");
          // this.form.withdrawalType = this.form.withdrawalType.join(",");
          if (this.form.assetsId != null) {
            updateFinanceConfig(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFinanceConfig(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const assetsIds = row.assetsId;
      this.$modal
        .confirm('是否确认删除充值提现配置编号为"' + assetsIds + '"的数据项？')
        .then(function () {
          return delFinanceConfig(assetsIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "member/financeConfig/export",
        {
          ...this.queryParams,
        },
        `financeConfig_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
