<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="商户平台编号" prop="mchid">
        <el-input
          v-model="queryParams.mchid"
          placeholder="请输入商户平台编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户订单号" prop="order">
        <el-input
          v-model="queryParams.order"
          placeholder="请输入商户订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="商品标题" prop="subject">
        <el-input
          v-model="queryParams.subject"
          placeholder="请输入商品标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品描述" prop="body">
        <el-input
          v-model="queryParams.body"
          placeholder="请输入商品描述"
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:baizhouPayNotify:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baizhouPayNotifyList" @selection-change="handleSelectionChange">
      <el-table-column label="主键ID" align="center" prop="notifyId" width="180" show-overflow-tooltip/>
      <el-table-column label="商户平台编号" align="center" prop="mchid" width="180" show-overflow-tooltip/>
      <el-table-column label="商户订单号" align="center" prop="order" width="180" show-overflow-tooltip/>
      <el-table-column label="商户下单金额" align="center" prop="money" width="120"/>
      <el-table-column label="实际支付金额" align="center" prop="finalMoney" width="120"/>
      <el-table-column label="通知时间" align="center" prop="time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成状态" align="center" prop="finishStatus" />
      <el-table-column label="商品标题" align="center" prop="subject" width="200" show-overflow-tooltip/>
      <el-table-column label="商品描述" align="center" prop="body" width="200" show-overflow-tooltip/>
      <el-table-column label="备注信息" align="center" prop="mark" />
      <el-table-column label="签名" align="center" prop="sign"show-overflow-tooltip/>

    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listBaizhouPayNotify, getBaizhouPayNotify, delBaizhouPayNotify, addBaizhouPayNotify, updateBaizhouPayNotify } from "@/api/billard/baizhouPayNotify";

export default {
  name: "BaizhouPayNotify",
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
      // 百舟支付异步通知表格数据
      baizhouPayNotifyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mchid: null,
        order: null,
        money: null,
        finalMoney: null,
        time: null,
        finishStatus: null,
        subject: null,
        body: null,
        mark: null,
        sign: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mchid: [
          { required: true, message: "商户平台编号不能为空", trigger: "blur" }
        ],
        order: [
          { required: true, message: "商户订单号不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "商户下单金额不能为空", trigger: "blur" }
        ],
        finalMoney: [
          { required: true, message: "实际支付金额不能为空", trigger: "blur" }
        ],
        time: [
          { required: true, message: "通知时间不能为空", trigger: "blur" }
        ],
        finishStatus: [
          { required: true, message: "完成状态不能为空", trigger: "change" }
        ],
        sign: [
          { required: true, message: "签名不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询百舟支付异步通知列表 */
    getList() {
      this.loading = true;
      listBaizhouPayNotify(this.queryParams).then(response => {
        this.baizhouPayNotifyList = response.rows;
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
        notifyId: null,
        mchid: null,
        order: null,
        money: null,
        finalMoney: null,
        time: null,
        finishStatus: null,
        subject: null,
        body: null,
        mark: null,
        sign: null,
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
      this.ids = selection.map(item => item.notifyId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加百舟支付异步通知";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const notifyId = row.notifyId || this.ids
      getBaizhouPayNotify(notifyId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改百舟支付异步通知";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.notifyId != null) {
            updateBaizhouPayNotify(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBaizhouPayNotify(this.form).then(response => {
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
      const notifyIds = row.notifyId || this.ids;
      this.$modal.confirm('是否确认删除百舟支付异步通知编号为"' + notifyIds + '"的数据项？').then(function() {
        return delBaizhouPayNotify(notifyIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/baizhouPayNotify/export', {
        ...this.queryParams
      }, `baizhouPayNotify_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
