<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="玩法类型" prop="manualType">
        <el-select
          v-model="queryParams.manualType"
          placeholder="玩法类型"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.localtioan_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="manualStatus">
        <el-select
          v-model="queryParams.manualStatus"
          placeholder="状态"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.open_close"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="语言" prop="manualLanguge">
        <el-select
          v-model="queryParams.manualLanguge"
          placeholder="语言"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.language_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="玩法标题" prop="manualTitle">
        <el-input
          v-model="queryParams.manualTitle"
          placeholder="请输入玩法标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="发布日期" prop="releaseTime">
        <el-date-picker
          clearable
          v-model="queryParams.releaseTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择发布日期"
        >
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          v-hasPermi="['system:manual:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="manualList">
      <el-table-column label="玩法类型" align="center" prop="manualType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.localtioan_type"
            :value="scope.row.manualType"
          />
        </template>
      </el-table-column>
      <el-table-column label="语言" align="center" prop="manualLanguge">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.language_type"
            :value="scope.row.manualLanguge"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="manualStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.open_close"
            :value="scope.row.manualStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="玩法标题" align="center" prop="manualTitle" />
      <el-table-column
        label="玩法封面"
        align="center"
        prop="manualImg"
        width="100"
      >
        <template slot-scope="scope">
          <image-preview :src="scope.row.manualImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column
        label="发布日期"
        align="center"
        prop="releaseTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布内容" align="center" prop="manualConnet" show-overflow-tooltip/>
      <el-table-column label="排序" align="center" prop="manualSort" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:manual:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:manual:remove']"
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

    <!-- 添加或修改玩法说明对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="玩法类型" prop="manualType">
          <el-select v-model="form.manualType" placeholder="类型" clearable>
            <el-option
              v-for="dict in dict.type.localtioan_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="manualStatus">
          <el-select v-model="form.manualStatus" placeholder="状态" clearable>
            <el-option
              v-for="dict in dict.type.open_close"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="manualLanguge">
          <el-select v-model="form.manualLanguge" placeholder="语言" clearable>
            <el-option
              v-for="dict in dict.type.language_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="玩法标题" prop="manualTitle">
          <el-input v-model="form.manualTitle" placeholder="请输入玩法标题" />
        </el-form-item>
        <el-form-item label="玩法封面" prop="manualImg">
          <image-upload v-model="form.manualImg" :limit="1"/>
        </el-form-item>
        <el-form-item label="发布日期" prop="releaseTime">
          <el-date-picker
            clearable
            v-model="form.releaseTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发布日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布内容">
          <editor v-model="form.manualConnet" :min-height="192" />
        </el-form-item>
        <el-form-item label="排序" prop="manualSort">
          <el-input-number v-model="form.manualSort" :controls="false" style="width: 100%;"></el-input-number>
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
import { cloneDeep } from "lodash";
import {
  listManual,
  getManual,
  delManual,
  addManual,
  updateManual,
} from "@/api/system/manual";

export default {
  name: "Manual",
  dicts: ["localtioan_type", "open_close", "language_type"],
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
      // 玩法说明表格数据
      manualList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        manualTitle: null,
        manualImg: null,
        manualType: null,
        manualLanguge: null,
        manualStatus: null,
        releaseTime: null,
        manualConnet: null,
        manualSort: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        manualType: [
          { required: true, message: "玩法类型不能为空", trigger: "blur" },
        ],
        manualStatus: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
        manualLanguge: [
          { required: true, message: "语言不能为空", trigger: "blur" },
        ],
        manualTitle: [
          { required: true, message: "玩法标题不能为空", trigger: "blur" },
        ],
        manualImg: [
          { required: true, message: "玩法封面不能为空", trigger: "blur" },
        ],
        releaseTime: [
          { required: true, message: "发布日期不能为空", trigger: "blur" },
        ],
        manualConnet: [
          { required: true, message: "发布内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询玩法说明列表 */
    getList() {
      this.loading = true;
      listManual(this.queryParams).then((response) => {
        this.manualList = response.rows;
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
        manualId: null,
        manualTitle: null,
        manualImg: null,
        manualType: null,
        manualLanguge: null,
        manualStatus: null,
        releaseTime: null,
        manualConnet: null,
        manualSort: null,
        remark: null,
        createTime: null,
        updateTime: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加玩法说明";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = cloneDeep(row);
      this.open = true;
      this.title = "修改玩法说明";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateManual(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addManual(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除玩法说明编号为"' + ids + '"的数据项？')
        .then(function () {
          return delManual(ids);
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
        "system/manual/export",
        {
          ...this.queryParams,
        },
        `manual_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
