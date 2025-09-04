<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="游戏类型" prop="formType">
        <el-select v-model="queryParams.formType" placeholder="请选择游戏类型">
          <el-option v-for="item in dict.type.record_form_type" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围" prop="dateTimeRange">
        <el-date-picker
          v-model="queryParams.dateTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item label="用户id" prop="mbId">
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
      <el-form-item label="游戏id" prop="gameId">
        <el-input
          v-model="queryParams.gameId"
          placeholder="请输入游戏id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="牌局id" prop="roundId">
        <el-input
          v-model="queryParams.roundId"
          placeholder="请输入牌局id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       -->
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
          v-hasPermi="['member:GameRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="GameRecordList" @selection-change="handleSelectionChange">
      <el-table-column label="游戏记录id" align="center" prop="id" :fixed="true" width="180" />
      <el-table-column label="用户id" align="center" prop="mbId" width="150" />
      <el-table-column label="用户账号" align="center" prop="mbAccount" width="150" />
      <el-table-column label="游戏类型" align="center" prop="formType" width="150" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.record_form_type" :value="scope.row.formType" />
        </template>
      </el-table-column>
      <el-table-column label="游戏id" align="center" prop="gameId" width="150"/>
      <el-table-column label="牌局id" align="center" prop="roundId" width="150"/>
      <el-table-column label="游戏初始金额" align="center" prop="enterMoney" width="150" />
      <el-table-column label="结算之后玩家身上的钱" align="center" prop="afterSettlementMoney" width="150"  />
      <el-table-column label="下注金额" align="center" prop="gameBet" width="150" />
      <el-table-column label="派奖金额" align="center" prop="gameWin" width="150" />
      <el-table-column label="传回游戏记录id" align="center" prop="recordId" width="150" />
      <el-table-column label="盈利" align="center" prop="income" width="150" />
      <el-table-column label="邀请人" align="center" prop="inMbAccount" width="150" />
      <el-table-column label="合营id" align="center" prop="hyId" width="150" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150" />

    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改注单记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input v-model="form.mbAccount" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="游戏id" prop="gameId">
          <el-input v-model="form.gameId" placeholder="请输入游戏id" />
        </el-form-item>
        <el-form-item label="牌局id" prop="roundId">
          <el-input v-model="form.roundId" placeholder="请输入牌局id" />
        </el-form-item>
        <el-form-item label="游戏初始金额" prop="enterMoney">
          <el-input v-model="form.enterMoney" placeholder="请输入游戏初始金额" />
        </el-form-item>
        <el-form-item label="结算之后玩家身上的钱" prop="afterSettlementMoney">
          <el-input v-model="form.afterSettlementMoney" placeholder="请输入结算之后玩家身上的钱" />
        </el-form-item>
        <el-form-item label="下注金额" prop="gameBet">
          <el-input v-model="form.gameBet" placeholder="请输入下注金额" />
        </el-form-item>
        <el-form-item label="派奖金额" prop="gameWin">
          <el-input v-model="form.gameWin" placeholder="请输入派奖金额" />
        </el-form-item>
        <el-form-item label="传回游戏记录id" prop="recordId">
          <el-input v-model="form.recordId" placeholder="请输入传回游戏记录id" />
        </el-form-item>
        <el-form-item label="盈利" prop="income">
          <el-input v-model="form.income" placeholder="请输入盈利" />
        </el-form-item>
        <el-form-item label="合营id" prop="hyId">
          <el-input v-model="form.hyId" placeholder="请输入合营id" />
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
import { listGameRecord, getGameRecord, delGameRecord, addGameRecord, updateGameRecord } from "@/api/member/GameRecord";

export default {
  dicts: ['record_form_type'],
  name: "GameRecord",
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
      // 注单记录表格数据
      GameRecordList: [],
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
        gameId: null,
        roundId: null,
        enterMoney: null,
        afterSettlementMoney: null,
        gameBet: null,
        gameWin: null,
        recordId: null,
        income: null,
        hyId: null,
        dateTimeRange: [],
        startTime: null,
        endTime: null
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
    /** 查询注单记录列表 */
    getList() {
      this.loading = true;
      const { dateTimeRange, ...rest } = this.queryParams;
      const queryParams = { ...rest };
      console.log(dateTimeRange);
      if (dateTimeRange) {
        queryParams.startTime = dateTimeRange[0];
        queryParams.endTime = dateTimeRange[1];
      }
      listGameRecord(queryParams).then(response => {
        this.GameRecordList = response.rows;
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
        gameId: null,
        roundId: null,
        enterMoney: null,
        afterSettlementMoney: null,
        gameBet: null,
        gameWin: null,
        recordId: null,
        income: null,
        createTime: null,
        hyId: null
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
      this.title = "添加注单记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改注单记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGameRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameRecord(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除注单记录编号为"' + ids + '"的数据项？').then(function() {
        return delGameRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/GameRecord/export', {
        ...this.queryParams
      }, `GameRecord_${new Date().getTime()}.xlsx`)
    },
    /** 处理日期时间范围变化 */
    handleDateTimeRangeChange(value) {
      if (value && value.length === 2) {
        this.queryParams.startTime = value[0];
        this.queryParams.endTime = value[1];
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    }
  }
};
</script>
