<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="会员ID" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入会员ID"
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
      <el-form-item label="会员账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入会员账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="选项ID" prop="optionId">
        <el-input
          v-model="queryParams.optionId"
          placeholder="请输入选项ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="中奖标记" prop="winFlag">
        <el-select v-model="queryParams.winFlag"  placeholder="请选择中奖标记" clearable>
          <el-option v-for="item in dict.type.guess_win_flag" :key="item.value" :label="item.label" :value="item.value" />
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
          v-hasPermi="['billard:betRecord:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['billard:betRecord:edit']"
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
          v-hasPermi="['billard:betRecord:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:betRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="betRecordList" @selection-change="handleSelectionChange">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="betRecordId" width="150"/>
      <el-table-column label="会员ID" align="center" prop="mbId" width="150"/>
      <el-table-column label="会员账号" align="center" prop="mbAccount" width="150"/>
      <el-table-column label="竞猜ID" align="center" prop="guessId" width="150"/>
      <el-table-column label="竞猜名称" align="center" prop="guessContent" width="150"/>
      <el-table-column label="选项ID" align="center" prop="optionId" width="150"/>
      <el-table-column label="选项名称" align="center" prop="optionsInfo" width="150"/>
      
      <el-table-column label="下注积分" align="center" prop="betPoints" width="150"/>
      <!-- <el-table-column label="抽水积分" align="center" prop="pumpPoints" width="150"/> -->
      
      <el-table-column label="中奖积分" align="center" prop="winPoints" />
      <el-table-column label="中奖标记" align="center" prop="winFlag" fixed='right'>
        <template slot-scope="scope">
          <dict-tag :options="dict.type.guess_win_flag" :value="scope.row.winFlag" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>
      
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改下注记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="会员ID" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入会员ID" />
        </el-form-item>
        <el-form-item label="竞猜ID" prop="guessId">
          <el-input v-model="form.guessId" placeholder="请输入竞猜ID" />
        </el-form-item>
        <el-form-item label="选项ID" prop="optionId">
          <el-input v-model="form.optionId" placeholder="请输入选项ID" />
        </el-form-item>
        <el-form-item label="下注金额" prop="betPoints">
          <el-input v-model="form.betPoints" placeholder="请输入下注金额" />
        </el-form-item>
        <el-form-item label="抽水金额" prop="pumpPoints">
          <el-input v-model="form.pumpPoints" placeholder="请输入抽水金额" />
        </el-form-item>
        <el-form-item label="中奖标记" prop="winFlag">
          <el-select v-model="form.winFlag"  placeholder="请选择中奖标记" clearable>
            <el-option v-for="item in dict.type.guess_win_flag" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="中奖金额" prop="winPoints">
          <el-input v-model="form.winPoints" placeholder="请输入中奖金额" />
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
import { listBetRecord, getBetRecord, delBetRecord, addBetRecord, updateBetRecord } from "@/api/billard/betRecord";

export default {
  dicts: ['guess_win_flag'],
  name: "BetRecord",
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
      // 下注记录表格数据
      betRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        guessId: null,
        optionId: null,
        betPoints: null,
        pumpPoints: null,
        winFlag: null,
        winPoints: null,mbAccount: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mbId: [
          { required: true, message: "会员ID不能为空", trigger: "blur" }
        ],
        guessId: [
          { required: true, message: "竞猜ID不能为空", trigger: "blur" }
        ],
        optionId: [
          { required: true, message: "选项ID不能为空", trigger: "blur" }
        ],
        betPoints: [
          { required: true, message: "下注金额不能为空", trigger: "blur" }
        ],
        pumpPoints: [
          { required: true, message: "抽水金额不能为空", trigger: "blur" }
        ],
        winPoints: [
          { required: true, message: "中奖金额不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询下注记录列表 */
    getList() {
      this.loading = true;
      listBetRecord(this.queryParams).then(response => {
        this.betRecordList = response.rows;
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
        betRecordId: null,
        mbId: null,
        guessId: null,
        optionId: null,
        betPoints: null,
        pumpPoints: null,
        winFlag: null,
        winPoints: null,
        createTime: null
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
      this.ids = selection.map(item => item.betRecordId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加下注记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const betRecordId = row.betRecordId || this.ids
      getBetRecord(betRecordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改下注记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.betRecordId != null) {
            updateBetRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBetRecord(this.form).then(response => {
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
      const betRecordIds = row.betRecordId || this.ids;
      this.$modal.confirm('是否确认删除下注记录编号为"' + betRecordIds + '"的数据项？').then(function() {
        return delBetRecord(betRecordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/betRecord/export', {
        ...this.queryParams
      }, `betRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
