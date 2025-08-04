<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="邀请人ID" prop="inviterMbId">
        <el-input
          v-model="queryParams.inviterMbId"
          placeholder="请输入邀请人ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请人账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入邀请人账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="被邀请人ID" prop="inviteeMbId">
        <el-input
          v-model="queryParams.inviteeMbId"
          placeholder="请输入被邀请人ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="被邀请人账号" prop="inviteeMbAccount">
        <el-input
          v-model="queryParams.inviteeMbAccount"
          placeholder="请输入被邀请人账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="邀请时间" prop="inviteTime">
        <el-date-picker clearable
          v-model="queryParams.inviteTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择邀请时间">
        </el-date-picker>
      </el-form-item> -->
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
          v-hasPermi="['member:inviteRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inviteRecordList" @selection-change="handleSelectionChange">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="recordId" width="180" />
      <el-table-column label="邀请人ID" align="center" prop="inviterMbId"/>
      <el-table-column label="邀请人账号" align="center" prop="mbAccount" width="150" />
      <el-table-column label="被邀请人ID" align="center" prop="inviteeMbId" width="150" />
      <el-table-column label="被邀请人账号" align="center" prop="inviteeMbAccount" width="150"/>
      <el-table-column label="邀请时间" align="center" prop="inviteTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inviteTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <!-- <el-table-column label="奖励积分" align="center" prop="rewardPoints" width="150"/> -->
      <!-- <el-table-column label="被邀请消费" align="center" prop="inviteeConsum" width="150"/> -->
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <!-- <el-table-column label="佣金比例" align="center" prop="commissionRate" width="150"/> -->
      <!-- <el-table-column label="累计佣金" align="center" prop="accumulateCommission" /> -->
   
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改邀请记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邀请人ID" prop="inviterMbId">
          <el-input v-model="form.inviterMbId" placeholder="请输入邀请人ID" />
        </el-form-item>
        <el-form-item label="被邀请人ID" prop="inviteeMbId">
          <el-input v-model="form.inviteeMbId" placeholder="请输入被邀请人ID" />
        </el-form-item>
        <el-form-item label="邀请时间" prop="inviteTime">
          <el-date-picker clearable
            v-model="form.inviteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择邀请时间">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="奖励积分" prop="rewardPoints">
          <el-input v-model="form.rewardPoints" placeholder="请输入奖励积分" />
        </el-form-item> -->
        <el-form-item label="被邀请消费" prop="inviteeConsum">
          <el-input v-model="form.inviteeConsum" placeholder="请输入被邀请消费" />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item> -->
        <el-form-item label="佣金比例" prop="commissionRate">
          <el-input v-model="form.commissionRate" placeholder="请输入佣金比例" />
        </el-form-item>
        <el-form-item label="累计佣金" prop="accumulateCommission">
          <el-input v-model="form.accumulateCommission" placeholder="请输入累计佣金" />
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
import { listInviteRecord, getInviteRecord, delInviteRecord, addInviteRecord, updateInviteRecord } from "@/api/member/inviteRecord";

export default {
  name: "InviteRecord",
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
      // 邀请记录表格数据
      inviteRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inviterMbId: null,
        inviteeMbId: null,
        inviteTime: null,
        rewardPoints: null,
        inviteeConsum: null,
        commissionRate: null,
        accumulateCommission: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inviteeMbId: [
          { required: true, message: "被邀请人ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询邀请记录列表 */
    getList() {
      this.loading = true;
      listInviteRecord(this.queryParams).then(response => {
        this.inviteRecordList = response.rows;
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
        inviterMbId: null,
        inviteeMbId: null,
        inviteTime: null,
        rewardPoints: null,
        inviteeConsum: null,
        remark: null,
        commissionRate: null,
        accumulateCommission: null,
        createTime: null,
        createBy: null
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
      this.title = "添加邀请记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getInviteRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改邀请记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recordId != null) {
            updateInviteRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInviteRecord(this.form).then(response => {
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
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除邀请记录编号为"' + recordIds + '"的数据项？').then(function() {
        return delInviteRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/inviteRecord/export', {
        ...this.queryParams
      }, `inviteRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
