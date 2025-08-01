<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="赛事ID" prop="matchId">
        <el-input
          v-model="queryParams.matchId"
          placeholder="请输入赛事ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞猜ID" prop="guessId">
        <el-input
          v-model="queryParams.guessId"
          placeholder="请输入竞猜ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="赛事名称" prop="matchName">
        <el-input
          v-model="queryParams.matchName"
          placeholder="请输入赛事名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录状态" prop="recordStatus">
        <el-select v-model="queryParams.recordStatus" placeholder="请选择记录状态" clearable>
          <el-option v-for="item in dict.type.billard_guess_record_status" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否封盘" prop="isStopBet">
        <el-select v-model="queryParams.isStopBet" placeholder="请选择是否封盘">
          <el-option v-for="item in dict.type.billard_guess_record_is_stop_bet" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批人ID" prop="auditBy">
        <el-input
          v-model="queryParams.auditBy"
          placeholder="请输入审批人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item label="自动刷新">
        <el-switch
          v-model="autoRefreshEnabled"
          active-text="开启"
          inactive-text="关闭"
          @change="handleAutoRefreshToggle"
        ></el-switch>
        <span v-if="autoRefreshEnabled" style="margin-left: 8px; font-size: 12px; color: #999;">
          ({{ autoRefreshCountdown }}s后刷新)
        </span>
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
          v-hasPermi="['billard:guessRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="guessRecordList" @selection-change="handleSelectionChange">
      <el-table-column label="记录id" align="center" prop="recordId" width="100"/>
      <el-table-column label="竞猜ID" align="center" prop="guessId" width="100"/>
      <el-table-column label="赛事ID" align="center" prop="matchId" width="100"/>
      <el-table-column label="赛事名称" align="center" prop="matchName" width="200"/>
      <el-table-column label="竞猜内容" align="center" prop="guessContent" show-overflow-tooltip/>
      <el-table-column label="竞猜状态" align="center" prop="guessStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.guess_status" :value="scope.row.guessStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="开奖人" align="center" prop="drawingUser" />

      <el-table-column label="排序" align="center" prop="sorted" />

      <el-table-column label="是否封盘" align="center" prop="isStopBet" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_guess_record_is_stop_bet" :value="scope.row.isStopBet"/>
        </template>
      </el-table-column>
      <el-table-column label="记录状态" align="center" prop="recordStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_guess_record_status" :value="scope.row.recordStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审批人ID" align="center" prop="auditBy" />
      <el-table-column label="审批时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" show-overflow-tooltip/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['billard:guessRecord:query']"
          >查看详情</el-button>
          <el-button
            v-if="scope.row.recordStatus == 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAudit(scope.row,2)"
            v-hasPermi="['billard:guessRecord:edit']"
          >审核不通过</el-button>
          <el-button
            v-if="scope.row.recordStatus == 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleAudit(scope.row,1)"
            v-hasPermi="['billard:guessRecord:remove']"
          >审核通过</el-button>
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

    <!-- 查看竞猜详情对话框 -->
    <view-guess-dialog
      :title="viewDialogTitle"
      :open="viewDialogOpen"
      :form="viewDialogForm"
      @cancel="handleViewCancel"
    />
   
  </div>
</template>

<script>
import { listGuessRecord, getGuessRecord, delGuessRecord, addGuessRecord, updateGuessRecord, auditGuessRecord } from "@/api/billard/guessRecord";
import ViewGuessDialog from "./ViewGuessDialog";

export default {
  dicts: ['guess_status', 'billard_guess_record_status', 'billard_guess_record_is_stop_bet', 'record_is_top'],
  name: "GuessRecord",
  components: {
    ViewGuessDialog
  },
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
      // 竞猜审批表格数据
      guessRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查看详情对话框相关
      viewDialogOpen: false,
      viewDialogTitle: "查看竞猜审批详情",
      viewDialogForm: {},
      // 自动刷新相关
      autoRefreshEnabled: false,
      autoRefreshTimer: null,
      autoRefreshCountdown: 10,
      autoRefreshInterval: 10, // 10秒间隔
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        guessId: null,
        matchId: null,
        matchName: null,
        guessContent: null,
        guessStatus: null,
        drawingUser: null,
        drawingTime: null,
        sorted: null,
        isTop: null,
        isStopBet: null,
        recordStatus: null,
        auditBy: null,
        auditTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        matchId: [
          { required: true, message: "赛事ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  beforeDestroy() {
    // 组件销毁前清理定时器
    this.stopAutoRefresh();
  },
  methods: {
    /** 查询竞猜审批列表 */
    getList() {
      this.loading = true;
      listGuessRecord(this.queryParams).then(response => {
        this.guessRecordList = response.rows;
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
        guessId: null,
        matchId: null,
        matchName: null,
        guessContent: null,
        guessStatus: null,
        remark: null,
        drawingUser: null,
        drawingTime: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        sorted: null,
        isTop: null,
        delFlag: null,
        isStopBet: null,
        recordStatus: null,
        auditBy: null,
        auditTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      // 如果自动刷新开启，重置倒计时
      if (this.autoRefreshEnabled) {
        this.resetCountdown();
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      // 如果自动刷新开启，重置倒计时
      if (this.autoRefreshEnabled) {
        this.resetCountdown();
      }
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
      this.title = "添加竞猜审批";
    },
    /** 查看详情按钮操作 */
    handleView(row) {
      // 直接使用行数据作为详情数据
      this.viewDialogForm = {
        recordId: row.recordId,
        guessId: row.guessId,
        matchId: row.matchId,
        matchName: row.matchName,
        guessContent: row.guessContent,
        guessStatus: row.guessStatus,
        remark: row.remark,
        drawingUser: row.drawingUser,
        drawingTime: row.drawingTime,
        sorted: row.sorted,
        isStopBet: row.isStopBet,
        recordStatus: row.recordStatus,
        auditBy: row.auditBy,
        auditTime: row.auditTime
      };
      this.viewDialogOpen = true;
    },
    /** 关闭查看详情对话框 */
    handleViewCancel() {
      this.viewDialogOpen = false;
      this.viewDialogForm = {};
    },
    handleAudit(row,status) {
      this.$modal.confirm(`是否审核${status == 1 ? '通过' : '不通过'}竞猜审批编号为` + row.recordId + '"的数据项？').then(() => {

      // const auditType = status == 1 ? '通过' : '不通过';
      // this.$prompt(`请输入审核${auditType}的备注信息`, `审核${auditType}`, {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   // inputPlaceholder: '请输入备注信息（可选）',
      //   // inputType: 'textarea',
      //   // inputValidator: (value) => {
      //   //   // 备注为可选，不进行必填验证
      //   //   return true;
      //   // }
      // }).then(({ value }) => {
        this.loading = true;
        return auditGuessRecord({
          "recordId": row.recordId,
          "recordStatus": status,
          // "remark": value || '' // 如果没有输入备注，传空字符串
        });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("审核成功");
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getGuessRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改竞猜审批";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recordId != null) {
            updateGuessRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGuessRecord(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除竞猜审批编号为"' + recordIds + '"的数据项？').then(function() {
        return delGuessRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/guessRecord/export', {
        ...this.queryParams
      }, `guessRecord_${new Date().getTime()}.xlsx`)
    },
    /** 自动刷新开关切换 */
    handleAutoRefreshToggle(enabled) {
      if (enabled) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    },
    /** 开始自动刷新 */
    startAutoRefresh() {
      this.resetCountdown();
      this.autoRefreshTimer = setInterval(() => {
        this.autoRefreshCountdown--;
        if (this.autoRefreshCountdown <= 0) {
          this.getList();
          this.resetCountdown();
        }
      }, 1000);
    },
    /** 停止自动刷新 */
    stopAutoRefresh() {
      if (this.autoRefreshTimer) {
        clearInterval(this.autoRefreshTimer);
        this.autoRefreshTimer = null;
      }
      this.resetCountdown();
    },
    /** 重置倒计时 */
    resetCountdown() {
      this.autoRefreshCountdown = this.autoRefreshInterval;
    }
  }
};
</script>
