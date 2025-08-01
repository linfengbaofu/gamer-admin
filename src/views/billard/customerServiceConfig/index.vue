<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客服微信" prop="csWx">
        <el-input
          v-model="queryParams.csWx"
          placeholder="请输入客服微信"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="会员id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入会员id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="csTelephone">
        <el-input
          v-model="queryParams.csTelephone"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客服qq" prop="csQq">
        <el-input
          v-model="queryParams.csQq"
          placeholder="请输入客服qq"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客服邮箱" prop="csEmail">
        <el-input
          v-model="queryParams.csEmail"
          placeholder="请输入客服邮箱"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客服服务时间" prop="csTimeStr">
        <el-input
          v-model="queryParams.csTimeStr"
          placeholder="请输入客服服务时间"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合作信息" prop="cooperateInfo">
        <el-input
          v-model="queryParams.cooperateInfo"
          placeholder="请输入合作信息"
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
          v-hasPermi="['billard:customerServiceConfig:add']"
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
          v-hasPermi="['billard:customerServiceConfig:edit']"
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
          v-hasPermi="['billard:customerServiceConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:customerServiceConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerServiceConfigList" @selection-change="handleSelectionChange">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="configId" />
      <el-table-column label="客服微信" align="center" prop="csWx" />
      <el-table-column label="会员id" align="center" prop="mbId" />
      <el-table-column label="联系方式" align="center" prop="csTelephone" />
      <el-table-column label="客服qq" align="center" prop="csQq" />
      <el-table-column label="客服邮箱" align="center" prop="csEmail" />
      <el-table-column label="客服服务时间" align="center" prop="csTimeStr" />
      <el-table-column label="合作信息" align="center" prop="cooperateInfo" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" fixed="right" width="130" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:customerServiceConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:customerServiceConfig:remove']"
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

    <!-- 添加或修改客服配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客服微信" prop="csWx">
          <el-input v-model="form.csWx" placeholder="请输入客服微信" />
        </el-form-item>
        <el-form-item label="会员id" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入会员id" />
        </el-form-item>
        <el-form-item label="联系方式" prop="csTelephone">
          <el-input v-model="form.csTelephone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="客服qq" prop="csQq">
          <el-input v-model="form.csQq" placeholder="请输入客服qq" />
        </el-form-item>
        <el-form-item label="客服邮箱" prop="csEmail">
          <el-input v-model="form.csEmail" placeholder="请输入客服邮箱" />
        </el-form-item>
        <el-form-item label="客服服务时间" prop="csTimeStr">
          <el-input v-model="form.csTimeStr" placeholder="请输入客服服务时间" />
        </el-form-item>
        <el-form-item label="合作信息" prop="cooperateInfo">
          <el-input v-model="form.cooperateInfo" placeholder="请输入合作信息" />
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
import { listCustomerServiceConfig, getCustomerServiceConfig, delCustomerServiceConfig, addCustomerServiceConfig, updateCustomerServiceConfig } from "@/api/billard/customerServiceConfig";

export default {
  name: "CustomerServiceConfig",
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
      // 客服配置表格数据
      customerServiceConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        csWx: null,
        mbId: null,
        csTelephone: null,
        csQq: null,
        csEmail: null,
        csTimeStr: null,
        cooperateInfo: null,
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
    /** 查询客服配置列表 */
    getList() {
      this.loading = true;
      listCustomerServiceConfig(this.queryParams).then(response => {
        this.customerServiceConfigList = response.rows;
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
        configId: null,
        csWx: null,
        mbId: null,
        csTelephone: null,
        csQq: null,
        csEmail: null,
        csTimeStr: null,
        cooperateInfo: null,
        remark: null,
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
      this.ids = selection.map(item => item.configId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客服配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const configId = row.configId || this.ids
      getCustomerServiceConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客服配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.configId != null) {
            updateCustomerServiceConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustomerServiceConfig(this.form).then(response => {
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
      const configIds = row.configId || this.ids;
      this.$modal.confirm('是否确认删除客服配置编号为"' + configIds + '"的数据项？').then(function() {
        return delCustomerServiceConfig(configIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/customerServiceConfig/export', {
        ...this.queryParams
      }, `customerServiceConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
