<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" append-to-body>

    <el-form :model="formData" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="竞猜选项" prop="optionId">
        <el-select v-model="formData.optionId" placeholder="请选择竞猜选项" filterable style="width: 100%">
          <el-option
            v-for="item in guessOptionList"
            :key="item.optionId"
            :label="item.optionsInfo"
            :value="item.optionId">
            <span style="float: left">{{ item.optionsInfo }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">赔率: {{ item.odds }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确认设置</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    
  </el-dialog>
</template>

<script>
import {
  listGuessOption,
  getGuessOption,
  delGuessOption,
  addGuessOption,
  updateGuessOption
} from "@/api/billard/guessOption";

import { setWinOption } from "@/api/billard/guess";

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
  },
  data() {
    return {
      dialogVisible: false,
      // 遮罩层
      loading: true,
      // 提交按钮loading
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
        matchId: this.form.matchId,
        guessId: this.form.guessId,
        optionId: null
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        guessId: this.form.guessId,
      },
      // 表单校验
      rules: {
        optionId: [{ required: true, message: "请选择竞猜选项", trigger: "change" }]
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
      this.dialogVisible = false;
      this.$emit("cancel");
    },
    // 表单重置
    reset() {
      this.formData = {
        matchId: this.form.matchId,
        guessId: this.form.guessId,
        optionId: null
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const params = {
            guessId: this.form.guessId,
            optionIdList: [this.formData.optionId]
          };
          
          setWinOption(params)
            .then(response => {
              this.$modal.msgSuccess("设置成功");
              this.dialogVisible = false;
              this.$emit("submitForm");
              this.$emit("success");
            })
            .catch(() => {})
            .finally(() => {
              this.submitLoading = false;
            });
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
