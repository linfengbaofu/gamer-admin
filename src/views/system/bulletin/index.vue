<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="公告类型" prop="bulletinType">
        <el-select
          v-model="queryParams.bulletinType"
          placeholder="公告类型"
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
      <el-form-item label="状态" prop="bulletinStatus">
        <el-select
          v-model="queryParams.bulletinStatus"
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
      <el-form-item label="语言" prop="bulletinLanguge">
        <el-select
          v-model="queryParams.bulletinLanguge"
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
          v-hasPermi="['system:bulletin:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:bulletin:edit']"
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
          v-hasPermi="['system:bulletin:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:bulletin:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="bulletinList">
      <el-table-column label="公告id" align="center" prop="bulletinId" />
      <el-table-column label="公告类型" align="center" prop="bulletinType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.localtioan_type"
            :value="scope.row.bulletinType"
          />
        </template>
      </el-table-column>
      <el-table-column label="语言" align="center" prop="bulletinLanguge">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.language_type"
            :value="scope.row.bulletinLanguge"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="bulletinStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.open_close"
            :value="scope.row.bulletinStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="公告图片"
        align="center"
        prop="bulletinImg"
        width="100"
      >
        <template slot-scope="scope">
          <image-preview
            :src="scope.row.bulletinImg"
            :width="50"
            :height="50"
          />
        </template>
      </el-table-column>
      <el-table-column label="公告标题" align="center" prop="bulletinTitle" />
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
      <el-table-column label="公告内容" align="center" prop="bulletinConnet" show-overflow-tooltip/>
      <el-table-column label="排序" align="center" prop="bulletinSort" />
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
            v-hasPermi="['system:bulletin:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:bulletin:remove']"
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

    <!-- 添加或修改平台公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="bulletinType">
          <el-select v-model="form.bulletinType" placeholder="类型" clearable>
            <el-option
              v-for="dict in dict.type.localtioan_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="bulletinStatus">
          <el-select v-model="form.bulletinStatus" placeholder="状态" clearable>
            <el-option
              v-for="dict in dict.type.open_close"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="bulletinLanguge">
          <el-select
            v-model="form.bulletinLanguge"
            placeholder="语言"
            clearable
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
            v-model="form.releaseTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发布日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公告图片" prop="bulletinImg">
          <image-upload v-model="form.bulletinImg" :limit="1"/>
        </el-form-item>
        <el-form-item label="公告标题" prop="bulletinTitle">
          <el-input v-model="form.bulletinTitle" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="公告内容" prop="bulletinConnet">
          <editor v-model="form.bulletinConnet" :min-height="192" />
        </el-form-item>
        <el-form-item label="排序" prop="bulletinSort">
          <el-input-number v-model="form.bulletinSort" :controls="false" style="width: 100%;"></el-input-number>
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
  listBulletin,
  getBulletin,
  delBulletin,
  addBulletin,
  updateBulletin,
} from "@/api/system/bulletin";

export default {
  name: "Bulletin",
  dicts: ["open_close", "localtioan_type", "language_type"],
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
      // 平台公告表格数据
      bulletinList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bulletinType: null,
        bulletinLanguge: null,
        bulletinStatus: null,
        bulletinImg: null,
        bulletinTitle: null,
        releaseTime: null,
        bulletinConnet: null,
        bulletinSort: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bulletinType: [
          { required: true, message: "类型不能为空", trigger: "blur" },
        ],
        bulletinStatus: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
        bulletinLanguge: [
          { required: true, message: "语言不能为空", trigger: "blur" },
        ],
        bulletinTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" },
        ],
        releaseTime: [
          { required: true, message: "发布日期不能为空", trigger: "blur" },
        ],
        bulletinImg: [
          { required: true, message: "公告图片不能为空", trigger: "blur" },
        ],
        bulletinConnet: [
          { required: true, message: "公告内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询平台公告列表 */
    getList() {
      this.loading = true;
      listBulletin(this.queryParams).then((response) => {
        this.bulletinList = response.rows;
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
        bulletinType: null,
        bulletinStatus: null,
        bulletinLanguge: null,
        releaseTime: [],
        bulletinImg: null,
        bulletinTitle: null,
        bulletinConnet: null,
        bulletinSort: null,
        releaseTime: null,
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.bulletinId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加平台公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "修改平台公告";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.bulletinId != null) {
            updateBulletin(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBulletin(this.form).then((response) => {
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
      const bulletinIds = row.bulletinId || this.ids;
      this.$modal
        .confirm('是否确认删除平台公告编号为"' + bulletinIds + '"的数据项？')
        .then(function () {
          return delBulletin(bulletinIds);
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
        "system/bulletin/export",
        {
          ...this.queryParams,
        },
        `bulletin_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
