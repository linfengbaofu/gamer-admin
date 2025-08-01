<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="选项ID" prop="optionId">
        <el-input
          v-model="queryParams.optionId"
          placeholder="请输入竞猜ID"
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
        <el-select v-model="queryParams.winFlag"  placeholder="请选择中奖标记" clearable>
          <el-option v-for="item in dict.type.guess_win_flag" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="" style="margin-bottom: 10px;">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['billard:guessOption:add']"
        >新增</el-button> -->
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['billard:guessOption:edit']"
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
          v-hasPermi="['billard:guessOption:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:guessOption:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="guessOptionList">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="optionId" />
      <el-table-column label="竞猜ID" align="center" prop="guessId" />
      <el-table-column label="选项内容" align="center" prop="optionsInfo" />
      <el-table-column label="下注总金额" align="center" prop="betAmount" sortable/>
      <el-table-column label="当前赔率" align="center" prop="odds" />
      <el-table-column label="中奖标记" align="center" prop="winFlag" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.guess_win_flag" :value="scope.row.winFlag"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" fixed="right" width="130" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            v-if="![1, 2].includes(scope.row.winFlag)"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:guessOption:edit']"
          >修改</el-button>
          <el-button
            v-if="![1, 2].includes(scope.row.winFlag)"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:guessOption:remove']"
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

    <!-- 添加或修改竞猜选项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item v-if="form.optionId" label="竞猜ID" prop="guessId">
            <el-input v-model="form.optionId" placeholder="请输入竞猜ID" readonly/>
          </el-form-item>
        <el-form-item label="选项内容" prop="optionsInfo">
          <el-input v-model="form.optionsInfo" placeholder="请输入选项内容" />
        </el-form-item>
        <el-form-item label="当前赔率" prop="odds">
          <el-input v-model="form.odds" placeholder="请输入当前赔率" />
        </el-form-item>
        <el-form-item label="排序" prop="sorted">
          <el-input-number v-model="form.sorted" :min="0" :max="10000" placeholder="请输入排序" />
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
import { listGuessOption, getGuessOption, delGuessOption, addGuessOption, updateGuessOption } from "@/api/billard/guessOption";

export default {
  name: "GuessOption",
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
      // 竞猜选项表格数据
      guessOptionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        optionId: null,
        guessId: null,
        optionsInfo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        
        optionsInfo: [
          { required: true, message: "选项内容不能为空", trigger: "blur" }
        ],
        odds: [
          { required: true, message: "赔率不能为空", trigger: "blur" },
          { pattern: /^[0-9]+(\.[0-9]{1,3})?$/, message: "赔率最多支持3位小数", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询竞猜选项列表 */
    getList() {
      this.loading = true;
      listGuessOption(this.queryParams).then(response => {
        this.guessOptionList = response.rows;
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
        optionId: null,
        guessId: null,
        optionsInfo: null,
        betAmount: null,
        odds: null,
        winFlag: null,
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
      this.ids = selection.map(item => item.optionId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加竞猜选项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const optionId = row.optionId || this.ids
      getGuessOption(optionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改竞猜选项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.optionId != null) {
            updateGuessOption(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGuessOption(this.form).then(response => {
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
      const optionIds = row.optionId || this.ids;
      this.$modal.confirm('是否确认删除竞猜选项编号为"' + optionIds + '"的数据项？').then(function() {
        return delGuessOption(optionIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/guessOption/export', {
        ...this.queryParams
      }, `guessOption_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
