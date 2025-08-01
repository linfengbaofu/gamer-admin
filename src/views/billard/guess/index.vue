<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="竞猜状态" prop="guessStatus">
        <el-select v-model="queryParams.guessStatus" placeholder="请选择竞猜状态">
          <el-option v-for="item in dict.type.guess_status" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['billard:guess:add']"
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
          v-hasPermi="['billard:guess:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['billard:guess:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:guess:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="guessList" @selection-change="handleSelectionChange">
      
      <el-table-column label="竞猜ID" align="center" prop="guessId" />
      <el-table-column label="赛事ID" align="center" prop="matchId" />
      <el-table-column label="赛事名称" align="center" prop="matchName" />

      <el-table-column label="竞猜内容" align="center" prop="guessContent" />
      <el-table-column label="竞猜状态" align="center" prop="guessStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.guess_status" :value="scope.row.guessStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column label="开奖人" align="center" prop="drawingUser" />
      <el-table-column label="开奖时间" align="center" prop="drawingTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.drawingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" fixed="right" width="300"  class-name="small-padding fixed-width" :show-overflow-tooltip="false">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
            v-hasPermi="['billard:guess:query']"
          >查看详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:guess:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSetWinOption(scope.row)"
            v-hasPermi="['billard:guess:edit']"
          >申请设置中奖</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleQueryWinOption(scope.row)"
            v-hasPermi="['billard:guess:edit']"
          >查询中奖申请</el-button>
          <el-button
            v-if="scope.row.isStopBet !== 1 && scope.row.guessStatus != 3"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleStopBet(scope.row)"
            v-hasPermi="['billard:guess:edit']"
          >封盘</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleQueryBetRecord(scope.row)"
            v-hasPermi="['billard:guess:edit']"
          >下注记录</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:guess:remove']"
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

    <!-- 添加竞猜对话框 -->
    <add-guess-dialog 
      :open="addDialogVisible" 
      :title="'添加竞猜'" 
      :form="form" 
      @cancel="cancelAdd" 
      @submitForm="submitAddForm"
    />

    <!-- 修改竞猜对话框 -->
    <edit-guess-dialog 
      :open="editDialogVisible" 
      :title="'修改竞猜'" 
      :form="form" 
      @cancel="cancelEdit" 
      @submitForm="submitEditForm"
    />

    <!-- 申请设置中奖对话框 -->
    <set-guess-win-option-dialog
      :open="setWinOptionDialogVisible"
      title="申请设置中奖"
      :form="form"
      @cancel="cancelSetWinOption"
      @submitForm="submitSetWinOptionForm"
    />

    <!-- 查看详情对话框 -->
    <view-guess-dialog 
      :open="viewDialogVisible" 
      title="查看竞猜详情" 
      :form="form" 
      @cancel="cancelView" 
    />
    <query-guess-record-dialog-apply
      :open="queryRecordOpen"
      title="查询中奖申请"
      :form="form"
      @cancel="cancelQueryRecord"
    />
    <query-bet-record-dialog
      :open="queryBetRecordOpen"
      title="下注记录"
      :form="form"
      @cancel="cancelQueryBetRecord"
    />
  </div>
</template>

<script>
import { listGuess, getGuess, delGuess, addGuess, updateGuess, setWinOption, stopBet } from "@/api/billard/guess";
import AddGuessDialog from "./components/AddGuessDialog";
import EditGuessDialog from "./components/EditGuessDialog";
import SetGuessWinOptionDialog from "./components/setGuessWinOptionDialog";
import ViewGuessDialog from "./components/ViewGuessDialog";
import QueryGuessRecordDialog from "./components/QueryGuessRecordDialog";
import QueryBetRecordDialog from "./components/QueryBetRecordDialog";
import QueryGuessRecordDialogApply from "./components/QueryGuessRecordDialogApply";
export default {
  dicts: ['guess_status'],
  name: "Guess",
  components: {
    QueryGuessRecordDialogApply,
    AddGuessDialog,
    EditGuessDialog,
    SetGuessWinOptionDialog,
    ViewGuessDialog,
    QueryGuessRecordDialog,
    QueryBetRecordDialog
  },
  data() {
    return {
      queryRecordOpen: false,
      queryBetRecordOpen: false,
      // 设置中奖对话框
      setWinOptionDialogVisible: false,
      // 查看详情对话框
      viewDialogVisible: false,
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
      // 竞猜表格数据
      guessList: [],
      // 弹出层标题
      title: "",
      // 是否显示添加弹出层
      addDialogVisible: false,
      // 是否显示编辑弹出层
      editDialogVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        matchId: null,
        guessContent: null,
        guessStatus: null,
        drawingUser: null,
        drawingTime: null,
        sorted: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        matchId: [
          { required: true, message: "赛事ID不能为空", trigger: "blur" }
        ],
        sorted: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    cancelQueryBetRecord() {
      this.queryBetRecordOpen = false;
      // this.reset();
    },
    handleQueryBetRecord(row) {
      this.form = {guessId: row.guessId}

      this.title = "下注记录";
      this.queryBetRecordOpen = true;
    },
    handleQueryWinOption(row) {
      this.form = {...row}
      this.title = "查询中奖申请";
      this.queryRecordOpen = true;
    },
    cancelQueryRecord() {
      this.queryRecordOpen = false;
      // this.reset();
    },
    handleStopBet(row) {
      this.$modal.confirm('是否确认封盘竞猜编号为"' + row.guessId + '"的数据项？').then(() => {
        this.loading = true;
        return stopBet({
          guessId: row.guessId
        });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("封盘成功");
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 查询竞猜列表 */
    getList() {
      this.loading = true;
      listGuess(this.queryParams).then(response => {
        this.guessList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消添加按钮
    cancelAdd() {
      this.addDialogVisible = false;
      this.reset();
    },
    // 取消编辑按钮
    cancelEdit() {
      this.editDialogVisible = false;
      this.reset();
    },
    // 取消设置中奖按钮
    cancelSetWinOption() {
      this.setWinOptionDialogVisible = false;
      this.reset();
    },
    // 取消查看详情按钮
    cancelView() {
      this.viewDialogVisible = false;
      this.reset();
    },
    // 设置中奖
    handleSetWinOption(row) {
      this.setWinOptionDialogVisible = true;
      this.form = row;
    },
    // 提交设置中奖表单
    submitSetWinOptionForm(formData) {
      console.log('设置中奖提交前状态:', {
        setWinOptionDialogVisible: this.setWinOptionDialogVisible,
        queryRecordOpen: this.queryRecordOpen
      });
      
      this.setWinOptionDialogVisible = false;
      // 确保查询对话框不会被意外打开
      this.queryRecordOpen = false;
      this.getList();
      // 移除重复的成功消息，子组件已经处理了
      
      console.log('设置中奖提交后状态:', {
        setWinOptionDialogVisible: this.setWinOptionDialogVisible,
        queryRecordOpen: this.queryRecordOpen
      });
    },
    // 表单重置
    reset() {
      this.form = {
        guessId: null,
        matchId: null,
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
        optionList: []
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
      this.ids = selection.map(item => item.guessId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.addDialogVisible = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const guessId = row.guessId || this.ids;
      getGuess(guessId).then(response => {
        this.form = response.data;
        this.editDialogVisible = true;
      });
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.reset();
      const guessId = row.guessId;
      getGuess(guessId).then(response => {
        this.form = response.data;
        this.viewDialogVisible = true;
      });
    },
    /** 提交添加表单 */
    submitAddForm(formData) {
      // 处理新增表单提交
      const data = {
        ...formData,
        // 将options处理为后端需要的格式
        optionList: formData.optionList.map(item => ({
          ...item,
          guessId: formData.guessId
        }))
      };
      
      addGuess(data).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.addDialogVisible = false;
        this.getList();
      });
    },
    /** 提交编辑表单 */
    submitEditForm(formData) {
      // 只处理基本信息的更新，选项的添加删除已经在EditGuessDialog中通过API处理
      updateGuess(formData).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.editDialogVisible = false;
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const guessIds = row.guessId || this.ids;
      this.$modal.confirm('是否确认删除竞猜编号为"' + guessIds + '"的数据项？').then(function() {
        return delGuess(guessIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/guess/export', {
        ...this.queryParams
      }, `guess_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
