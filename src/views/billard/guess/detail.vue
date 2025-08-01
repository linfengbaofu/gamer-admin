<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="[1, 2].includes(matchInfo.matchStatus)"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['billard:guess:add']"
          >新增</el-button
        >

                 <el-button
           v-if="[1, 2].includes(matchInfo.matchStatus)"
           type="primary"
           plain
           icon="el-icon-plus"
           size="mini"
           :loading="loading"
           @click="handleInitTemplate"
           v-hasPermi="['billard:guess:add']"
           >初始化模板</el-button
         >
      </el-col>
      <right-toolbar :search="false" @queryTable="getInitData"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="guessList">
      <el-table-column label="竞猜ID" align="center" prop="guessId" />
      <el-table-column label="赛事ID" align="center" prop="matchId" />
      <el-table-column label="赛事名称" align="center" prop="matchName" />

      <el-table-column label="竞猜内容" align="center" prop="guessContent" />
      <el-table-column label="竞猜状态" align="center" prop="guessStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.guess_status" :value="scope.row.guessStatus" />
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column label="开奖人" align="center" prop="drawingUser" />
      <el-table-column label="开奖时间" align="center" prop="drawingTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.drawingTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sorted" />
      <el-table-column
        :width="280"
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
        :show-overflow-tooltip="false"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleViewGuess(scope.row)"
            v-hasPermi="['billard:guess:query']"
            >查看基本信息</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateGuess(scope.row)"
            v-hasPermi="['billard:guess:edit']"
            >修改基本信息</el-button
          >
          <el-button
            v-if="scope.row.guessStatus != 3"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateOption(scope.row)"
            v-hasPermi="['billard:guess:edit']"
            >修改选项</el-button
          >
          <el-button
            v-if="scope.row.guessStatus != 3"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSetWinOption(scope.row)"
            v-hasPermi="['billard:guess:edit']"
            >申请设置中奖</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleQueryWinOption(scope.row)"
            v-hasPermi="['billard:guess:edit']"
            >查询中奖申请</el-button
          >
          <el-button
            v-if="scope.row.isStopBet !== 1 && scope.row.guessStatus != 3"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleStopBet(scope.row)"
            v-hasPermi="['billard:guess:edit']"
            >封盘</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleQueryBetRecord(scope.row)"
            v-hasPermi="['billard:guess:edit']"
            >下注记录</el-button
          >
          <el-button
            v-if="scope.row.guessStatus != 3"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:guess:remove']"
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

    <!-- 引入抽离的对话框组件 -->
    <add-guess-dialog
      ref="addGuessDialog"
      :title="title"
      :open="open"
      :form="form"
      @cancel="cancel"
      @submitForm="submitForm"
    />

    <edit-guess-dialog
      ref="editGuessDialog"
      :title="title"
      :open="editGuessOpen"
      :form="form"
      @cancel="cancel"
      @submitForm="submitForm"
    />
    <edit-guess-option-dialog
      ref="editGuessOptionDialog"
      :title="editGuessOptionDialogTitle"
      :open="editGuessOptionOpen"
      :form="form"
      :matchInfo="matchInfo"
      @cancel="cancel"
      @submitForm="resetList"
    />
    <set-guess-win-option-dialog
      ref="setGuessWinOptionDialog"
      :title="title"
      :open="setWinOptionOpen"
      :form="form"
      @cancel="cancel"
      @submitForm="resetList"
    />
    <view-guess-dialog
      ref="viewGuessDialog"
      :title="title"
      :open="viewGuessOpen"
      :form="form"
      @cancel="cancel"
    />
    <query-guess-record-dialog
      ref="queryGuessRecordDialog"
      :title="title"
      :open="queryRecordOpen"
      :form="form"
      @cancel="cancel"
    />
    <query-bet-record-dialog
      ref="queryBetRecordDialog"
      :title="betRecordTitle"
      :open="queryBetRecordOpen"
      :form="form"
      @cancel="cancel"
    />
    <init-template-dialog
      ref="initTemplateDialog"
      :title="initTemplateTitle"
      :open="initTemplateOpen"
      :templateList="templateList"
      @cancel="cancel"
      @submitTemplate="handleSubmitTemplate"
    />
  </div>
</template>

<script>
import { getMatch } from "@/api/billard/match";
import {
  listGuess,
  getGuess,
  delGuess,
  addGuess,
  updateGuess,
  stopBet,
} from "@/api/billard/guess";
import AddGuessDialog from "./components/AddGuessDialog";
import EditGuessDialog from "./components/EditGuessDialog";
import EditGuessOptionDialog from "./components/EditGuessOptionDialog";
import SetGuessWinOptionDialog from "./components/setGuessWinOptionDialog.vue";
import ViewGuessDialog from "./components/ViewGuessDialog.vue";
import QueryGuessRecordDialog from "./components/QueryGuessRecordDialog.vue";
import QueryBetRecordDialog from "./components/QueryBetRecordDialog.vue";
import InitTemplateDialog from "./components/InitTemplateDialog.vue";
import { initTemplate1 } from "./mock";
export default {
  name: "GuessDetail",
  dicts: [
    "guess_status",
    "billard_guess_record_status",
    "billard_guess_record_is_stop_bet",
  ],
  components: {
    AddGuessDialog,
    EditGuessDialog,
    EditGuessOptionDialog,
    SetGuessWinOptionDialog,
    ViewGuessDialog,
    QueryGuessRecordDialog,
    QueryBetRecordDialog,
    InitTemplateDialog,
  },
  data() {
    return {
      matchInfo: {
        matchStatus: 0,
      },
      setWinOptionOpen: false,
      editGuessOpen: false,
      viewGuessOpen: false,
      queryRecordOpen: false,
      queryBetRecordOpen: false,
      betRecordTitle: "",
      // 初始化模板相关
      initTemplateOpen: false,
      initTemplateTitle: "初始化模板",
      templateList: [],
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
      // 是否显示弹出层
      open: false,
      // 是否显示添加竞猜选项弹出层
      addGuessOptionOpen: false,
      // 是否显示修改竞猜选项弹出层
      editGuessOptionOpen: false,
      editGuessOptionDialogTitle: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 999,
        matchId: this.$route.params.matchId,
      },
      // 表单参数
      form: {
        sorted: 0,
        matchId: this.$route.params.matchId,
        optionList: [],
      },
      // 表单校验
      rules: {
        matchId: [{ required: true, message: "赛事ID不能为空", trigger: "blur" }],
        sorted: [{ required: true, message: "排序不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getMatchInfo();
    this.getList();
  },
  methods: {
    handleInitTemplate() {
      // 获取模板数据并打开对话框
      this.templateList = initTemplate1(this.$route.params.matchId);
      this.initTemplateOpen = true;
    },
    
    // 处理模板提交
    handleSubmitTemplate(templateList) {
      Promise.all(templateList.map(item => {
        return addGuess(item);
      })).then(res => {
        this.$modal.msgSuccess("初始化成功");
        this.getList();
        this.initTemplateOpen = false;
        if (this.$refs.initTemplateDialog) {
          this.$refs.initTemplateDialog.loading = false;
        }
      }).catch(err => {
        this.$modal.msgError("初始化失败");
        console.error(err);
        if (this.$refs.initTemplateDialog) {
          this.$refs.initTemplateDialog.loading = false;
        }
      });
    },
    handleStopBet(row) {
      this.$modal
        .confirm('是否确认封盘竞猜编号为"' + row.guessId + '"的数据项？')
        .then(() => {
          this.loading = true;
          return stopBet({
            guessId: row.guessId,
          });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("封盘成功");
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getInitData() {
      this.getMatchInfo();
      this.getList();
    },
    /** 查询竞猜列表 */
    getList() {
      this.loading = true;
      listGuess(this.queryParams).then((response) => {
        this.guessList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getMatchInfo() {
      if (this.$route.params.matchId) {
        getMatch(this.$route.params.matchId).then((response) => {
          console.log(response);
          this.matchInfo = response.data;
        });
      }
    },
    // 取消按钮
    cancel() {
      this.editGuessOpen = false;
      this.editGuessOptionOpen = false;
      this.editGuessOptionDialogTitle = "";
      this.open = false;
      this.setWinOptionOpen = false;
      this.viewGuessOpen = false;
      this.queryRecordOpen = false;
      this.queryBetRecordOpen = false;
      this.betRecordTitle = "";
      this.initTemplateOpen = false;
      this.templateList = [];
      this.reset();

      // 重置各个组件的loading状态
      if (this.$refs.addGuessDialog) {
        this.$refs.addGuessDialog.loading = false;
      }
      if (this.$refs.editGuessDialog) {
        this.$refs.editGuessDialog.loading = false;
      }
      if (this.$refs.initTemplateDialog) {
        this.$refs.initTemplateDialog.loading = false;
      }
    },
    resetList() {
      this.guessList = [];
      this.total = 0;
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        guessId: null,
        matchId: this.$route.params.matchId,
        guessContent: null,
        guessStatus: null,
        remark: null,
        drawingUser: null,
        drawingTime: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        sorted: 0,
        optionList: [
        ],
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
      this.title = "添加竞猜";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const guessId = row.guessId || this.ids;
      getGuess(guessId).then((response) => {
        this.form = response.data;
        this.form.optionList = response.data.optionVoList || [];
        this.open = true;
        this.title = "修改竞猜";
      });
    },
    /** 修改竞猜选项 */
    handleUpdateOption(row) {
      this.form = { ...row };
      this.editGuessOptionDialogTitle =
        row.guessStatus == 3 ? "查看竞猜选项" : "修改竞猜选项";
      this.editGuessOptionOpen = true;
    },
    /** 申请设置中奖 */
    handleSetWinOption(row) {
      this.form = { ...row };
      this.title = "申请设置中奖";
      this.setWinOptionOpen = true;
    },
    /** 查询中奖申请 */
    handleQueryWinOption(row) {
      this.form = { ...row };
      this.title = "查询中奖申请";
      this.queryRecordOpen = true;
    },
    /** 查询下注记录 */
    handleQueryBetRecord(row) {
      this.form = { guessId: row.guessId };
      this.betRecordTitle = "查询下注记录";
      this.queryBetRecordOpen = true;
    },
    /** 查看竞猜基本信息 */
    handleViewGuess(row) {
      this.form = { ...row };
      this.title = "查看竞猜详情";
      this.viewGuessOpen = true;
    },
    /** 修改竞猜基本信息 */
    handleUpdateGuess(row) {
      this.form = { ...row };
      this.title = "修改竞猜基本信息";
      this.editGuessOpen = true;
    },
    /** 提交按钮 */
    async submitForm(formData) {
      // 使用传入的表单数据
      const form = formData || this.form;

      this.loading = true;
      try {
        // 先保存竞猜基本信息
        const saveGuess = form.guessId != null ? updateGuess(form) : addGuess(form);
        const res = await saveGuess.catch((err) => {
          this.loading = false;
          this.cancel();
        });
        if (res.code === 200) {
          this.$modal.msgSuccess(form.guessId != null ? "修改成功" : "新增成功");
          this.getList();
        } else {
          this.$modal.msgError("操作失败");
        }
        this.loading = false;
        this.cancel();
      } catch (error) {
        this.$modal.msgError("操作失败");
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const guessIds = row.guessId || this.ids;
      this.$modal
        .confirm('是否确认删除竞猜编号为"' + guessIds + '"的数据项？')
        .then(function () {
          return delGuess(guessIds);
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
        "billard/guess/export",
        {
          ...this.queryParams,
        },
        `guess_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
