<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="申请人ID" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入申请人id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人账号" prop="mbAccount"> 
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入申请人账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品ID" prop="pdId">
        <el-input
          v-model="queryParams.pdId"
          placeholder="请输入商品ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="pdName">
        <el-input
          v-model="queryParams.pdName"
          placeholder="请输入商品名称"
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
          v-hasPermi="['member:pointsPdRecord:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:pointsPdRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pointsPdRecordList" @selection-change="handleSelectionChange">
      <el-table-column label="记录ID" align="center" prop="recordId" width="150" :fixed="true"/>
      <el-table-column label="申请人ID" align="center" prop="mbId" width="150"/>
      <el-table-column label="申请人账号" align="center" prop="mbAccount" width="150"/>
      <el-table-column label="商品ID" align="center" prop="pdId" width="150"/>
      <el-table-column label="商品名称" align="center" prop="pdName" />
      <el-table-column label="需要积分" align="center" prop="needPoints" />
      <!-- <el-table-column label="商品排序" align="center" prop="pdSort" /> -->
      <el-table-column label="审核状态" align="center" prop="recordStatus" >
        <!-- (0-已提交;1-审核通过;2-审核失败) -->
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_points_pd_record_record_status" :value="scope.row.recordStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="商品图片地址" align="center" prop="pdImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.pdImgUrl" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>

      <el-table-column label="审批人" align="center" prop="auditBy" />
      <el-table-column label="审批时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sorted" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.recordStatus == 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAudit(scope.row)"
            v-hasPermi="['member:pointsPdRecord:edit']"
          >审批</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:pointsPdRecord:remove']"
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

    <!-- 添加或修改积分商品记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="商品名称" prop="pdName">
          <el-input v-model="form.pdName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="需要积分" prop="needPoints">
          <el-input 
            type="number" 
            v-model="form.needPoints" 
            placeholder="请输入需要积分" 
            :min="0.01"
            step="0.01"
          />
        </el-form-item>
        <el-form-item label="商品排序" prop="pdSort">
          <el-input 
            type="number" 
            v-model="form.pdSort" 
            placeholder="请输入商品排序" 
            :min="1"
          />
        </el-form-item>
        <el-form-item label="商品图片地址" prop="pdImgUrl">
          <image-upload v-model="form.pdImgUrl" :limit="1" placeholder="请输入商品图片地址" />
        </el-form-item>
        
        <el-form-item label="排序" prop="sorted">
          <el-input 
            type="number" 
            v-model="form.sorted" 
            placeholder="请输入排序" 
            :min="1"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog title="审核积分商品记录" :visible.sync="auditOpen" width="400px" append-to-body>
      <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="auditForm.recordId" disabled />
        </el-form-item>
        <el-form-item label="审核状态" prop="recordStatus">
          <el-select v-model="auditForm.recordStatus" placeholder="请选择审核状态" style="width: 100%">
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核失败" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit" :loading="auditLoading">确 定</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPointsPdRecord, getPointsPdRecord, delPointsPdRecord, addPointsPdRecord, updatePointsPdRecord, auditPointsPdRecord } from "@/api/member/pointsPdRecord";

export default {
  dicts: ['billard_points_pd_record_record_status'],
  name: "PointsPdRecord",
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
      // 积分商品记录表格数据
      pointsPdRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        pdId: null,
        pdName: null,
        needPoints: null,
        pdSort: null,
        recordStatus: null,
        pdImgUrl: null,
        auditBy: null,
        auditTime: null,
        sorted: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pdName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        needPoints: [
          { required: true, message: "需要积分不能为空", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('需要积分不能为空'));
              } else {
                const num = parseFloat(value);
                if (isNaN(num) || num <= 0) {
                  callback(new Error('需要积分必须为正数'));
                } else {
                  // Check decimal places
                  const numStr = value.toString();
                  const decimalIndex = numStr.indexOf('.');
                  if (decimalIndex !== -1 && numStr.length - decimalIndex - 1 > 2) {
                    callback(new Error('积分最多保留2位小数'));
                  } else {
                    callback();
                  }
                }
              }
            }, 
            trigger: "blur" 
          }
        ],
        pdSort: [ 
          { required: true, message: "商品排序不能为空", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('商品排序不能为空'));
              } else {
                const num = parseInt(value);
                if (isNaN(num) || num < 1 || num % 1 !== 0) {
                  callback(new Error('商品排序必须为正整数'));
                } else {
                  callback();
                }
              }
            }, 
            trigger: "blur" 
          }
        ],
        pdImgUrl: [
          { required: true, message: "商品图片地址不能为空", trigger: "blur" }
        ],
        sorted: [
          { required: true, message: "排序不能为空", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('排序不能为空'));
              } else {
                const num = parseInt(value);
                if (isNaN(num) || num < 1 || num % 1 !== 0) {
                  callback(new Error('排序必须为正整数'));
                } else {
                  callback();
                }
              }
            }, 
            trigger: "blur" 
          }
        ]
      },
      // 提交表单时的loading状态
      submitLoading: false,
      // 审核对话框的显示状态
      auditOpen: false,
      // 审核表单参数
      auditForm: {},
      // 审核表单校验
      auditRules: {
        recordStatus: [
          { required: true, message: "审核状态不能为空", trigger: "blur" }
        ]
      },
      // 审核表单提交时的loading状态
      auditLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询积分商品记录列表 */
    getList() {
      this.loading = true;
      listPointsPdRecord(this.queryParams).then(response => {
        this.pointsPdRecordList = response.rows;
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
        recordId: null,
        mbId: null,
        pdId: null,
        pdName: null,
        needPoints: null,
        pdSort: null,
        recordStatus: null,
        pdImgUrl: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        auditBy: null,
        auditTime: null,
        sorted: null
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
      this.ids = selection.map(item => item.recordId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加积分商品记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改积分商品记录";
    },
    /** 审核按钮操作 */
    handleAudit(row) {
      this.resetAuditForm();
      this.auditForm.recordId = row.recordId;
      this.auditOpen = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.recordId != null) {
            updatePointsPdRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addPointsPdRecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除积分商品记录编号为"' + recordIds + '"的数据项？').then(function() {
        return delPointsPdRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/pointsPdRecord/export', {
        ...this.queryParams
      }, `pointsPdRecord_${new Date().getTime()}.xlsx`)
    },
    // 审核对话框的取消按钮
    cancelAudit() {
      this.auditOpen = false;
      this.resetAuditForm();
    },
    // 审核表单重置
    resetAuditForm() {
      this.auditForm = {
        recordId: null,
        recordStatus: null
      };
      this.resetForm("auditForm");
    },
    // 提交审核
    submitAudit() {
      this.$refs["auditForm"].validate(valid => {
        if (valid) {
          this.auditLoading = true;
          auditPointsPdRecord(this.auditForm).then(response => {
            this.$modal.msgSuccess("审核成功");
            this.auditOpen = false;
            this.getList();
          }).finally(() => {
            this.auditLoading = false;
          });
        }
      });
    }
  }
};
</script>
