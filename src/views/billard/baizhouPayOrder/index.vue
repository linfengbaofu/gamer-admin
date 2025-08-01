<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="接口命令" prop="method">
        <el-input
          v-model="queryParams.method"
          placeholder="请输入接口命令"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户编号" prop="mchid">
        <el-input
          v-model="queryParams.mchid"
          placeholder="请输入商户编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接口版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入接口版本"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="产品编码" prop="product">
        <el-input
          v-model="queryParams.product"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户订单号" prop="reqOrder">
        <el-input
          v-model="queryParams.reqOrder"
          placeholder="请输入商户订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="客户端IP" prop="clientIp">
        <el-input
          v-model="queryParams.clientIp"
          placeholder="请输入客户端IP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入真实姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="会员UID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入会员UID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品标题" prop="pdSubject">
        <el-input
          v-model="queryParams.pdSubject"
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
      <el-form-item label="平台订单号" prop="platformOrder">
        <el-input
          v-model="queryParams.platformOrder"
          placeholder="请输入平台订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
  
      <el-form-item label="响应码" prop="payCode">
        <el-input
          v-model="queryParams.payCode"
          placeholder="请输入响应码"
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
          v-hasPermi="['billard:baizhouPayOrder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baizhouPayOrderList" @selection-change="handleSelectionChange">
      <el-table-column label="主键ID" align="center" prop="payReqId" width="200" show-overflow-tooltip fixed/>
      <el-table-column label="接口命令" align="center" prop="method" />
      <el-table-column label="商户编号" align="center" prop="mchid" />
      <el-table-column label="接口版本" align="center" prop="version" />
      <el-table-column label="请求时间戳" align="center" prop="payTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签名类型" align="center" prop="signType" />
      <el-table-column label="签名内容" align="center" prop="sign" width="200" show-overflow-tooltip/>
      <el-table-column label="产品编码" align="center" prop="product" />
      <el-table-column label="商户订单号" align="center" prop="reqOrder" width="200" show-overflow-tooltip/>
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="回调地址" align="center" prop="notifyUrl" width="200" show-overflow-tooltip />
      <el-table-column label="客户端IP" align="center" prop="clientIp" width="200" show-overflow-tooltip/>
      <el-table-column label="真实姓名" align="center" prop="account" />
      <el-table-column label="会员UID" align="center" prop="uid" width="200" show-overflow-tooltip/>
      <el-table-column label="商品标题" align="center" prop="pdSubject" width="200" show-overflow-tooltip/>
      <el-table-column label="商品描述" align="center" prop="body" width="200" show-overflow-tooltip/>
      <el-table-column label="平台订单号" align="center" prop="platformOrder" width="200" show-overflow-tooltip/>
      <el-table-column label="支付地址" align="center" prop="payUrl" width="200" show-overflow-tooltip/>
      <el-table-column label="实际支付金额" align="center" prop="finalMoney" />
      <el-table-column label="响应码" align="center" prop="payCode" />
      <el-table-column label="消息" align="center" prop="msg" />
       <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleNotify(scope.row)"
          >异步通知</el-button>
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

    <!-- 异步通知弹窗 -->
    <el-dialog title="异步通知" :visible.sync="notifyOpen" width="600px" append-to-body>
      <el-form ref="notifyForm" :model="notifyForm" :rules="notifyRules" label-width="120px">
        <el-form-item label="商户编号" prop="mchid">
          <el-input v-model="notifyForm.mchid" placeholder="请输入商户编号" />
        </el-form-item>
        <el-form-item label="订单号" prop="order">
          <el-input v-model="notifyForm.order" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input-number v-model="notifyForm.money" :precision="2" :step="0.01" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="实际支付金额" prop="final_money">
          <el-input-number v-model="notifyForm.final_money" :precision="2" :step="0.01" placeholder="请输入实际支付金额" />
        </el-form-item>
        <el-form-item label="时间戳" prop="time">
          <el-input v-model="notifyForm.time" placeholder="请输入时间戳" />
        </el-form-item>
        <el-form-item label="完成状态" prop="finish_status">
          <el-select v-model="notifyForm.finish_status" placeholder="请选择完成状态">
            <el-option label="未完成" :value="0"></el-option>
            <el-option label="已完成" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品标题" prop="subject">
          <el-input v-model="notifyForm.subject" placeholder="请输入商品标题" />
        </el-form-item>
        <el-form-item label="商品描述" prop="body">
          <el-input v-model="notifyForm.body" type="textarea" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model="notifyForm.mark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="签名" prop="sign">
          <el-input v-model="notifyForm.sign" type="textarea" placeholder="请输入签名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNotify">取 消</el-button>
        <el-button type="primary" @click="submitNotify">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listBaizhouPayOrder, getBaizhouPayOrder, delBaizhouPayOrder, addBaizhouPayOrder, updateBaizhouPayOrder, notifyBaizhouPayOrder } from "@/api/billard/baizhouPayOrder";

export default {
  name: "BaizhouPayOrder",
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
      // 百舟支付请求与响应表格数据
      baizhouPayOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 异步通知弹窗显示状态
      notifyOpen: false,
      // 异步通知表单数据
      notifyForm: {
        mchid: "",
        order: "",
        money: 0,
        final_money: 0,
        time: "",
        finish_status: 0,
        subject: "",
        body: "",
        mark: "",
        sign: ""
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        method: null,
        mchid: null,
        version: null,
        payTime: null,
        signType: null,
        sign: null,
        product: null,
        reqOrder: null,
        money: null,
        notifyUrl: null,
        clientIp: null,
        account: null,
        uid: null,
        pdSubject: null,
        body: null,
        platformOrder: null,
        payUrl: null,
        finalMoney: null,
        payCode: null,
        msg: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        method: [
          { required: true, message: "接口命令不能为空", trigger: "blur" }
        ],
        mchid: [
          { required: true, message: "商户编号不能为空", trigger: "blur" }
        ],
        version: [
          { required: true, message: "接口版本不能为空", trigger: "blur" }
        ],
        payTime: [
          { required: true, message: "请求时间戳不能为空", trigger: "blur" }
        ],
        signType: [
          { required: true, message: "签名类型，MD5或RSA不能为空", trigger: "change" }
        ],
        sign: [
          { required: true, message: "签名内容不能为空", trigger: "blur" }
        ],
        product: [
          { required: true, message: "产品编码(支付通道)不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        notifyUrl: [
          { required: true, message: "回调地址不能为空", trigger: "blur" }
        ],
        clientIp: [
          { required: true, message: "客户端IP不能为空", trigger: "blur" }
        ],
      },
      // 异步通知表单验证规则
      notifyRules: {
        mchid: [
          { required: true, message: "商户编号不能为空", trigger: "blur" }
        ],
        order: [
          { required: true, message: "订单号不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        final_money: [
          { required: true, message: "实际支付金额不能为空", trigger: "blur" }
        ],
        time: [
          { required: true, message: "时间戳不能为空", trigger: "blur" }
        ],
        finish_status: [
          { required: true, message: "完成状态不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询百舟支付请求与响应列表 */
    getList() {
      this.loading = true;
      listBaizhouPayOrder(this.queryParams).then(response => {
        this.baizhouPayOrderList = response.rows;
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
        payReqId: null,
        method: null,
        mchid: null,
        version: null,
        payTime: null,
        signType: null,
        sign: null,
        product: null,
        reqOrder: null,
        money: null,
        notifyUrl: null,
        clientIp: null,
        account: null,
        uid: null,
        pdSubject: null,
        body: null,
        platformOrder: null,
        payUrl: null,
        finalMoney: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        payCode: null,
        msg: null
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
      this.ids = selection.map(item => item.payReqId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加百舟支付请求与响应";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const payReqId = row.payReqId || this.ids
      getBaizhouPayOrder(payReqId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改百舟支付请求与响应";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.payReqId != null) {
            updateBaizhouPayOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBaizhouPayOrder(this.form).then(response => {
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
      const payReqIds = row.payReqId || this.ids;
      this.$modal.confirm('是否确认删除百舟支付请求与响应编号为"' + payReqIds + '"的数据项？').then(function() {
        return delBaizhouPayOrder(payReqIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/baizhouPayOrder/export', {
        ...this.queryParams
      }, `baizhouPayOrder_${new Date().getTime()}.xlsx`)
    },
    formatDate(value, type) {
			// 计算日期相关值
			let time = typeof value == 'number' ? new Date(value) : value;
			let Y = time.getFullYear();
			let M = time.getMonth() + 1;
			let D = time.getDate();
			let h = time.getHours();
			let m = time.getMinutes();
			let s = time.getSeconds();
			let week = time.getDay();
			// 如果传递了type的话
			if (type == undefined) {
				return Y + '-' + (M < 10 ? '0' + M : M) + '-' + (D < 10 ? '0' + D : D) + ' ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
			} else if (type == 'week') {
				// 在quartz中 1为星期日
				return week + 1;
			}
		},
    /** 异步通知按钮操作 */
    handleNotify(row) {
      this.resetNotifyForm();
      // 从列表数据映射到表单数据
      this.notifyForm = {
        mchid: row.mchid || "",
        order: row.reqOrder || row.platformOrder || "",
        money: row.money || 0,
        final_money: row.finalMoney || 0,
        time: row.updateTime, // 当前时间戳
        finish_status: 1, // 默认已完成
        subject: row.pdSubject || "",
        body: row.body || "",
        mark: "", // 备注为空，用户可填写
        sign: row.sign || ""
      };
      this.notifyOpen = true;
    },
    /** 重置异步通知表单 */
    resetNotifyForm() {
      this.notifyForm = {
        mchid: "",
        order: "",
        money: 0,
        final_money: 0,
        time: "",
        finish_status: 0,
        subject: "",
        body: "",
        mark: "",
        sign: ""
      };
      if (this.$refs.notifyForm) {
        this.$refs.notifyForm.resetFields();
      }
    },
    /** 取消异步通知 */
    cancelNotify() {
      this.notifyOpen = false;
      this.resetNotifyForm();
    },
    /** 提交异步通知 */
    submitNotify() {
      this.$refs.notifyForm.validate(valid => {
        if (valid) {
          notifyBaizhouPayOrder(this.notifyForm).then(response => {
            this.$modal.msgSuccess("异步通知发送成功");
            this.notifyOpen = false;
            this.resetNotifyForm();
            // 可选：重新获取列表数据
            // this.getList();
          }).catch(() => {
            this.$modal.msgError("异步通知发送失败");
          });
        }
      });
    }
  }
};
</script>
