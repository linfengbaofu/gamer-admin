<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="币种" prop="rechargeCoin">
        <el-select v-model="queryParams.rechargeCoin" placeholder="请选择币种">
            <el-option v-for="item in dict.type.coin_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否开启" prop="isOpen">
        <el-select v-model="queryParams.isOpen" placeholder="请选择是否开启">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>  
        </el-select>
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
          v-hasPermi="['member:RechargeFirstConfig:add']"
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
          v-hasPermi="['member:RechargeFirstConfig:edit']"
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
          v-hasPermi="['member:RechargeFirstConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:RechargeFirstConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="RechargeFirstConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="存款金额" align="center" prop="rechargeMoney" />
      <el-table-column label="币种" align="center" prop="rechargeCoin" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.coin_type" :value="scope.row.rechargeCoin"/>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.discount_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="奖励" align="center" prop="income" />
      <el-table-column label="是否开启" align="center" prop="isOpen" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isOpen"
            :disabled="true"
            active-value="1"
            inactive-value="0"
            @change="handleIsOpenChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:RechargeFirstConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:RechargeFirstConfig:remove']"
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

    <!-- 添加或修改首充奖励配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="存款金额" prop="rechargeMoney">
          <el-input v-model="form.rechargeMoney" placeholder="请输入存款金额" />
        </el-form-item>
        <el-form-item label="币种" prop="rechargeCoin">
          <el-select v-model="form.rechargeCoin" placeholder="请选择币种">
            <el-option v-for="item in dict.type.coin_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖励" prop="income">
          <el-input v-model="form.income" placeholder="请输入奖励" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option v-for="item in dict.type.discount_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启" prop="isOpen">
          <el-select v-model="form.isOpen" placeholder="请选择是否开启">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>  
          </el-select>
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
import { listRechargeFirstConfig, getRechargeFirstConfig, delRechargeFirstConfig, addRechargeFirstConfig, updateRechargeFirstConfig } from "@/api/member/RechargeFirstConfig";

export default {
  dicts: ['coin_type','discount_type'],
  name: "RechargeFirstConfig",
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
      // 首充奖励配置表格数据
      RechargeFirstConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        rechargeMoney: null,
        rechargeCoin: null,
        type: null,
        income: null,
        isOpen: null,
      },
      // 表单参数
      form: {
        isOpen: '1'
      },
      // 表单校验
      rules: {
        isOpen: [{ required: true, message: "请选择是否开启", trigger: "change" }],
        income: [{ required: true, message: "请输入奖励", trigger: "blur" }],
        rechargeMoney: [{ required: true, message: "请输入存款金额", trigger: "blur" }],
        rechargeCoin: [{ required: true, message: "请选择币种", trigger: "change" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询首充奖励配置列表 */
    getList() {
      this.loading = true;
      listRechargeFirstConfig(this.queryParams).then(response => {
        this.RechargeFirstConfigList = response.rows;
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
        id: null,
        rechargeMoney: null,
        rechargeCoin: null,
        type: null,
        income: null,
        isOpen: '1',
        createTime: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加首充奖励配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      this.loading = true;
      getRechargeFirstConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改首充奖励配置";
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.form.id != null) {
            updateRechargeFirstConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.loading = false;
            }).catch(() => {
              this.loading = false;
            });
          } else {
            addRechargeFirstConfig(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.loading = false;
            }).catch(() => {
              this.loading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除首充奖励配置编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delRechargeFirstConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/RechargeFirstConfig/export', {
        ...this.queryParams
      }, `RechargeFirstConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
