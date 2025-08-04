<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="用户id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入用户账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现通道" prop="withdrawalChannel">
        <el-select v-model="queryParams.withdrawalChannel" placeholder="请选择提现通道">
          <el-option v-for="dict in dict.type.record_withdrawal_channel" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="合营id" prop="hyId">
        <el-input
          v-model="queryParams.hyId"
          placeholder="请输入合营id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请人id" prop="inMbId">
        <el-input
          v-model="queryParams.inMbId"
          placeholder="请输入邀请人id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请人账号" prop="inMbAccount">
        <el-input
          v-model="queryParams.inMbAccount"
          placeholder="请输入邀请人账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:GameWithdrawalRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="GameWithdrawalRecordList" @selection-change="handleSelectionChange">
      <el-table-column label="用户id" align="center" prop="mbId" :fixed="true"/>
      <el-table-column label="用户账号" align="center" prop="mbAccount" />
      <el-table-column label="提现通道" align="center" prop="withdrawalChannel" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.record_withdrawal_channel" :value="scope.row.withdrawalChannel" />
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center" prop="withdrawalAmount" />
      <el-table-column label="实际金额" align="center" prop="actualAmount" />
      <el-table-column label="手续费率" align="center" prop="freeRate" />
      <el-table-column label="手续费率" align="center" prop="rates" />
      <el-table-column label="审批人" align="center" prop="approver" />
      <el-table-column label="审批时间" align="center" prop="approverTime" width="180"></el-table-column>
      <el-table-column label="审批状态" align="center" prop="approverStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.record_withdrawal_status" :value="scope.row.approverStatus" />
        </template>
      </el-table-column>
      <el-table-column label="合营id" align="center" prop="hyId" />
      <el-table-column label="邀请人id" align="center" prop="inMbId" />
      <el-table-column label="邀请人账号" align="center" prop="inMbAccount" />
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
   
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleAudit(scope.row)"
            v-hasPermi="['member:GameWithdrawalRecord:audit']"
          >审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input v-model="form.mbAccount" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="提现通道" prop="withdrawalChannel">
          <el-input v-model="form.withdrawalChannel" placeholder="请输入提现通道" />
        </el-form-item>
        <el-form-item label="提现金额" prop="withdrawalAmount">
          <el-input v-model="form.withdrawalAmount" placeholder="请输入提现金额" />
        </el-form-item>
        <el-form-item label="实际金额" prop="actualAmount">
          <el-input v-model="form.actualAmount" placeholder="请输入实际金额" />
        </el-form-item>
        <el-form-item label="手续费率" prop="freeRate">
          <el-input v-model="form.freeRate" placeholder="请输入手续费率" />
        </el-form-item>
        <el-form-item label="手续费率" prop="rates">
          <el-input v-model="form.rates" placeholder="请输入手续费率" />
        </el-form-item>
        <el-form-item label="审批人" prop="approver">
          <el-input v-model="form.approver" placeholder="请输入审批人" />
        </el-form-item>
        <el-form-item label="审批时间" prop="approverTime">
          <el-date-picker clearable
            v-model="form.approverTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择审批时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合营id" prop="hyId">
          <el-input v-model="form.hyId" placeholder="请输入合营id" />
        </el-form-item>
        <el-form-item label="邀请人id" prop="inMbId">
          <el-input v-model="form.inMbId" placeholder="请输入邀请人id" />
        </el-form-item>
        <el-form-item label="邀请人账号" prop="inMbAccount">
          <el-input v-model="form.inMbAccount" placeholder="请输入邀请人账号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog title="审核提现记录" :visible.sync="auditOpen" width="500px" append-to-body>
      <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="100px">
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input v-model="auditForm.mbAccount" disabled />
        </el-form-item>
        <el-form-item label="提现金额" prop="withdrawalAmount">
          <el-input v-model="auditForm.withdrawalAmount" disabled />
        </el-form-item>
        <el-form-item label="实际金额" prop="actualAmount">
          <el-input v-model="auditForm.actualAmount" disabled />
        </el-form-item>
        <el-form-item label="审核状态" prop="approverStatus">
          <el-select v-model="auditForm.approverStatus" placeholder="请选择审核状态">
            <el-option v-for="dict in dict.type.record_withdrawal_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注" prop="auditRemark">
          <el-input v-model="auditForm.auditRemark" type="textarea" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAuditForm">确 定</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGameWithdrawalRecord, getGameWithdrawalRecord, delGameWithdrawalRecord, addGameWithdrawalRecord, updateGameWithdrawalRecord } from "@/api/member/GameWithdrawalRecord";

export default {
  dicts: ['record_withdrawal_channel', 'record_withdrawal_status'],
  name: "GameWithdrawalRecord",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 提现记录表格数据
      GameWithdrawalRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        mbAccount: null,
        withdrawalChannel: null,
        withdrawalAmount: null,
        actualAmount: null,
        freeRate: null,
        rates: null,
        approver: null,
        approverTime: null,
        approverStatus: null,
        hyId: null,
        inMbId: null,
        inMbAccount: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 审核弹窗显示状态
      auditOpen: false,
      // 审核表单数据
      auditForm: {
        id: null,
        mbAccount: null,
        withdrawalAmount: null,
        actualAmount: null,
        approverStatus: null,
        auditRemark: null
      },
      // 审核表单校验
      auditRules: {
        approverStatus: [
          { required: true, message: "审核状态不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询提现记录列表 */
    getList() {
      this.loading = true;
      listGameWithdrawalRecord(this.queryParams).then(response => {
        this.GameWithdrawalRecordList = response.rows;
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
        id: null,
        mbId: null,
        mbAccount: null,
        withdrawalChannel: null,
        withdrawalAmount: null,
        actualAmount: null,
        freeRate: null,
        rates: null,
        approver: null,
        approverTime: null,
        approverStatus: null,
        hyId: null,
        inMbId: null,
        inMbAccount: null
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加提现记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameWithdrawalRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提现记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGameWithdrawalRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameWithdrawalRecord(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除提现记录编号为"' + ids + '"的数据项？').then(function() {
        return delGameWithdrawalRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/GameWithdrawalRecord/export', {
        ...this.queryParams
      }, `GameWithdrawalRecord_${new Date().getTime()}.xlsx`)
    },
    /** 审核按钮操作 */
    handleAudit(row) {
      this.auditForm = {
        id: row.id,
        mbAccount: row.mbAccount,
        withdrawalAmount: row.withdrawalAmount,
        actualAmount: row.actualAmount,
        approverStatus: row.approverStatus,
        auditRemark: row.auditRemark || null
      };
      this.auditOpen = true;
    },
    /** 取消审核 */
    cancelAudit() {
      this.auditOpen = false;
      this.resetAuditForm();
    },
    /** 重置审核表单 */
    resetAuditForm() {
      this.auditForm = {
        id: null,
        mbAccount: null,
        withdrawalAmount: null,
        actualAmount: null,
        approverStatus: null,
        auditRemark: null
      };
      this.resetForm("auditForm");
    },
    /** 提交审核 */
    submitAuditForm() {
      this.$refs["auditForm"].validate(valid => {
        if (valid) {
          // TODO: 调用审核API
          console.log('审核数据:', this.auditForm);
          this.$modal.msgSuccess("审核成功");
          this.auditOpen = false;
          this.getList();
        }
      });
    }
  }
};
</script>
