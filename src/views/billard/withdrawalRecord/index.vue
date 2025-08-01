<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单号" prop="recordNo">
        <el-input
          v-model="queryParams.recordNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="会员id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入会员id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="会员账号" prop="mbAccount"> 
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入会员账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
        />
      </el-form-item>
      <el-form-item label="记录状态" prop="recordStatus">
        <el-select v-model="queryParams.recordStatus" placeholder="请选择记录状态" clearable>
          <el-option v-for="item in dict.type.billard_withdrawal_record_record_status" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
          v-hasPermi="['billard:withdrawalRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="withdrawalRecordList" @selection-change="handleSelectionChange">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="recordId" width="180"/>
      <el-table-column label="订单号" align="center" prop="recordNo" width="180"/>
      <el-table-column label="会员id" align="center" prop="mbId" width="180"/>
      <el-table-column label="会员" align="center" prop="mbAccount" width="180"/>
      <el-table-column label="支付类型" align="center" prop="payType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_withdrawal_record_pay_type" :value="scope.row.payType"/>
        </template>
      </el-table-column>
      <el-table-column label="记录状态" align="center" prop="recordStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_withdrawal_record_record_status" :value="scope.row.recordStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="提现金额" align="center" prop="withdrawalAmout" />
      <el-table-column label="提现积分数" align="center" prop="withdrawalPoints" />
      <el-table-column label="支付凭证" align="center" prop="payImg" >
        <template slot-scope="scope">
          <el-image :src="scope.row.payImg" style="width: 100px; height: 100px;" />
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="auditBy" />
      <el-table-column label="审批时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抽水积分" align="center" prop="pumpPoints" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>
      <el-table-column label="操作" align="center" fixed="right" width="130" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            v-if="scope.row.recordStatus === 0"
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleAudit(scope.row)"
            v-hasPermi="['billard:withdrawalRecord:edit']"
          >审批</el-button>
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

    <!-- 添加或修改提现记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审批状态" prop="recordStatus">
          <el-select v-model="form.recordStatus" placeholder="请选择审批状态">
            <!-- <el-option v-for="item in dict.type.billard_withdrawal_record_record_status" :key="item.value" :label="item.label" :value="item.value" /> -->
            <el-option label="通过" :value="1" />
            <el-option label="拒绝" :value="2" />
          </el-select>
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
import { listWithdrawalRecord, getWithdrawalRecord, delWithdrawalRecord, addWithdrawalRecord, updateWithdrawalRecord, auditWithdrawalRecord } from "@/api/billard/withdrawalRecord";

export default {
  dicts: ['billard_withdrawal_record_pay_type', 'billard_withdrawal_record_record_status'],
  name: "WithdrawalRecord",
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
      withdrawalRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recordNo: null,
        mbId: null,
        payType: null,
        recordStatus: null,
        withdrawalAmout: null,
        withdrawalPoints: null,
        payImg: null,
        auditBy: null,
        auditTime: null,
        pumpAmount: null,
        createTime: [],
      },
      // 表单参数
      form: {
        recordStatus: null
      },
      // 表单校验
      rules: {
        mbId: [
          { required: true, message: "会员id不能为空", trigger: "blur" }
        ],
        recordStatus: [
          { required: true, message: "记录状态", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleParams() {
      const { createTime, ...rest} = this.queryParams;
      const params = { ...rest };
      if (createTime) {
        params.beginDate = createTime[0];
        params.endDate = createTime[1];
      }
      return params;
    },
    /** 查询提现记录列表 */
    getList() {
      this.loading = true;
      listWithdrawalRecord(this.handleParams()).then(response => {
        this.withdrawalRecordList = response.rows;
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
        recordId: null,
        recordNo: null,
        mbId: null,
        payType: null,
        recordStatus: null,
        remark: null,
        withdrawalAmout: null,
        withdrawalPoints: null,
        createBy: null,
        payImg: null,
        auditBy: null,
        auditTime: null,
        pumpAmount: null
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
      this.ids = selection.map(item => item.recordId)
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
      const recordId = row.recordId || this.ids
      getWithdrawalRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提现记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          auditWithdrawalRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
        }
      });
    },
    handleAudit(row) {
      this.form = {...row, recordStatus: null};
      this.open = true;
      this.title = "审批";
    },
    handleAuditSubmit() {
      const row = this.form;
      const params = {
        recordId: row.recordId,
        recordStatus: row.recordStatus
      };
      this.$modal.confirm(`是否确认审批${row.recordStatus === 1 ? '通过' : '拒绝'}提现记录编号为"` + row.recordId + '"的数据项？').then(function() {
        return auditWithdrawalRecord(params);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("审批成功");
      }).catch(() => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除提现记录编号为"' + recordIds + '"的数据项？').then(function() {
        return delWithdrawalRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/withdrawalRecord/export', {
        ...this.handleParams()
      }, `withdrawalRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
