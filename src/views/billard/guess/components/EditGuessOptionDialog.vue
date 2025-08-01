<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" append-to-body>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="form.guessId && [0, 1].includes(matchInfo.matchStatus)"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['billard:guessOption:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar :search="false" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="guessOptionList">
      <el-table-column label="ID" :fixed="true" align="center" prop="optionId" />
      <el-table-column label="竞猜ID" align="center" prop="guessId" />
      <el-table-column label="选项内容" align="center" prop="optionsInfo" />
      <el-table-column label="下注总金额" align="center" prop="betAmount" />
      <el-table-column label="当前赔率" align="center" prop="odds" />
      <el-table-column label="中奖标记" align="center" prop="winFlag">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.guess_win_flag" :value="scope.row.winFlag" />
        </template>
      </el-table-column>
      <el-table-column
        
        label="操作"
        align="center"
        fixed="right"
        width="130"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.winFlag == 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:guessOption:edit']"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.winFlag == 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:guessOption:remove']"
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

    <!-- 添加或修改竞猜选项对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible2" width="500px" append-to-body>
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
        <el-form-item v-if="formData.guessId" label="竞猜ID" prop="guessId">
          <el-input v-model="formData.guessId" placeholder="请输入竞猜ID" readonly />
        </el-form-item>
        <el-form-item label="选项内容" prop="optionsInfo">
          <el-input v-model="formData.optionsInfo" placeholder="请输入选项内容" />
        </el-form-item>
        <el-form-item label="当前赔率" prop="odds">
          <el-input v-model="formData.odds" placeholder="请输入当前赔率" />
        </el-form-item>
        <el-form-item label="排序" prop="sorted">
          <el-input-number
            v-model="formData.sorted"
            :min="0"
            :max="10000"
            placeholder="请输入排序"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  listGuessOption,
  getGuessOption,
  delGuessOption,
  addGuessOption,
  updateGuessOption,
} from "@/api/billard/guessOption";

export default {
  dicts: ["guess_win_flag"],
  props: {
    title: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    matchInfo: {
      type: Object,
      default: () => ({
        matchStatus: 0
      }),
    },
  },
  data() {
    return {
      dialogVisible2: false,
      dialogVisible: false,
      // 遮罩层
      loading: true,
      // 提交表单loading
      submitLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 竞猜选项表格数据
      guessOptionList: [],
      // 弹出层标题
      // 是否显示弹出层
      formData: {
        sorted: 0,
        matchId: this.form.matchId,
        guessId: this.form.guessId,
        optionsInfo: null,
        optionId: null,
        betAmount: null,
        odds: null,
        winFlag: null,
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        guessId: this.form.guessId,
      },
      // 表单校验
      rules: {
        guessId: [{ required: true, message: "竞猜ID不能为空", trigger: "blur" }],
        optionsInfo: [{ required: true, message: "选项内容不能为空", trigger: "blur" }],
        odds: [
          { required: true, message: "赔率不能为空", trigger: "blur" },
          {
            pattern: /^[0-9]+(\.[0-9]{1,3})?$/,
            message: "赔率最多支持3位小数",
            trigger: "blur",
          },
        ],
        sorted: [{ required: true, message: "排序不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  watch: {
    open(val) {
      this.dialogVisible = val;
      if (val) {
        this.queryParams.guessId = this.form.guessId;
        this.getList();
        this.reset();
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit("cancel");
      }
    },
  },
  created() {
    this.queryParams.guessId = this.form.guessId;
  },
  methods: {
    /** 查询竞猜选项列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      listGuessOption(this.queryParams).then((response) => {
        this.guessOptionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible2 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.formData = {
        optionId: null,
        guessId: this.form.guessId,
        optionsInfo: null,
        betAmount: null,
        odds: null,
        winFlag: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
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
      this.ids = selection.map((item) => item.optionId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.dialogVisible2 = true;
      this.title = "添加竞猜选项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const optionId = row.optionId || this.ids;
      getGuessOption(optionId).then((response) => {
        this.formData = {
          ...response.data,
          matchId: this.form.matchId,
          guessId: this.form.guessId,
        };
        this.dialogVisible2 = true;
        this.title = "修改竞猜选项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const {optionId, optionsInfo, sorted, guessId, odds} = this.formData;
          const params = {
            optionId,
            optionsInfo,
            sorted,
            guessId,
            odds,
            matchId: this.form.matchId,
          };
          console.log("params",params);
          if (this.formData.optionId != null) {
            updateGuessOption(params).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.dialogVisible2 = false;
              this.getList();
              this.$emit("submitForm");
            }).catch((error) => {
              console.error(error);
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addGuessOption({ ...params }).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.dialogVisible2 = false;
              this.getList();
            }).catch((error) => {
              console.error(error);
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const optionIds = row.optionId || this.ids;
      this.$modal
        .confirm('是否确认删除竞猜选项编号为"' + optionIds + '"的数据项？')
        .then(function () {
          return delGuessOption(optionIds);
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
        "billard/guessOption/export",
        {
          ...this.queryParams,
        },
        `guessOption_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
