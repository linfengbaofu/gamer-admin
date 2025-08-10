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
      <el-form-item label="合营id" prop="hyId">
        <el-input
          v-model="queryParams.hyId"
          placeholder="请输入合营id"
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
          v-hasPermi="['game:gameDayMbReport:add']"
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
          v-hasPermi="['game:gameDayMbReport:edit']"
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
          v-hasPermi="['game:gameDayMbReport:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['game:gameDayMbReport:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gameDayMbReportList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="mbId" />
      <el-table-column label="用户账号" align="center" prop="mbAccount" />
      <el-table-column label="邀请人id" align="center" prop="inMbId" />
      <el-table-column label="邀请人账号" align="center" prop="inMbAccount" />
      <el-table-column label="报表时间" align="center" prop="reportDate" />
      <el-table-column label="派奖金额" align="center" prop="gameWin" />
      <el-table-column label="盈利" align="center" prop="income" />
      <el-table-column label="合营id" align="center" prop="hyId" />
      <el-table-column label="币种" align="center" prop="coin" />
      <el-table-column label="下注金额" align="center" prop="gameBet" />
      <el-table-column label="有效投注" align="center" prop="yxGameBet" />
      <el-table-column label="下注数量" align="center" prop="betCount" />
      <el-table-column label="中奖数量" align="center" prop="winCount" />
      <el-table-column label="盈亏比" align="center" prop="incomeRate" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['game:gameDayMbReport:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['game:gameDayMbReport:remove']"
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

    <!-- 添加或修改游戏会员每日报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input v-model="form.mbAccount" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="邀请人id" prop="inMbId">
          <el-input v-model="form.inMbId" placeholder="请输入邀请人id" />
        </el-form-item>
        <el-form-item label="邀请人账号" prop="inMbAccount">
          <el-input v-model="form.inMbAccount" placeholder="请输入邀请人账号" />
        </el-form-item>
        <el-form-item label="报表时间" prop="reportDate">
          <el-input v-model="form.reportDate" placeholder="请输入报表时间" />
        </el-form-item>
        <el-form-item label="派奖金额" prop="gameWin">
          <el-input v-model="form.gameWin" placeholder="请输入派奖金额" />
        </el-form-item>
        <el-form-item label="盈利" prop="income">
          <el-input v-model="form.income" placeholder="请输入盈利" />
        </el-form-item>
        <el-form-item label="合营id" prop="hyId">
          <el-input v-model="form.hyId" placeholder="请输入合营id" />
        </el-form-item>
        <el-form-item label="币种" prop="coin">
          <el-input v-model="form.coin" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="下注金额" prop="gameBet">
          <el-input v-model="form.gameBet" placeholder="请输入下注金额" />
        </el-form-item>
        <el-form-item label="有效投注" prop="yxGameBet">
          <el-input v-model="form.yxGameBet" placeholder="请输入有效投注" />
        </el-form-item>
        <el-form-item label="下注数量" prop="betCount">
          <el-input v-model="form.betCount" placeholder="请输入下注数量" />
        </el-form-item>
        <el-form-item label="中奖数量" prop="winCount">
          <el-input v-model="form.winCount" placeholder="请输入中奖数量" />
        </el-form-item>
        <el-form-item label="盈亏比" prop="incomeRate">
          <el-input v-model="form.incomeRate" placeholder="请输入盈亏比" />
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
import { listGameDayMbReport, getGameDayMbReport, delGameDayMbReport, addGameDayMbReport, updateGameDayMbReport } from "@/api/game/gameDayMbReport";

export default {
  name: "GameDayMbReport",
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
      // 游戏会员每日报表格数据
      gameDayMbReportList: [],
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
        inMbId: null,
        inMbAccount: null,
        hyId: null,
        coin: null,
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
    /** 查询游戏会员每日报列表 */
    getList() {
      this.loading = true;
      listGameDayMbReport(this.queryParams).then(response => {
        this.gameDayMbReportList = response.rows;
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
        inMbId: null,
        inMbAccount: null,
        reportDate: null,
        gameWin: null,
        income: null,
        hyId: null,
        coin: null,
        gameBet: null,
        yxGameBet: null,
        betCount: null,
        winCount: null,
        incomeRate: null,
        remark: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
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
      this.title = "添加游戏会员每日报";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameDayMbReport(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏会员每日报";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGameDayMbReport(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameDayMbReport(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除游戏会员每日报编号为"' + ids + '"的数据项？').then(function() {
        return delGameDayMbReport(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('game/gameDayMbReport/export', {
        ...this.queryParams
      }, `gameDayMbReport_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
