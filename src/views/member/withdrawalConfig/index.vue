<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="申请人ID" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入申请人ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付宝号" prop="alipayNo">
        <el-input
          v-model="queryParams.alipayNo"
          placeholder="请输入支付宝号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信号码" prop="wechatNo">
        <el-input
          v-model="queryParams.wechatNo"
          placeholder="请输入微信号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="USDT地址" prop="usdtAddr">
        <el-input
          v-model="queryParams.usdtAddr"
          placeholder="请输入USDT钱包地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankNo">
        <el-input
          v-model="queryParams.bankNo"
          placeholder="请输入银行卡号"
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
          v-hasPermi="['member:withdrawalConfig:add']"
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
          v-hasPermi="['member:withdrawalConfig:edit']"
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
          v-hasPermi="['member:withdrawalConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:withdrawalConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="withdrawalConfigList" @selection-change="handleSelectionChange">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="configId" width="150"/>
      <el-table-column label="申请人ID" align="center" prop="mbId" width="150"/>
      <el-table-column label="申请人账号" align="center" prop="mbAccount" width="150"/>
      <el-table-column label="支付宝名称" align="center" prop="alipayName" width="150"/>
      <el-table-column label="支付宝号" align="center" prop="alipayNo" />
      <el-table-column label="支付宝邮箱" align="center" prop="alipayEmail" width="150"/>
      <el-table-column label="支付宝图片地址" align="center" prop="alipayImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.alipayImgUrl" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="微信号码" align="center" prop="wechatNo" />
      <el-table-column label="微信图片地址" align="center" prop="wechatImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.wechatImgUrl" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="微信邮箱" align="center" prop="wechatEmail" />
      <el-table-column label="usdt主网络" align="center" prop="usdtType" width="150">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.usdt_type" :value="scope.row.usdtType" />
        </template>
      </el-table-column>
      <el-table-column label="usdt钱包地址" align="center" prop="usdtAddr" width="150"/>
      <el-table-column label="usdt图片地址" align="center" prop="usdtImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.usdtImgUrl" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="usdt邮箱" align="center" prop="usdtEmail" width="150"/>
      <el-table-column label="银行名称" align="center" prop="bankName" width="150"/>
      <el-table-column label="银行开户人" align="center" prop="bankUserName" width="150"/>
      <el-table-column label="银行卡号" align="center" prop="bankNo" width="150"/>
      <el-table-column label="银行邮箱" align="center" prop="bankEmail" width="150"/>
      <el-table-column label="操作" align="center" fixed="right" width="130" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:withdrawalConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:withdrawalConfig:remove']"
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

    <!-- 添加或修改会员提现配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人ID" prop="mbId">
              <el-input v-model="form.mbId" placeholder="请输入申请人ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付宝名称" prop="alipayName">
              <el-input v-model="form.alipayName" placeholder="请输入支付宝名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付宝号" prop="alipayNo">
              <el-input v-model="form.alipayNo" placeholder="请输入支付宝号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付宝邮箱" prop="alipayEmail">
              <el-input v-model="form.alipayEmail" placeholder="请输入支付宝邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付宝图片" prop="alipayImgUrl">
              <el-image :src="form.alipayImgUrl" style="width: 50px; height: 50px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信号码" prop="wechatNo">
              <el-input v-model="form.wechatNo" placeholder="请输入微信号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信图片" prop="wechatImgUrl">
              <el-image :src="form.wechatImgUrl" style="width: 50px; height: 50px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信邮箱" prop="wechatEmail">
              <el-input v-model="form.wechatEmail" placeholder="请输入微信邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="USDT网络" prop="usdtType">
              <el-select v-model="form.usdtType" placeholder="请选择USDT网络">
                <el-option v-for="item in dict.type.usdt_type" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="USDT地址" prop="usdtAddr">
              <el-input v-model="form.usdtAddr" placeholder="请输入USDT钱包地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="USDT图片" prop="usdtImgUrl">
              <el-image :src="form.usdtImgUrl" style="width: 50px; height: 50px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="USDT邮箱" prop="usdtEmail">
              <el-input v-model="form.usdtEmail" placeholder="请输入USDT邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行名称" prop="bankName">
              <el-input v-model="form.bankName" placeholder="请输入银行名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行开户人" prop="bankUserName">
              <el-input v-model="form.bankUserName" placeholder="请输入银行开户人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行卡号" prop="bankNo">
              <el-input v-model="form.bankNo" placeholder="请输入银行卡号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行邮箱" prop="bankEmail">
              <el-input v-model="form.bankEmail" placeholder="请输入银行邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWithdrawalConfig, getWithdrawalConfig, delWithdrawalConfig, addWithdrawalConfig, updateWithdrawalConfig } from "@/api/member/withdrawalConfig";

export default {
  dicts: ['usdt_type'],
  name: "WithdrawalConfig",
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
      // 会员提现配置表格数据
      withdrawalConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        alipayNo: null,
        wechatNo: null,
        usdtAddr: null,
        bankNo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mbId: [
          { required: true, message: "申请人ID不能为空", trigger: "blur" }
        ],
        alipayImgUrl: [
          { required: true, message: "支付宝图片地址不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询会员提现配置列表 */
    getList() {
      this.loading = true;
      listWithdrawalConfig(this.queryParams).then(response => {
        this.withdrawalConfigList = response.rows;
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
        mbId: null,
        alipayName: null,
        alipayNo: null,
        alipayEmail: null,
        alipayImgUrl: null,
        wechatNo: null,
        wechatImgUrl: null,
        wechatEmail: null,
        usdtType: null,
        usdtAddr: null,
        usdtImgUrl: null,
        usdtEmail: null,
        bankName: null,
        bankUserName: null,
        bankNo: null,
        bankEmail: null,
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
      this.ids = selection.map(item => item.configId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加会员提现配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const configId = row.configId || this.ids
      getWithdrawalConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改会员提现配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.configId != null) {
            updateWithdrawalConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWithdrawalConfig(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除会员提现配置编号为"' + configIds + '"的数据项？').then(function() {
        return delWithdrawalConfig(configIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/withdrawalConfig/export', {
        ...this.queryParams
      }, `withdrawalConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
