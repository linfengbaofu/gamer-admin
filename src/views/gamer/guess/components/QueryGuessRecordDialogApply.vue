<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="1200px" append-to-body>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="80px">
        <!-- <el-form-item label="赛事ID" prop="matchId">
          <el-input
            v-model="queryParams.matchId"
            placeholder="请输入赛事ID"
            clearable
            style="width: 160px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="竞猜ID" prop="guessId">
          <el-input
            v-model="queryParams.guessId"
            placeholder="请输入竞猜ID"
            clearable
            style="width: 160px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="记录状态" prop="recordStatus">
          <el-select v-model="queryParams.recordStatus" placeholder="请选择记录状态" style="width: 160px">
            <el-option v-for="item in dict.type.billard_guess_record_status" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="guessRecordList" height="400">
        <el-table-column label="记录ID" align="center" prop="recordId" width="80"/>
        <el-table-column label="竞猜ID" align="center" prop="guessId" width="80"/>
        <el-table-column label="赛事ID" align="center" prop="matchId" width="80"/>
        <el-table-column label="赛事名称" align="center" prop="matchName" width="150" show-overflow-tooltip/>
        <el-table-column label="竞猜内容" align="center" prop="guessContent" width="120" show-overflow-tooltip/>
        <el-table-column label="竞猜状态" align="center" prop="guessStatus" width="80">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.guess_status" :value="scope.row.guessStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="开奖人" align="center" prop="drawingUser" width="80"/>
  
        <el-table-column label="是否封盘" align="center" prop="isStopBet" width="80">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.billard_guess_record_is_stop_bet" :value="scope.row.isStopBet"/>
          </template>
        </el-table-column>
        <el-table-column label="记录状态" align="center" prop="recordStatus" width="80">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.billard_guess_record_status" :value="scope.row.recordStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="审批人" align="center" prop="auditBy" width="80"/>
        <el-table-column label="审批时间" align="center" prop="auditTime" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark" show-overflow-tooltip/>
      </el-table>
      
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        style="margin-top: 10px"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGuessRecord } from "@/api/billard/guessRecord";

export default {
  name: "QueryGuessRecordDialog",
  dicts: ['guess_status', 'billard_guess_record_status', 'billard_guess_record_is_stop_bet'],
  props: {
    title: {
      type: String,
      default: ""
    },
    open: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 本地对话框状态
      dialogVisible: false,
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 竞猜审批表格数据
      guessRecordList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        guessId: null,
        matchId: null,
        matchName: null,
        guessContent: null,
        guessStatus: null,
        recordStatus: null,
        auditBy: null
      }
    };
  },
  watch: {
    open: {
      handler(val) {
        this.dialogVisible = val;
        if (val) {
          this.initQueryParams();
          this.getList();
        }
      },
      immediate: true
    },
    dialogVisible(val) {
      if (!val) {
        // 当对话框关闭时，通知父组件
        this.$emit('cancel');
      }
    }
  },
  methods: {
    // 初始化查询参数
    initQueryParams() {
      if (this.form && this.form.guessId) {
        this.queryParams.guessId = this.form.guessId;
        this.queryParams.matchId = this.form.matchId;
      }
    },
    /** 查询竞猜审批列表 */
    getList() {
      this.loading = true;
      listGuessRecord(this.queryParams).then(response => {
        this.guessRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        guessId: this.form && this.form.guessId ? this.form.guessId : null,
        matchId: this.form && this.form.matchId ? this.form.matchId : null,
        matchName: null,
        guessContent: null,
        guessStatus: null,
        recordStatus: null,
        auditBy: null
      };
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script> 