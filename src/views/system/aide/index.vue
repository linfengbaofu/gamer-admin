<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
      <el-form-item label="标识" prop="aideMark">
        <el-input
          v-model="queryParams.aideMark"
          placeholder="请输入标识"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="语言" prop="aideLanguge">
        <el-input
          v-model="queryParams.aideLanguge"
          placeholder="请输入语言"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标题" prop="aideTitle">
        <el-input
          v-model="queryParams.aideTitle"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片" prop="aideUrl">
        <el-input
          v-model="queryParams.aideUrl"
          placeholder="请输入图片"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="aideSort">
        <el-input
          v-model="queryParams.aideSort"
          placeholder="请输入排序"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:aide:add']"
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
          v-hasPermi="['system:aide:edit']"
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
          v-hasPermi="['system:aide:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:aide:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="aideList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" :fixed="true" align="center" prop="aideId" />
      <el-table-column label="标识" align="center" prop="aideMark" />
      <el-table-column label="状态" align="center" prop="aideStatus" />
      <el-table-column label="语言" align="center" prop="aideLanguge" />
      <el-table-column label="标题" align="center" prop="aideTitle" />
      <el-table-column label="图片" align="center" prop="aideUrl" />
      <el-table-column label="内容" align="center" prop="aideConnet" />
      <el-table-column label="排序" align="center" prop="aideSort" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作"  :show-overflow-tooltip="false" align="center" fixed="right" width="130" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:aide:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:aide:remove']"
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

    <!-- 添加或修改辅助展示内容对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标识" prop="aideMark">
          <el-input v-model="form.aideMark" placeholder="请输入标识" />
        </el-form-item>
        <el-form-item label="语言" prop="aideLanguge">
          <el-input v-model="form.aideLanguge" placeholder="请输入语言" />
        </el-form-item>
        <el-form-item label="标题" prop="aideTitle">
          <el-input v-model="form.aideTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片" prop="aideUrl">
          <el-input v-model="form.aideUrl" placeholder="请输入图片" />
        </el-form-item>
        <el-form-item label="内容" prop="aideConnet">
          <el-input v-model="form.aideConnet" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="aideSort">
          <el-input-number v-model="form.aideSort" :controls="false" style="width: 100%;"></el-input-number>
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
import { listAide, getAide, delAide, addAide, updateAide } from "@/api/system/aide";

export default {
  name: "Aide",
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
      // 辅助展示内容表格数据
      aideList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        aideMark: null,
        aideStatus: null,
        aideLanguge: null,
        aideTitle: null,
        aideUrl: null,
        aideConnet: null,
        aideSort: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询辅助展示内容列表 */
    getList() {
      this.loading = true;
      listAide(this.queryParams).then(response => {
        this.aideList = response.rows;
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
        aideId: null,
        aideMark: null,
        aideStatus: null,
        aideLanguge: null,
        aideTitle: null,
        aideUrl: null,
        aideConnet: null,
        aideSort: null,
        remark: null,
        createTime: null,
        updateTime: null
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
      this.ids = selection.map(item => item.aideId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加辅助展示内容";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const aideId = row.aideId || this.ids
      getAide(aideId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改辅助展示内容";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.aideId != null) {
            updateAide(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAide(this.form).then(response => {
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
      const aideIds = row.aideId || this.ids;
      this.$modal.confirm('是否确认删除辅助展示内容编号为"' + aideIds + '"的数据项？').then(function() {
        return delAide(aideIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/aide/export', {
        ...this.queryParams
      }, `aide_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
