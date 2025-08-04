<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
        <el-input
          v-model="queryParams.withdrawalChannel"
          placeholder="请输入提现通道"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现金额" prop="withdrawalAmount">
        <el-input
          v-model="queryParams.withdrawalAmount"
          placeholder="请输入提现金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际金额" prop="actualAmount">
        <el-input
          v-model="queryParams.actualAmount"
          placeholder="请输入实际金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手续费率" prop="freeRate">
        <el-input
          v-model="queryParams.freeRate"
          placeholder="请输入手续费率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手续费率" prop="rates">
        <el-input
          v-model="queryParams.rates"
          placeholder="请输入手续费率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审批人" prop="approver">
        <el-input
          v-model="queryParams.approver"
          placeholder="请输入审批人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审批时间" prop="approverTime">
        <el-date-picker clearable
          v-model="queryParams.approverTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择审批时间">
        </el-date-picker>
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['member:GameWithdrawalRecord:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['member:GameWithdrawalRecord:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['member:GameWithdrawalRecord:remove']"
        >删除</el-button>
      </el-col>
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
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="提现记录id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="mbId" />
      <el-table-column label="用户账号" align="center" prop="mbAccount" />
      <el-table-column label="提现通道" align="center" prop="withdrawalChannel" />
      <el-table-column label="提现金额" align="center" prop="withdrawalAmount" />
      <el-table-column label="实际金额" align="center" prop="actualAmount" />
      <el-table-column label="手续费率" align="center" prop="freeRate" />
      <el-table-column label="手续费率" align="center" prop="rates" />
      <el-table-column label="审批人" align="center" prop="approver" />
      <el-table-column label="审批时间" align="center" prop="approverTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approverTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="approverStatus" />
      <el-table-column label="合营id" align="center" prop="hyId" />
      <el-table-column label="邀请人id" align="center" prop="inMbId" />
      <el-table-column label="邀请人账号" align="center" prop="inMbAccount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:GameWithdrawalRecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:GameWithdrawalRecord:remove']"
          >删除</el-button>
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
  </div>
</template>

<script>
import { listGameWithdrawalRecord, getGameWithdrawalRecord, delGameWithdrawalRecord, addGameWithdrawalRecord, updateGameWithdrawalRecord } from "@/api/member/GameWithdrawalRecord";

export default {
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
    }
  }
};
</script>
