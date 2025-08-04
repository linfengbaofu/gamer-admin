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
      <el-form-item label="币种" prop="coin">
        <el-input
          v-model="queryParams.coin"
          placeholder="请输入币种"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="差额" prop="subPoint">
        <el-input
          v-model="queryParams.subPoint"
          placeholder="请输入差额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="oldPoint">
        <el-input
          v-model="queryParams.oldPoint"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="newPoint">
        <el-input
          v-model="queryParams.newPoint"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="hyId">
        <el-input
          v-model="queryParams.hyId"
          placeholder="请输入${comment}"
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
      <el-form-item label="${comment}" prop="inMbId">
        <el-input
          v-model="queryParams.inMbId"
          placeholder="请输入${comment}"
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
      <el-form-item label="${comment}" prop="pumpBetMbId">
        <el-input
          v-model="queryParams.pumpBetMbId"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合营上级账号" prop="pumpBetMbAccount">
        <el-input
          v-model="queryParams.pumpBetMbAccount"
          placeholder="请输入合营上级账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="抽水比例" prop="pumpRate">
        <el-input
          v-model="queryParams.pumpRate"
          placeholder="请输入抽水比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下注积分" prop="pumpBetPoints">
        <el-input
          v-model="queryParams.pumpBetPoints"
          placeholder="请输入下注积分"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="赠送积分" prop="givePoints">
        <el-input
          v-model="queryParams.givePoints"
          placeholder="请输入赠送积分"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="游戏名称" prop="gameName">
        <el-input
          v-model="queryParams.gameName"
          placeholder="请输入游戏名称"
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
          v-hasPermi="['member:GameFundingRecord:add']"
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
          v-hasPermi="['member:GameFundingRecord:edit']"
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
          v-hasPermi="['member:GameFundingRecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:GameFundingRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="GameFundingRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="recordId" />
      <el-table-column label="用户id" align="center" prop="mbId" />
      <el-table-column label="用户账号" align="center" prop="mbAccount" />
      <el-table-column label="币种" align="center" prop="coin" />
      <el-table-column label="差额" align="center" prop="subPoint" />
      <el-table-column label="${comment}" align="center" prop="oldPoint" />
      <el-table-column label="${comment}" align="center" prop="newPoint" />
      <el-table-column label="交易类型" align="center" prop="tradeType" />
      <el-table-column label="资金类型" align="center" prop="fundingType" />
      <el-table-column label="${comment}" align="center" prop="hyId" />
      <el-table-column label="游戏id" align="center" prop="gameId" />
      <el-table-column label="${comment}" align="center" prop="inMbId" />
      <el-table-column label="邀请人账号" align="center" prop="inMbAccount" />
      <el-table-column label="${comment}" align="center" prop="pumpBetMbId" />
      <el-table-column label="合营上级账号" align="center" prop="pumpBetMbAccount" />
      <el-table-column label="抽水比例" align="center" prop="pumpRate" />
      <el-table-column label="下注积分" align="center" prop="pumpBetPoints" />
      <el-table-column label="赠送积分" align="center" prop="givePoints" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="游戏名称" align="center" prop="gameName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:GameFundingRecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:GameFundingRecord:remove']"
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

    <!-- 添加或修改资金记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input v-model="form.mbAccount" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="币种" prop="coin">
          <el-input v-model="form.coin" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="差额" prop="subPoint">
          <el-input v-model="form.subPoint" placeholder="请输入差额" />
        </el-form-item>
        <el-form-item label="${comment}" prop="oldPoint">
          <el-input v-model="form.oldPoint" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="newPoint">
          <el-input v-model="form.newPoint" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="hyId">
          <el-input v-model="form.hyId" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="游戏id" prop="gameId">
          <el-input v-model="form.gameId" placeholder="请输入游戏id" />
        </el-form-item>
        <el-form-item label="${comment}" prop="inMbId">
          <el-input v-model="form.inMbId" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="邀请人账号" prop="inMbAccount">
          <el-input v-model="form.inMbAccount" placeholder="请输入邀请人账号" />
        </el-form-item>
        <el-form-item label="${comment}" prop="pumpBetMbId">
          <el-input v-model="form.pumpBetMbId" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="合营上级账号" prop="pumpBetMbAccount">
          <el-input v-model="form.pumpBetMbAccount" placeholder="请输入合营上级账号" />
        </el-form-item>
        <el-form-item label="抽水比例" prop="pumpRate">
          <el-input v-model="form.pumpRate" placeholder="请输入抽水比例" />
        </el-form-item>
        <el-form-item label="下注积分" prop="pumpBetPoints">
          <el-input v-model="form.pumpBetPoints" placeholder="请输入下注积分" />
        </el-form-item>
        <el-form-item label="赠送积分" prop="givePoints">
          <el-input v-model="form.givePoints" placeholder="请输入赠送积分" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="form.gameName" placeholder="请输入游戏名称" />
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
import { listGameFundingRecord, getGameFundingRecord, delGameFundingRecord, addGameFundingRecord, updateGameFundingRecord } from "@/api/member/GameFundingRecord";

export default {
  name: "GameFundingRecord",
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
      // 资金记录表格数据
      GameFundingRecordList: [],
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
        coin: null,
        subPoint: null,
        oldPoint: null,
        newPoint: null,
        tradeType: null,
        fundingType: null,
        hyId: null,
        gameId: null,
        inMbId: null,
        inMbAccount: null,
        pumpBetMbId: null,
        pumpBetMbAccount: null,
        pumpRate: null,
        pumpBetPoints: null,
        givePoints: null,
        gameName: null
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
    /** 查询资金记录列表 */
    getList() {
      this.loading = true;
      listGameFundingRecord(this.queryParams).then(response => {
        this.GameFundingRecordList = response.rows;
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
        mbId: null,
        mbAccount: null,
        coin: null,
        subPoint: null,
        oldPoint: null,
        newPoint: null,
        tradeType: null,
        fundingType: null,
        hyId: null,
        gameId: null,
        inMbId: null,
        inMbAccount: null,
        pumpBetMbId: null,
        pumpBetMbAccount: null,
        pumpRate: null,
        pumpBetPoints: null,
        givePoints: null,
        createTime: null,
        createBy: null,
        remark: null,
        gameName: null
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
      this.title = "添加资金记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getGameFundingRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资金记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recordId != null) {
            updateGameFundingRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameFundingRecord(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除资金记录编号为"' + recordIds + '"的数据项？').then(function() {
        return delGameFundingRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/GameFundingRecord/export', {
        ...this.queryParams
      }, `GameFundingRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
