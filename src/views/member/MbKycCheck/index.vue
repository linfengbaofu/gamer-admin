<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="用户id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="国家/地区" prop="country">
        <el-input
          v-model="queryParams.country"
          placeholder="请输入国家/地区"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input
          v-model="queryParams.idNumber"
          placeholder="请输入身份证号"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['member:MbKycCheck:add']"
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
          v-hasPermi="['member:MbKycCheck:edit']"
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
          v-hasPermi="['member:MbKycCheck:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:MbKycCheck:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="MbKycCheckList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center"  /> -->
      <el-table-column label="id" align="center" width="150" :fixed="true" prop="id" />
      <el-table-column label="用户id" align="center" prop="mbId" width="150"  />
      <el-table-column label="用户账号" align="center" prop="mbAccount" width="150" />
      <el-table-column label="名字" align="center" prop="name" />
      <el-table-column label="国家/地区" align="center" prop="country" />
      <el-table-column label="身份证号" align="center" prop="idNumber" />
      <el-table-column label="身份证类型" align="center" prop="idType" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.id_type" :value="scope.row.idType"/>
        </template>
      </el-table-column>
      <el-table-column label="身份证照片1" align="center" prop="idImage1" width="100">
        <template slot-scope="scope">
          <el-image v-if="scope.row.idImage1" :src="scope.row.idImage1" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="身份证照片2" align="center" prop="idImage2" width="100">
        <template slot-scope="scope">
          <el-image v-if="scope.row.idImage2" :src="scope.row.idImage2" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.kyc_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150" />
      <el-table-column label="操作" fixed="right" width="120" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:MbKycCheck:edit']"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleCheck(scope.row)"
            v-hasPermi="['member:MbKycCheck:edit']"
            v-if="scope.row.status === '0'"
          >审核</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:MbKycCheck:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改KYC认证对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户id" prop="mbId">
          <el-input :disabled="form.id" v-model="form.mbId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input :disabled="form.id" v-model="form.mbAccount" placeholder="请输入用户账号" />
        </el-form-item>

        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="身份证类型" prop="idType">
          <el-select v-model="form.idType" placeholder="请选择身份证类型">
            <el-option v-for="item in dict.type.id_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="item in dict.type.kyc_status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家/地区" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家/地区" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="form.idNumber" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="身份证照片1" prop="idImage1">
          <image-upload v-model="form.idImage1" :limit="1" />
        </el-form-item>
        <el-form-item label="身份证照片2" prop="idImage2">
          <image-upload v-model="form.idImage2" :limit="1" />
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

    <!-- 审核KYC认证对话框 -->
    <el-dialog title="审核KYC认证" :visible.sync="checkOpen" width="500px" append-to-body>
      <el-form ref="checkForm" :model="checkForm" :rules="checkRules" label-width="100px">
        <el-form-item label="用户id" prop="mbId">
          <el-input v-model="checkForm.mbId" disabled />
        </el-form-item>
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input v-model="checkForm.mbAccount" disabled />
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="checkForm.name" disabled />
        </el-form-item>
        <el-form-item label="身份证类型" prop="idType">
          <dict-tag :options="dict.type.id_type" :value="checkForm.idType"/>
        </el-form-item>
        <el-form-item label="国家/地区" prop="country">
          <el-input v-model="checkForm.country" disabled />
        </el-form-item>
        
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="checkForm.idNumber" disabled />
        </el-form-item>
        <el-form-item label="身份证照片1" prop="idImage1">
          <el-image v-if="checkForm.idImage1" :src="checkForm.idImage1" style="width: 100px; height: 60px;" />
        </el-form-item>
        <el-form-item label="身份证照片2" prop="idImage2">
          <el-image v-if="checkForm.idImage2" :src="checkForm.idImage2" style="width: 100px; height: 60px;" />
        </el-form-item>
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="checkForm.status">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">审核拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注" prop="remark">
          <el-input v-model="checkForm.remark" type="textarea" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCheckForm">确 定</el-button>
        <el-button @click="cancelCheck">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看KYC认证详情对话框 -->
    <el-dialog title="KYC认证详情" :visible.sync="viewOpen" width="600px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ viewForm.mbId }}</el-descriptions-item>
        <el-descriptions-item label="用户账号">{{ viewForm.mbAccount }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ viewForm.name }}</el-descriptions-item>
        <el-descriptions-item label="国家/地区">{{ viewForm.country }}</el-descriptions-item>
        <el-descriptions-item label="身份证类型">
          <dict-tag :options="dict.type.id_type" :value="viewForm.idType"/>
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ viewForm.idNumber }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <dict-tag :options="dict.type.kyc_status" :value="viewForm.status"/>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewForm.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ viewForm.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ viewForm.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      
      <div style="margin-top: 20px;">
        <h4>身份证照片</h4>
        <div style="display: flex; gap: 20px;">
          <div v-if="viewForm.idImage1">
            <p>身份证正面照片：</p>
            <el-image 
              :src="viewForm.idImage1" 
              style="width: 200px; height: 120px; border: 1px solid #ddd;"
              :preview-src-list="[viewForm.idImage1]"
            />
          </div>
          <div v-if="viewForm.idImage2">
            <p>身份证反面照片：</p>
            <el-image 
              :src="viewForm.idImage2" 
              style="width: 200px; height: 120px; border: 1px solid #ddd;"
              :preview-src-list="[viewForm.idImage2]"
            />
          </div>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMbKycCheck, getMbKycCheck, delMbKycCheck, addMbKycCheck, updateMbKycCheck, checkMbKycCheck } from "@/api/member/MbKycCheck";

export default {
  dicts: ['id_type','kyc_status'],
  name: "MbKycCheck",
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
      // KYC认证表格数据
      MbKycCheckList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 审核弹出层标题
      checkTitle: "",
      // 是否显示审核弹出层
      checkOpen: false,
      // 查看详情弹出层
      viewOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        mbAccount: null,
        name: null,
        country: null,
        idNumber: null,
        idType: null,
        idImage1: null,
        idImage2: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mbId: [{ required: true, message: "请输入用户id", trigger: "blur" }],
        mbAccount: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入名字", trigger: "blur" }],
        country: [{ required: true, message: "请输入国家/地区", trigger: "blur" }],
        idNumber: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
        idType: [{ required: true, message: "请选择身份证类型", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        idImage1: [{ required: true, message: "请上传身份证照片1", trigger: "change" }],
        idImage2: [{ required: true, message: "请上传身份证照片2", trigger: "change" }]
      },
      // 审核表单参数
      checkForm: {
        id: null,
        mbId: null,
        mbAccount: null,
        name: null,
        idNumber: null,
        idImage1: null,
        idImage2: null,
        status: null,
        remark: null
      },
      // 审核表单校验
      checkRules: {
        status: [{ required: true, message: "请选择审核结果", trigger: "change" }],
      },
      // 详情数据
      viewForm: {
        id: null,
        mbId: null,
        mbAccount: null,
        name: null,
        country: null,
        idNumber: null,
        idType: null,
        idImage1: null,
        idImage2: null,
        status: null,
        createTime: null,
        updateTime: null,
        remark: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询KYC认证列表 */
    getList() {
      this.loading = true;
      listMbKycCheck(this.queryParams).then(response => {
        this.MbKycCheckList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消审核按钮
    cancelCheck() {
      this.checkOpen = false;
      this.resetCheckForm();
    },
    // 取消详情按钮
    cancelView() {
      this.viewOpen = false;
      this.viewForm = {};
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        mbId: null,
        mbAccount: null,
        name: null,
        country: null,
        idNumber: null,
        idType: null,
        idImage1: null,
        idImage2: null,
        status: null,
        createTime: null,
        updateTime: null,
        updateBy: null,
        remark: null
      };
      this.resetForm("form");
    },
    // 审核表单重置
    resetCheckForm() {
      this.checkForm = {
        id: null,
        mbId: null,
        mbAccount: null,
        name: null,
        idNumber: null,
        idImage1: null,
        idImage2: null,
        status: null,
        remark: null
      };
      this.resetForm("checkForm");
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加KYC认证";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMbKycCheck(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改KYC认证";
      });
    },
    /** 审核按钮操作 */
    handleCheck(row) {
      this.resetCheckForm();
      this.checkForm = row;
      this.checkOpen = true;
      this.checkTitle = "审核KYC认证";
    },
    /** 查看详情按钮操作 */
    handleView(row) {
      this.viewForm = row;
      this.viewOpen = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMbKycCheck(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMbKycCheck(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交审核表单 */
    submitCheckForm() {
      this.$refs["checkForm"].validate(valid => {
        if (valid) {
          checkMbKycCheck({
            id: this.checkForm.id,
            status: this.checkForm.status,
            remark: this.checkForm.remark
          }).then(response => {
            this.$modal.msgSuccess("审核成功");
            this.checkOpen = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除KYC认证编号为"' + ids + '"的数据项？').then(function() {
        return delMbKycCheck(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/MbKycCheck/export', {
        ...this.queryParams
      }, `MbKycCheck_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
