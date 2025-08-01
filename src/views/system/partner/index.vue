<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="合作伙伴名字" prop="partnerName">
        <el-input
          v-model="queryParams.partnerName"
          placeholder="请输入合作伙伴名字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合作伙伴公司" prop="partnerCompany">
        <el-input
          v-model="queryParams.partnerCompany"
          placeholder="请输入合作伙伴公司"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片跳转地址" prop="imgUrl">
        <el-input
          v-model="queryParams.imgUrl"
          placeholder="请输入图片跳转地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="partnerStatus">
        <el-select
          v-model="queryParams.partnerStatus"
          placeholder="状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.open_close"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="位置类型" prop="partnerType">
        <el-select v-model="queryParams.partnerType" placeholder="位置类型" clearable>
          <el-option
            v-for="dict in dict.type.localtioan_type"
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
          v-hasPermi="['system:partner:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="partnerList">
      <el-table-column label="合作伙伴名字" align="center" prop="partnerName" />
      <el-table-column label="合作伙伴公司" align="center" prop="partnerCompany" />
      <el-table-column label="位置类型" align="center" prop="partnerType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.localtioan_type"
            :value="scope.row.partnerType"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="partnerStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.open_close"
            :value="scope.row.partnerStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="logo图片"
        align="center"
        prop="logoImg"
        width="100"
      >
        <template slot-scope="scope">
          <image-preview :src="scope.row.logoImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="图片跳转地址" align="center" prop="imgUrl" />
      <el-table-column label="排序" align="center" prop="partnerSort" />
      <el-table-column label="合作伙伴描述" align="center" prop="partnerDesc" show-overflow-tooltip />
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
            v-hasPermi="['system:partner:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:partner:remove']"
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

    <!-- 添加或修改合作伙伴对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合作伙伴名字" prop="partnerName">
              <el-input v-model="form.partnerName" placeholder="请输入合作伙伴名字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴公司" prop="partnerCompany">
              <el-input v-model="form.partnerCompany" placeholder="请输入合作伙伴公司" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="logo图片" prop="logoImg">
          <image-upload v-model="form.logoImg" />
        </el-form-item>
        <el-form-item label="图片跳转地址" prop="imgUrl">
          <el-input v-model="form.imgUrl" placeholder="请输入图片跳转地址" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="partnerStatus">
              <el-select v-model="form.partnerStatus" placeholder="状态" clearable>
                <el-option
                  v-for="dict in dict.type.open_close"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置类型" prop="partnerType">
              <el-select
                v-model="form.partnerType"
                placeholder="位置类型"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.localtioan_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="排序" prop="partnerSort">
          <el-input-number v-model="form.partnerSort" :controls="false" style="width: 100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="合作伙伴描述" prop="partnerDesc">
          <el-input 
            v-model="form.partnerDesc" 
            type="textarea" 
            :rows="3"
            placeholder="请输入合作伙伴描述" 
          />
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
  listPartner,
  getPartner,
  delPartner,
  addPartner,
  updatePartner,
} from "@/api/system/partner";

export default {
  dicts: ["open_close", "localtioan_type"],
  name: "Partner",
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
      // 合作伙伴表格数据
      partnerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        partnerName: null,
        partnerCompany: null,
        partnerType: null,
        partnerStatus: null,
        logoImg: null,
        imgUrl: null,
        partnerSort: null,
        partnerDesc: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        partnerName: [{ required: true, message: "请输入合作伙伴名字", trigger: "blur" }],
        logoImg: [{ required: true, message: "请上传logo图片", trigger: "blur" }],
        partnerStatus: [{ required: true, message: "请选择状态", trigger: "blur" }],
        partnerType: [{ required: true, message: "请选择位置类型", trigger: "blur" }],
      },
    };
  },


  created() {
    this.getList();
  },
  methods: {
    /** 查询合作伙伴列表 */
    getList() {
      this.loading = true;
      listPartner(this.queryParams).then((response) => {
        this.partnerList = response.rows;
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
        partnerId: null,
        partnerName: null,
        partnerCompany: null,
        partnerType: null,
        partnerStatus: null,
        logoImg: null,
        imgUrl: null,
        partnerSort: null,
        partnerDesc: null,
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
      this.ids = selection.map((item) => item.partnerId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加合作伙伴";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const partnerId = row.partnerId || this.ids;
      getPartner(partnerId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改合作伙伴";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.partnerId != null) {
            updatePartner(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPartner(this.form).then((response) => {
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
      const partnerIds = row.partnerId || this.ids;
      this.$modal
        .confirm('是否确认删除合作伙伴编号为"' + partnerIds + '"的数据项？')
        .then(function () {
          return delPartner(partnerIds);
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
        "system/partner/export",
        {
          ...this.queryParams,
        },
        `partner_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
