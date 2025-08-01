<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="申请单号" prop="applyNo">
        <el-input
          v-model="queryParams.applyNo"
          placeholder="请输入申请单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人ID" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入申请人ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入申请人账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="mbTelephone">
        <el-input
          v-model="queryParams.mbTelephone"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="域名" prop="domainUrl">
        <el-input
          v-model="queryParams.domainUrl"
          placeholder="请输入域名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <!-- <el-form-item label="审批时间" prop="auditTime">
        <el-date-picker clearable
          v-model="queryParams.auditTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择审批时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="cooperationAgentRecordList" @selection-change="handleSelectionChange">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="recordId" width="150"/>
      <el-table-column label="申请单号" align="center" prop="applyNo" />
      <el-table-column label="申请人ID" align="center" prop="mbId" />
      <el-table-column label="申请人" align="center" prop="mbAccount" />
      <el-table-column label="联系方式" align="center" prop="mbTelephone" />
      <el-table-column label="域名" align="center" prop="domainUrl" />
      <el-table-column label="记录状态" align="center" prop="applyStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.cooperation_agent_record_apply_status" :value="scope.row.applyStatus" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="审批人" align="center" prop="auditBy" />
      <el-table-column label="审批时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" fixed="right" width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="![2, 1].includes(scope.row.applyStatus)"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAudit(scope.row)"
            v-hasPermi="['billard:cooperationAgentRecord:edit']"
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

    <!-- 添加或修改合营代理记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="申请单号" prop="applyNo">
          <el-input v-model="form.applyNo" placeholder="请输入申请单号" readonly/>
        </el-form-item>
        <el-form-item label="申请人ID" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入申请人ID" readonly/>
        </el-form-item>
        <el-form-item label="审核状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" placeholder="请选择审核状态">
            <el-option label="通过" :value="1" />
            <el-option label="拒绝" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCooperationAgentRecord, getCooperationAgentRecord, delCooperationAgentRecord, addCooperationAgentRecord, auditCooperationAgentRecord } from "@/api/billard/cooperationAgentRecord";

export default {
  dicts: ['cooperation_agent_record_apply_status'],
  name: "CooperationAgentRecord",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 提交按钮加载状态
      submitLoading: false,
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
      // 合营代理记录表格数据
      cooperationAgentRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applyNo: null,
        mbId: null,
        mbTelephone: null,
        domainUrl: null,
        applyStatus: null,
        agentRate: null,
        auditBy: null,
        auditTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        applyNo: [
          { required: true, message: "申请单号不能为空", trigger: "blur" }
        ],
        mbId: [
          { required: true, message: "申请人ID不能为空", trigger: "blur" }
        ],
        applyStatus: [
          { required: true, message: "审核状态不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询合营代理记录列表 */
    getList() {
      this.loading = true;
      listCooperationAgentRecord(this.queryParams).then(response => {
        this.cooperationAgentRecordList = response.rows;
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
        applyNo: null,
        mbId: null,
        mbTelephone: null,
        domainUrl: null,
        applyStatus: null,
        agentRate: null,
        remark: null,
        createTime: null,
        createBy: null,
        auditBy: null,
        auditTime: null
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
      this.title = "添加合营代理记录";
    },
    /** 修改按钮操作 */
    handleAudit(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getCooperationAgentRecord(recordId).then(response => {
        this.form = {...response.data, applyStatus: null};
        this.open = true;
        this.title = "审核合营代理申请";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.recordId != null) {
            auditCooperationAgentRecord({
              recordStatus: this.form.applyStatus,
              recordId: this.form.recordId,
            }).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addCooperationAgentRecord(this.form).then(response => {
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
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除合营代理记录编号为"' + recordIds + '"的数据项？').then(function() {
        return delCooperationAgentRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/cooperationAgentRecord/export', {
        ...this.queryParams
      }, `cooperationAgentRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
