<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      
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
          v-hasPermi="['member:signConfig:add']"
        >新增</el-button>
      </el-col>
      
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:signConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="signConfigList" @selection-change="handleSelectionChange">
      <el-table-column label="配置ID" align="center" prop="configId" width="150" :fixed="true" show-overflow-tooltip/>
      <el-table-column label="连续签到天数" align="center" prop="streakDays" show-overflow-tooltip/>
      <el-table-column label="奖励积分" align="center" prop="rewardPoints" show-overflow-tooltip/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" fixed="right" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:signConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:signConfig:remove']"
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

    <!-- 添加或修改签到配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="连续签到天数" prop="streakDays">
          <el-input 
            type="number" 
            v-model="form.streakDays" 
            placeholder="请输入连续签到天数" 
            :min="1"
          />
        </el-form-item>
        <el-form-item label="奖励积分" prop="rewardPoints">
          <el-input 
            type="number" 
            v-model="form.rewardPoints" 
            placeholder="请输入奖励积分" 
            :min="0.01"
            step="0.01"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input 
            type="number" 
            v-model="form.sortOrder" 
            placeholder="请输入排序" 
            :min="1"
          />
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
import { listSignConfig, getSignConfig, delSignConfig, addSignConfig, updateSignConfig } from "@/api/member/signConfig";

export default {
  name: "SignConfig",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 提交按钮加载状态
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
      // 签到配置表格数据
      signConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        streakDays: null,
        rewardPoints: null,
        sortOrder: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        streakDays: [
          { required: true, message: "连续签到天数不能为空", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('连续签到天数不能为空'));
              } else {
                const num = parseInt(value);
                if (isNaN(num) || num < 1 || num % 1 !== 0) {
                  callback(new Error('连续签到天数必须为正整数'));
                } else {
                  callback();
                }
              }
            }, 
            trigger: "blur" 
          }
        ],
        rewardPoints: [
          { required: true, message: "奖励积分不能为空", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('奖励积分不能为空'));
              } else {
                const num = parseFloat(value);
                if (isNaN(num) || num <= 0) {
                  callback(new Error('奖励积分必须为正数'));
                } else {
                  callback();
                }
              }
            }, 
            trigger: "blur" 
          }
        ],
        sortOrder: [
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
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询签到配置列表 */
    getList() {
      this.loading = true;
      listSignConfig(this.queryParams).then(response => {
        this.signConfigList = response.rows;
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
        streakDays: null,
        rewardPoints: null,
        createBy: null,
        createTime: null,
        sortOrder: null
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
      this.title = "添加签到配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = {...row};
        this.open = true;
        this.title = "修改签到配置";
      // this.reset();
      // const configId = row.configId || this.ids
      // getSignConfig(configId).then(response => {
      //   this.form = {...row};
      //   this.open = true;
      //   this.title = "修改签到配置";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.configId != null) {
            updateSignConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 处理错误情况
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addSignConfig(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 处理错误情况
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const configIds = row.configId || this.ids;
      this.$modal.confirm('是否确认删除签到配置编号为"' + configIds + '"的数据项？').then(function() {
        return delSignConfig(configIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/signConfig/export', {
        ...this.queryParams
      }, `signConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
