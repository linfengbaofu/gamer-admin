<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入用户账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="钱包名称" prop="walletName">
        <el-input
          v-model="queryParams.walletName"
          placeholder="请输入钱包名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种" prop="coin">
        <el-select v-model="queryParams.coin" placeholder="请选择币种">
          <el-option v-for="item in dict.type.record_coin_type" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="钱包地址" prop="addr">
        <el-input
          v-model="queryParams.addr"
          placeholder="请输入钱包地址"
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
          v-hasPermi="['member:MbWithdrawalConfig:add']"
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
          v-hasPermi="['member:MbWithdrawalConfig:edit']"
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
          v-hasPermi="['member:MbWithdrawalConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:MbWithdrawalConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="MbWithdrawalConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户id" align="center" prop="mbId" />
      <el-table-column label="用户账号" align="center" prop="mbAccount" />
      <el-table-column label="钱包名称" align="center" prop="walletName" />
      <el-table-column label="币种" align="center" prop="coin" width="150">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.record_coin_type" :value="scope.row.coin" />
        </template>
      </el-table-column>
      <el-table-column label="链" align="center" prop="chainType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.chain_type" :value="scope.row.chainType" />
        </template>
      </el-table-column>
      <el-table-column label="钱包地址" align="center" prop="addr" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:MbWithdrawalConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:MbWithdrawalConfig:remove']"
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

    <!-- 添加或修改用户提现配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="用户" prop="mbId">
          <member-info-select style="width: 100%" v-model="form.mbId" placeholder="请选择用户" @change="handleMemberChange" />
        </el-form-item>
        <el-form-item label="钱包名称" prop="walletName">
          <el-input style="width: 100%" v-model="form.walletName" placeholder="请输入钱包名称" />
        </el-form-item>
        <el-form-item label="币种" prop="coin">
          <el-select style="width: 100%" v-model="form.coin" placeholder="请选择币种">
            <el-option v-for="item in dict.type.record_coin_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="链" prop="chainType">
          <el-select style="width: 100%" v-model="form.chainType" placeholder="请选择链">
            <el-option v-for="item in dict.type.chain_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="钱包地址" prop="addr">
          <el-input style="width: 100%" v-model="form.addr" placeholder="请输入钱包地址" />
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
import { listMbWithdrawalConfig, getMbWithdrawalConfig, delMbWithdrawalConfig, addMbWithdrawalConfig, updateMbWithdrawalConfig } from "@/api/member/MbWithdrawalConfig";
import MemberInfoSelect from "@/components/MemberInfoSelect";
export default {
  dicts: ['chain_type', 'record_coin_type'],
  name: "MbWithdrawalConfig",
  components: {
    MemberInfoSelect
  },
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
      // 用户提现配置表格数据
      MbWithdrawalConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbAccount: null,
        walletName: null,
        coin: null,
        chainType: null,
        addr: null
      },
      // 表单参数
      form: {
        mbId: null,
        mbAccount: null,
        createTime: null,
        updateTime: null,
        walletName: null,
        coin: null,
        chainType: null,
        addr: null
      },
      // 表单校验
      rules: {
        mbId: [
          { required: true, message: "用户不能为空", trigger: "blur" }
        ],
        walletName: [
          { required: true, message: "钱包名称不能为空", trigger: "blur" }
        ],
        coin: [ 
          { required: true, message: "币种不能为空", trigger: "blur" }
        ],
        chainType: [
          { required: true, message: "链不能为空", trigger: "blur" }
        ],
        addr: [ 
          { required: true, message: "钱包地址不能为空", trigger: "blur" }
        ]
      },
      // 提交loading状态
      submitLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户提现配置列表 */
    getList() {
      this.loading = true;
      listMbWithdrawalConfig(this.queryParams).then(response => {
        this.MbWithdrawalConfigList = response.rows;
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
        mbId: null,
        mbAccount: null,
        createTime: null,
        updateTime: null,
        walletName: null,
        coin: null,
        chainType: null,
        addr: null
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
      this.ids = selection.map(item => item.mbId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户提现配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const mbId = row.mbId || this.ids
      getMbWithdrawalConfig(mbId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户提现配置";
      });
    },

    handleMemberChange(data) {
      if (data.selectedItems) {
        this.form.mbAccount = data.selectedItems.mbAccount
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.id) {
            updateMbWithdrawalConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addMbWithdrawalConfig(this.form).then(response => {
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
      const mbIds = row.mbId || this.ids;
      this.$modal.confirm('是否确认删除用户提现配置编号为"' + mbIds + '"的数据项？').then(function() {
        return delMbWithdrawalConfig(mbIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/MbWithdrawalConfig/export', {
        ...this.queryParams
      }, `MbWithdrawalConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
