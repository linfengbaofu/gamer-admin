<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="弹窗状态" prop="promptStatus">
        <el-select
          v-model="queryParams.promptStatus"
          placeholder="状态"
          clearable
          style="width: 240px"
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
      <el-form-item label="语言类型" prop="promptLanguge">
        <el-select
          v-model="queryParams.promptLanguge"
          placeholder="语言"
          clearable
          style="width: 240px"
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
      <el-form-item label="用户类型" prop="mbType">
        <el-select
          v-model="queryParams.mbType"
          placeholder="请输入用户类型"
          clearable
          style="width: 240px"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.single_all"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="弹窗标题" prop="promptTitle">
        <el-input
          v-model="queryParams.promptTitle"
          placeholder="请输入弹窗标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
          v-hasPermi="['system:prompt:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="promptList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="弹窗标题" align="center" prop="promptTitle" />
      <el-table-column label="用户类型" align="center" prop="mbType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.single_all" :value="scope.row.mbType" />
        </template>
      </el-table-column>
      <el-table-column label="用户id" align="center" prop="mbId" />
      <el-table-column label="语言" align="center" prop="promptLanguge">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.language_type"
            :value="scope.row.promptLanguge"
          />
        </template>
      </el-table-column>
      <el-table-column label="弹窗状态" align="center" prop="promptStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.open_close"
            :value="scope.row.promptStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="弹窗内容" align="center" prop="promptConnet" show-overflow-tooltip/>
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
            v-hasPermi="['system:prompt:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:prompt:remove']"
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

    <!-- 添加或修改弹窗消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="弹窗状态" prop="promptStatus">
          <el-select v-model="form.promptStatus" placeholder="状态" clearable>
            <el-option
              v-for="dict in dict.type.open_close"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="语言类型" prop="promptLanguge">
          <el-select v-model="form.promptLanguge" placeholder="语言" clearable>
            <el-option
              v-for="dict in dict.type.language_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="mbType">
          <el-select
            v-model="form.mbType"
            placeholder="请输入用户类型"
            clearable
            style="width: 240px"
            @change="form.mbId = null"
          >
            <el-option
              v-for="dict in dict.type.single_all"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker
            clearable
            v-model="form.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发布日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发布日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="弹窗标题" prop="promptTitle">
          <el-input v-model="form.promptTitle" placeholder="请输入弹窗标题" />
        </el-form-item>
        <el-form-item label="用户id" prop="mbId" v-if="form.mbType === '0'">
          <el-input v-model="form.mbId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="弹窗内容" prop="promptConnet">
          <editor v-model="form.promptConnet" :min-height="192" />
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
import {
  listPrompt,
  getPrompt,
  delPrompt,
  addPrompt,
  updatePrompt,
} from "@/api/system/prompt";

import { cloneDeep } from "lodash";
export default {
  name: "Prompt",
  dicts: ["open_close", "language_type", "single_all"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 弹窗消息表格数据
      promptList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        promptStatus: null,
        promptLanguge: null,
        mbType: null,
        promptTitle: null,
        mbId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        promptStatus: [{ required: true, message: "请选择弹窗状态", trigger: "blur" }],
        promptLanguge: [{ required: true, message: "请选择语言类型", trigger: "blur" }],
        mbType: [{ required: true, message: "请选择用户类型", trigger: "blur" }],
        startTime: [{ required: true, message: "请选择开始日期", trigger: "blur" }],
        endTime: [{ required: true, message: "请选择结束日期", trigger: "blur" }],
        promptTitle: [{ required: true, message: "请输入弹窗标题", trigger: "blur" }],  
        promptConnet: [{ required: true, message: "请输入弹窗内容", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询弹窗消息列表 */
    getList() {
      this.loading = true;
      listPrompt(this.queryParams).then((response) => {
        this.promptList = response.rows;
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
        promptStatus: null,
        promptLanguge: null,
        mbType: null,
        promptTitle: null,
        mbId: null,
        promptConnet: null,
        remark: null,
        startTime: null,
        endTime: null,
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
      this.ids = selection.map((item) => item.promptId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加弹窗消息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = cloneDeep(row);
      this.open = true;
      this.title = "修改弹窗消息";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.promptId != null) {
            updatePrompt(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPrompt(this.form).then((response) => {
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
      const promptIds = row.promptId || this.ids;
      this.$modal
        .confirm('是否确认删除弹窗消息编号为"' + promptIds + '"的数据项？')
        .then(function () {
          return delPrompt(promptIds);
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
        "system/prompt/export",
        {
          ...this.queryParams,
        },
        `prompt_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
