<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="记录id" prop="recordId">
        <el-input
          v-model="queryParams.recordId"
          placeholder="请输入记录id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主键ID" prop="optionId">
        <el-input
          v-model="queryParams.optionId"
          placeholder="请输入主键ID"
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
      <el-form-item label="选项内容" prop="optionsInfo">
        <el-input
          v-model="queryParams.optionsInfo"
          placeholder="请输入选项内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="中奖标记" prop="winFlag">
        <el-select v-model="queryParams.winFlag" placeholder="请选择中奖标记">
          <el-option v-for="item in dict.type.guess_win_flag" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
          v-hasPermi="['billard:guessOptionRecord:add']"
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
          v-hasPermi="['billard:guessOptionRecord:edit']"
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
          v-hasPermi="['billard:guessOptionRecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:guessOptionRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="guessOptionRecordList" @selection-change="handleSelectionChange">
      <el-table-column label="选项记录id" align="center" prop="optionRecordId" width="100"/>
      <el-table-column label="记录id" align="center" prop="recordId" width="100"/>
      <el-table-column label="主键ID" align="center" prop="optionId" width="100"/>
      <el-table-column label="竞猜ID" align="center" prop="guessId" width="100"/>
      <el-table-column label="选项内容" align="center" prop="optionsInfo" show-overflow-tooltip/>
      <el-table-column label="当前赔率" align="center" prop="odds" />
      <el-table-column label="中奖标记" align="center" prop="winFlag" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.guess_win_flag" :value="scope.row.winFlag"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sorted" />
      <el-table-column label="备注信息" align="center" prop="remark" />
      
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listGuessOptionRecord, getGuessOptionRecord, delGuessOptionRecord, addGuessOptionRecord, updateGuessOptionRecord } from "@/api/billard/guessOptionRecord";

export default {
  name: "GuessOptionRecord",
  dicts: ['guess_win_flag'],
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
      // 竞猜选项审批表格数据
      guessOptionRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recordId: null,
        optionId: null,
        guessId: null,
        optionsInfo: null,
        betAmount: null,
        odds: null,
        winFlag: null,
        sorted: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        recordId: [
          { required: true, message: "记录id不能为空", trigger: "blur" }
        ],
        guessId: [
          { required: true, message: "竞猜ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询竞猜选项审批列表 */
    getList() {
      this.loading = true;
      listGuessOptionRecord(this.queryParams).then(response => {
        this.guessOptionRecordList = response.rows;
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
        optionRecordId: null,
        recordId: null,
        optionId: null,
        guessId: null,
        optionsInfo: null,
        betAmount: null,
        odds: null,
        winFlag: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        sorted: null,
        delFlag: null,
        remark: null
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
      this.ids = selection.map(item => item.optionRecordId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加竞猜选项审批";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const optionRecordId = row.optionRecordId || this.ids
      getGuessOptionRecord(optionRecordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改竞猜选项审批";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.optionRecordId != null) {
            updateGuessOptionRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGuessOptionRecord(this.form).then(response => {
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
      const optionRecordIds = row.optionRecordId || this.ids;
      this.$modal.confirm('是否确认删除竞猜选项审批编号为"' + optionRecordIds + '"的数据项？').then(function() {
        return delGuessOptionRecord(optionRecordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/guessOptionRecord/export', {
        ...this.queryParams
      }, `guessOptionRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
