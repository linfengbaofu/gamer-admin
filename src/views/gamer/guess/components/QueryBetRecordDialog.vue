<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="1200px" append-to-body>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="80px">
        <el-form-item label="会员ID" prop="mbId">
          <el-input
            v-model="queryParams.mbId"
            placeholder="请输入会员ID"
            clearable
            style="width: 160px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="选项ID" prop="optionId">
          <el-input
            v-model="queryParams.optionId"
            placeholder="请输入选项ID"
            clearable
            style="width: 160px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="中奖标记" prop="winFlag">
          <el-select v-model="queryParams.winFlag" placeholder="请选择中奖标记" style="width: 160px" clearable>
            <el-option v-for="item in dict.type.guess_win_flag" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="betRecordList" height="400">
        <el-table-column label="ID" :fixed="true" align="center" prop="betRecordId" width="100"/>
        <el-table-column label="会员ID" align="center" prop="mbId" width="100"/>
        <el-table-column label="会员账号" align="center" prop="mbAccount" width="120" show-overflow-tooltip/>
        <el-table-column label="竞猜ID" align="center" prop="guessId" width="100"/>
        <el-table-column label="竞猜名称" align="center" prop="guessContent" width="150" show-overflow-tooltip/>
        <el-table-column label="选项ID" align="center" prop="optionId" width="100"/>
        <el-table-column label="选项名称" align="center" prop="optionsInfo" width="150" show-overflow-tooltip/>
        <el-table-column label="下注积分" align="center" prop="betPoints" width="120"/>
        <!-- <el-table-column label="抽水积分" align="center" prop="pumpPoints" width="120"/> -->
        <el-table-column label="中奖积分" align="center" prop="winPoints" width="120"/>
        <el-table-column label="中奖标记" align="center" prop="winFlag" width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.guess_win_flag" :value="scope.row.winFlag" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="150">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
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
import { listBetRecord } from "@/api/billard/betRecord";

export default {
  name: "QueryBetRecordDialog",
  dicts: ['guess_win_flag'],
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
      // 对话框可见性
      dialogVisible: false,
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 下注记录表格数据
      betRecordList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        guessId: null,
        optionId: null,
        winFlag: null
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
          this.reset();
        }
      },
      immediate: true
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('cancel');
      }
    }
  },
  methods: {
    // 初始化查询参数
    initQueryParams() {
      if (this.form && this.form.guessId) {
        this.queryParams.guessId = this.form.guessId;
      }
    },
    /** 查询下注记录列表 */
    getList() {
      this.loading = true;
      listBetRecord(this.queryParams).then(response => {
        this.betRecordList = response.rows;
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
        mbId: null,
        guessId: this.form && this.form.guessId ? this.form.guessId : null,
        optionId: null,
        winFlag: null
      };
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
    }
  }
};
</script> 