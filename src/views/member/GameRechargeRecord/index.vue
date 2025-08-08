<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
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
      
      <el-form-item label="充值渠道" prop="rechargeChannel">
        <el-input
          v-model="queryParams.rechargeChannel"
          placeholder="请输入充值渠道"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审批人" prop="approverBy">
        <el-input
          v-model="queryParams.approverBy"
          placeholder="请输入审批人"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          placeholder="请输入邀请人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请人账号" prop="inMbAccount">
        <el-input
          v-model="queryParams.inMbAccount"
          placeholder="请输入邀请人"
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
          v-hasPermi="['member:GameRechargeRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="GameRechargeRecordList" @selection-change="handleSelectionChange">
      <el-table-column label="用户id" align="center" prop="mbId" :fixed="true" width="150"/>
      <el-table-column label="用户账号" align="center" prop="mbAccount" width="150"/>
      <el-table-column label="充值地址" align="center" prop="paymentAddr" width="350"/>
      <el-table-column label="充值渠道" align="center" prop="rechargeChannel" />
      <el-table-column label="充值金额" align="center" prop="rechargeAmount" />
      <el-table-column label="实际金额" align="center" prop="actualAmount" />
      <el-table-column label="赠送金额" align="center" prop="givePoints" />
      <el-table-column label="审批状态" align="center" prop="approvalStatus" width="150">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.record_recharge_status" :value="scope.row.approvalStatus" />
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="approverBy" />
      <el-table-column label="审批时间" align="center" prop="approverTime" width="180">
      </el-table-column>
      <el-table-column label="合营id" align="center" prop="hyId" />
      <el-table-column label="邀请人ID" align="center" prop="inMbId" width="150"/>
      <el-table-column label="邀请人账号" align="center" prop="inMbAccount" width="150"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >查看</el-button>
          <el-button
            v-if="scope.row.approvalStatus == '0'"
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleAudit(scope.row)"
            v-hasPermi="['member:GameRechargeRecord:audit']"
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

    <!-- 审核弹窗 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input v-model="form.mbAccount" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="充值地址" prop="paymentAddr">
          <el-input v-model="form.paymentAddr" placeholder="请输入充值地址" />
        </el-form-item>
        <el-form-item label="充值渠道" prop="rechargeChannel">
          <el-input v-model="form.rechargeChannel" placeholder="请输入充值渠道" />
        </el-form-item>
        <el-form-item label="充值金额" prop="rechargeAmount">
          <el-input v-model="form.rechargeAmount" placeholder="请输入充值金额" />
        </el-form-item>
        <el-form-item label="实际金额" prop="actualAmount">
          <el-input v-model="form.actualAmount" placeholder="请输入实际金额" />
        </el-form-item>
        <el-form-item label="赠送金额" prop="givePoints">
          <el-input v-model="form.givePoints" placeholder="请输入赠送金额" />
        </el-form-item>
        <el-form-item label="审批人" prop="approverBy">
          <el-input v-model="form.approverBy" placeholder="请输入审批人" />
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

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog title="审核充值" :visible.sync="auditOpen" width="800px" append-to-body>
      <el-descriptions title="" :column="2" border>
        <el-descriptions-item label="用户ID">{{ auditForm.mbId }}</el-descriptions-item>
        <el-descriptions-item label="用户账号">{{ auditForm.mbAccount }}</el-descriptions-item>
        <el-descriptions-item label="充值地址">{{ auditForm.paymentAddr }}</el-descriptions-item>
        <el-descriptions-item label="充值渠道">{{ auditForm.rechargeChannel }}</el-descriptions-item>
        <el-descriptions-item label="充值金额">{{ auditForm.rechargeAmount }}</el-descriptions-item>
        <el-descriptions-item label="实际金额">{{ auditForm.actualAmount }}</el-descriptions-item>
        <el-descriptions-item label="赠送金额">{{ auditForm.givePoints }}</el-descriptions-item>
        <el-descriptions-item label="合营ID">{{ auditForm.hyId }}</el-descriptions-item>
        <el-descriptions-item label="邀请人ID">{{ auditForm.inMbId }}</el-descriptions-item>
        <el-descriptions-item label="邀请人账号">{{ auditForm.inMbAccount }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ auditForm.createTime }}</el-descriptions-item>
        <!-- <el-descriptions-item label="备注">{{ auditForm.remark }}</el-descriptions-item> -->
      </el-descriptions>
      
      <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="120px" style="margin-top: 20px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核状态" prop="approvalStatus">
              <el-select v-model="auditForm.approvalStatus" placeholder="请选择审核状态">
                <el-option label="审核通过" :value="1" />
                <el-option label="审核不通过" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核备注" prop="remark">
          <el-input v-model="auditForm.remark" type="textarea" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="auditSubmitLoading" @click="submitAuditForm">确 定</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog title="查看充值详情" :visible.sync="viewOpen" width="800px" append-to-body>
      <el-descriptions title="" :column="2" border>
        <el-descriptions-item label="用户ID">{{ viewForm.mbId }}</el-descriptions-item>
        <el-descriptions-item label="用户账号">{{ viewForm.mbAccount }}</el-descriptions-item>
        <el-descriptions-item label="充值地址">{{ viewForm.paymentAddr }}</el-descriptions-item>
        <el-descriptions-item label="充值渠道">{{ viewForm.rechargeChannel }}</el-descriptions-item>
        <el-descriptions-item label="充值金额">{{ viewForm.rechargeAmount }}</el-descriptions-item>
        <el-descriptions-item label="实际金额">{{ viewForm.actualAmount }}</el-descriptions-item>
        <el-descriptions-item label="赠送金额">{{ viewForm.givePoints }}</el-descriptions-item>
        <el-descriptions-item label="合营ID">{{ viewForm.hyId }}</el-descriptions-item>
        <el-descriptions-item label="邀请人ID">{{ viewForm.inMbId }}</el-descriptions-item>
        <el-descriptions-item label="邀请人账号">{{ viewForm.inMbAccount }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewForm.createTime }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ viewForm.remark }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <dict-tag :options="dict.type.record_recharge_status" :value="viewForm.approvalStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="审批人">{{ viewForm.approverBy }}</el-descriptions-item>
        <el-descriptions-item label="审批时间">{{ viewForm.approverTime }}</el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGameRechargeRecord, getGameRechargeRecord, delGameRechargeRecord, addGameRechargeRecord, updateGameRechargeRecord } from "@/api/member/GameRechargeRecord";

export default {
  dicts: ['record_recharge_status'],
  name: "GameRechargeRecord",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 提交按钮loading状态
      submitLoading: false,
      // 审核提交按钮loading状态
      auditSubmitLoading: false,
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
      // 充值记录表格数据
      GameRechargeRecordList: [],
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
        paymentAddr: null,
        rechargeChannel: null,
        rechargeAmount: null,
        actualAmount: null,
        givePoints: null,
        approvalStatus: null,
        approverBy: null,
        approverTime: null,
        hyId: null,
        inMbId: null,
        inMbAccount: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 审核弹窗显示状态
      auditOpen: false,
      // 查看详情弹窗显示状态
      viewOpen: false,
      // 审核表单数据
      auditForm: {
        id: null,
        mbId: null,
        mbAccount: null,
        paymentAddr: null,
        rechargeChannel: null,
        rechargeAmount: null,
        actualAmount: null,
        givePoints: null,
        approvalStatus: null,
        approverBy: null,
        hyId: null,
        inMbId: null,
        inMbAccount: null,
        createTime: null,
        remark: null,
        remark: null
      },
      // 查看详情表单数据
      viewForm: {
        id: null,
        mbId: null,
        mbAccount: null,
        paymentAddr: null,
        rechargeChannel: null,
        rechargeAmount: null,
        actualAmount: null,
        givePoints: null,
        approvalStatus: null,
        approverBy: null,
        approverTime: null,
        hyId: null,
        inMbId: null,
        inMbAccount: null,
        createTime: null,
        remark: null
      },
      // 审核表单校验
      auditRules: {
        approvalStatus: [
          { required: true, message: "审核状态不能为空", trigger: "change" }
        ],
        approverBy: [
          { required: true, message: "审核人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询充值记录列表 */
    getList() {
      this.loading = true;
      listGameRechargeRecord(this.queryParams).then(response => {
        this.GameRechargeRecordList = response.rows;
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
        paymentAddr: null,
        rechargeChannel: null,
        rechargeAmount: null,
        actualAmount: null,
        givePoints: null,
        approvalStatus: null,
        approverBy: null,
        approverTime: null,
        hyId: null,
        inMbId: null,
        inMbAccount: null,
        createTime: null,
        createBy: null,
        remark: null
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
      this.title = "添加充值记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameRechargeRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改充值记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.id != null) {
            updateGameRechargeRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addGameRechargeRecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除充值记录编号为"' + ids + '"的数据项？').then(function() {
        return delGameRechargeRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/GameRechargeRecord/export', {
        ...this.queryParams
      }, `GameRechargeRecord_${new Date().getTime()}.xlsx`)
    },
    /** 审核按钮操作 */
    handleAudit(row) {
      this.auditForm = {
        id: row.id,
        mbId: row.mbId,
        mbAccount: row.mbAccount,
        paymentAddr: row.paymentAddr,
        rechargeChannel: row.rechargeChannel,
        rechargeAmount: row.rechargeAmount,
        actualAmount: row.actualAmount,
        givePoints: row.givePoints,
        approvalStatus: null,
        approverBy: row.approverBy,
        hyId: row.hyId,
        inMbId: row.inMbId,
        inMbAccount: row.inMbAccount,
        createTime: row.createTime,
        remark: row.remark,
        remark: row.remark || null
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
        mbId: null,
        mbAccount: null,
        paymentAddr: null,
        rechargeChannel: null,
        rechargeAmount: null,
        actualAmount: null,
        givePoints: null,
        approvalStatus: null,
        approverBy: null,
        hyId: null,
        inMbId: null,
        inMbAccount: null,
        createTime: null,
        remark: null,
      };
      this.resetForm("auditForm");
    },
    /** 提交审核 */
    submitAuditForm() {
      this.$refs["auditForm"].validate(valid => {
        if (valid) {
          this.auditSubmitLoading = true;
          updateGameRechargeRecord(this.auditForm).then(response => {
            this.$modal.msgSuccess("审核成功");
            this.auditOpen = false;
            this.getList();
          }).finally(() => {
            this.auditSubmitLoading = false;
          });
        }
      });
    },
    /** 查看详情按钮操作 */
    handleView(row) {
      this.viewForm = {
        id: row.id,
        mbId: row.mbId,
        mbAccount: row.mbAccount,
        paymentAddr: row.paymentAddr,
        rechargeChannel: row.rechargeChannel,
        rechargeAmount: row.rechargeAmount,
        actualAmount: row.actualAmount,
        givePoints: row.givePoints,
        approvalStatus: row.approvalStatus,
        approverBy: row.approverBy,
        approverTime: row.approverTime,
        hyId: row.hyId,
        inMbId: row.inMbId,
        inMbAccount: row.inMbAccount,
        createTime: row.createTime,
        remark: row.remark
      };
      this.viewOpen = true;
    }
  }
};
</script>
