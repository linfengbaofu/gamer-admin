<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="裁判名字" prop="refereeName">
        <el-input
          v-model="queryParams.refereeName"
          placeholder="请输入裁判名字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="证书编号" prop="certificateNo">
        <el-input
          v-model="queryParams.certificateNo"
          placeholder="请输入证书编号"
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
          v-hasPermi="['billard:referee:add']"
        >新增</el-button>
      </el-col>
      
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:referee:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="refereeList" @selection-change="handleSelectionChange">
      
      <el-table-column label="裁判ID" align="center" prop="refereeId" />
      <el-table-column label="头像地址" align="center" prop="avatar" >
        <template slot-scope="scope">
          <image-preview :src="scope.row.avatar" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="裁判名字" align="center" prop="refereeName" />
      <el-table-column label="裁判性别" align="center" prop="refereeSex" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_player_sex" :value="scope.row.refereeSex"/>
        </template>
      </el-table-column>
      <el-table-column label="裁判年龄" align="center" prop="refereeAge" />
      <el-table-column label="裁判等级" align="center" prop="refereeLevel" />
      <el-table-column label="证书编号" align="center" prop="certificateNo" />
      <el-table-column label="裁判状态" align="center" prop="refereeStatus" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="裁判信息" align="center" prop="refereeInfo" />
      <el-table-column label="操作" align="center" fixed="right" width="130" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:referee:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:referee:remove']"
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

    <!-- 添加或修改裁判信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="头像地址" prop="avatar">
          <image-upload v-model="form.avatar" :limit="1" placeholder="请输入头像地址" />
        </el-form-item>
        <el-form-item label="裁判名字" prop="refereeName">
          <el-input v-model="form.refereeName" placeholder="请输入裁判名字" />
        </el-form-item>
        <el-form-item label="裁判年龄" prop="refereeAge">
          <el-input v-model="form.refereeAge" placeholder="请输入裁判年龄" />
        </el-form-item>
        <el-form-item label="裁判性别" prop="refereeSex">
          <el-select v-model="form.refereeSex" placeholder="请选择裁判性别">
            <el-option v-for="item in dict.type.billard_player_sex" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="裁判等级" prop="refereeLevel">
          <el-input v-model="form.refereeLevel" placeholder="请输入裁判等级" />
        </el-form-item>
        <el-form-item label="证书编号" prop="certificateNo">
          <el-input v-model="form.certificateNo" placeholder="请输入证书编号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
    
        <el-form-item label="裁判信息" prop="refereeInfo">
          <el-input v-model="form.refereeInfo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReferee, getReferee, delReferee, addReferee, updateReferee } from "@/api/billard/referee";

export default {
  dicts: ['billard_player_sex'],
  name: "Referee",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 提交按钮加载中
      submitLoading: false,
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
      // 裁判信息表格数据
      refereeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        avatar: null,
        refereeName: null,
        refereeSex: null,
        refereeAge: null,
        refereeLevel: null,
        certificateNo: null,
        refereeStatus: null,
        refereeInfo: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        avatar: [
          { required: true, message: "头像地址不能为空", trigger: "blur" }
        ],
        refereeName: [
          { required: true, message: "裁判名字不能为空", trigger: "blur" }
        ],
        refereeSex: [ 
          { required: true, message: "裁判性别不能为空", trigger: "blur" }
        ],
        refereeAge: [
          { required: true, message: "裁判年龄不能为空", trigger: "blur" },
          { pattern: /^[1-9]\d*$/, message: "裁判年龄必须为正整数", trigger: "blur" }
        ],
        refereeLevel: [
          { required: true, message: "裁判等级不能为空", trigger: "blur" }
        ],
        certificateNo: [
          { required: true, message: "证书编号不能为空", trigger: "blur" }
        ],
        refereeStatus: [
          { required: true, message: "裁判状态不能为空", trigger: "blur" }
        ],
        refereeInfo: [
          { required: true, message: "裁判信息不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询裁判信息列表 */
    getList() {
      this.loading = true;
      listReferee(this.queryParams).then(response => {
        this.refereeList = response.rows;
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
        refereeId: null,
        avatar: null,
        refereeName: null,
        refereeSex: null,
        refereeAge: null,
        refereeLevel: null,
        certificateNo: null,
        refereeStatus: null,
        remark: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        refereeInfo: null
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
      this.ids = selection.map(item => item.refereeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加裁判信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const refereeId = row.refereeId || this.ids
      getReferee(refereeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改裁判信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.refereeId != null) {
            updateReferee(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addReferee(this.form).then(response => {
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
      const refereeIds = row.refereeId || this.ids;
      this.$modal.confirm('是否确认删除裁判信息编号为"' + refereeIds + '"的数据项？').then(function() {
        return delReferee(refereeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/referee/export', {
        ...this.queryParams
      }, `referee_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
