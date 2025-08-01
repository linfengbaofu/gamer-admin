<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="类型" prop="officialType">
        <el-select
          v-model="queryParams.officialType"
          placeholder="类型"
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
      <el-form-item label="状态" prop="officialStatus">
        <el-select
          v-model="queryParams.officialStatus"
          placeholder="状态"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="语言" prop="officialLanguge">
        <el-select
          v-model="queryParams.officialLanguge"
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
      <el-form-item label="发布日期" prop="releaseTime">
        <el-date-picker
          clearable
          v-model="queryParams.releaseTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择发布日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endTime">
        <el-date-picker
          clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期"
        >
        </el-date-picker>
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
          v-hasPermi="['system:official:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:official:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="officialList">
      <el-table-column label="ID" :fixed="true" align="center" prop="officialId" />
      <el-table-column label="公告类型" align="center" prop="officialType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.localtioan_type" :value="scope.row.officialType" />
        </template>
      </el-table-column>
      <el-table-column label="语言" align="center" prop="officialLanguge" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.language_type" :value="scope.row.officialLanguge" />
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        prop="officialStatus"
      >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.common_status" :value="scope.row.officialStatus" />
        </template>
      </el-table-column>
      <el-table-column
        label="公告图片"
        align="center"
        prop="officialImg"
        width="100"

      >
        <template slot-scope="scope">
          <image-preview
            :src="scope.row.officialImg"
            :width="50"
            :height="50"
          />
        </template>
      </el-table-column>
      <el-table-column label="公告标题" align="center" prop="officialTitle" />
      <el-table-column label="公告内容" align="center" prop="officialConnet" show-overflow-tooltip/>
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
      <el-table-column
        label="结束日期"
        align="center"
        prop="endTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="officialSort" />
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
            v-hasPermi="['system:official:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:official:remove']"
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

    <!-- 添加或修改官方公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="officialType">
          <el-select v-model="form.officialType" placeholder="类型" clearable>
            <el-option
              v-for="dict in dict.type.localtioan_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="officialStatus">
          <el-select v-model="form.officialStatus" placeholder="状态" clearable>
            <el-option
              v-for="dict in dict.type.common_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="officialLanguge">
          <el-select v-model="form.officialLanguge" placeholder="语言" clearable>
            <el-option
              v-for="dict in dict.type.language_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公告标题" prop="officialTitle">
          <el-input v-model="form.officialTitle" placeholder="请输入公告标题" />
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
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束日期"

          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公告图片" prop="officialImg">
          <image-upload v-model="form.officialImg" :limit="1"/>
        </el-form-item>
        <el-form-item label="公告内容" prop="officialConnet">
          <editor v-model="form.officialConnet" :min-height="192" />
        </el-form-item>
        <el-form-item label="排序" prop="officialSort">
          <el-input-number v-model="form.officialSort" :controls="false" style="width: 100%;"></el-input-number>
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
  listOfficial,
  getOfficial,
  delOfficial,
  addOfficial,
  updateOfficial,
} from "@/api/system/official";

import { cloneDeep } from "lodash";
export default {
  dicts: ["common_status", "localtioan_type", "language_type"],
  name: "Official",
  data() {
    return {
      // 遮罩层
      loading: true,

      total: 0,
      // 官方公告表格数据
      officialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        officialType: null,
        officialStatus: null,
        officialLanguge: null,
        releaseTime: null,
        endTime: null,
        officialSort: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        officialType: [
          { required: true, message: "公告类型不能为空", trigger: "blur" },
        ],
        officialStatus: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
        officialLanguge: [
          { required: true, message: "语言不能为空", trigger: "blur" },
        ],
        officialTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" },
        ],
        releaseTime: [
          { required: true, message: "发布日期不能为空", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "结束日期不能为空", trigger: "blur" },
        ],
        officialImg: [
          { required: true, message: "公告图片不能为空", trigger: "blur" },
        ],
        officialConnet: [
          { required: true, message: "公告内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询官方公告列表 */
    getList() {
      this.loading = true;
      listOfficial(this.queryParams).then((response) => {
        this.officialList = response.rows;
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
        officialType: null,
        officialStatus: null,
        officialLanguge: null,
        officialTitle: [],
        releaseTime: null,
        endTime: null,
        officialImg: null,
        officialConnet: null,
        officialSort: null,
        remark: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加官方公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = cloneDeep(row);
      this.open = true;
      this.title = "修改官方公告";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.officialId != null) {
            updateOfficial(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOfficial(this.form).then((response) => {
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
      const officialIds = row.officialId || this.ids;
      this.$modal
        .confirm('是否确认删除官方公告编号为"' + officialIds + '"的数据项？')
        .then(function () {
          return delOfficial(officialIds);
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
        "system/official/export",
        {
          ...this.queryParams,
        },
        `official_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
