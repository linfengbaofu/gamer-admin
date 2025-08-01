<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="商户编号" prop="mchid">
        <el-input
          v-model="queryParams.mchid"
          placeholder="请输入商户编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求订单号" prop="reqOrder">
        <el-input
          v-model="queryParams.reqOrder"
          placeholder="请输入请求订单号"
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
      <el-form-item label="商户订单号" prop="resOrder">
        <el-input
          v-model="queryParams.resOrder"
          placeholder="请输入商户订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="订单创建时间" prop="orderCreateTime">
        <el-date-picker clearable
          v-model="queryParams.orderCreateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择订单创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单完成时间" prop="finishTime">
        <el-date-picker clearable
          v-model="queryParams.finishTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择订单完成时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="记录创建时间" prop="recordCreateTime">
        <el-date-picker clearable
          v-model="queryParams.recordCreateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择记录创建时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="响应码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入响应码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="finishStatus">
        <el-select v-model="queryParams.finishStatus" placeholder="请选择订单状态" clearable>
          <el-option
            v-for="item in finishStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:baizhouPayQuery:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baizhouPayQueryList" @selection-change="handleSelectionChange">
      <el-table-column label="主键ID" align="center" prop="queryId" />
      <el-table-column label="接口命令" align="center" prop="method" />
      <el-table-column label="商户编号" align="center" prop="mchid" />
      <el-table-column label="接口版本" align="center" prop="version" />
      <el-table-column label="请求时间" align="center" prop="reqTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reqTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签名类型" align="center" prop="signType" />
      <el-table-column label="签名" align="center" prop="sign" />
      <el-table-column label="请求订单号" align="center" prop="reqOrder" />
      <el-table-column label="平台订单号" align="center" prop="platformOrder" />
      <el-table-column label="商户订单号" align="center" prop="resOrder" />
      <el-table-column label="商户下单金额" align="center" prop="money" />
      <el-table-column label="实际支付金额" align="center" prop="finalMoney" />
      <el-table-column label="订单创建时间" align="center" prop="orderCreateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderCreateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="finishStatus">
        <template slot-scope="scope">
          <el-tag :type="getFinishStatusTagType(scope.row.finishStatus)">
            {{ getFinishStatusText(scope.row.finishStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单完成时间" align="center" prop="finishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单备注或错误信息" align="center" prop="mark" />
      <el-table-column label="记录创建时间" align="center" prop="recordCreateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.recordCreateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="响应码" align="center" prop="code" />
      <el-table-column label="消息" align="center" prop="msg" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:baizhouPayQuery:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:baizhouPayQuery:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改百州支付订单查询记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接口命令" prop="method">
          <el-input v-model="form.method" placeholder="请输入接口命令" />
        </el-form-item>
        <el-form-item label="商户编号" prop="mchid">
          <el-input v-model="form.mchid" placeholder="请输入商户编号" />
        </el-form-item>
        <el-form-item label="接口版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入接口版本" />
        </el-form-item>
        <el-form-item label="请求时间" prop="reqTime">
          <el-date-picker clearable
            v-model="form.reqTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择请求时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签名" prop="sign">
          <el-input v-model="form.sign" placeholder="请输入签名" />
        </el-form-item>
        <el-form-item label="请求订单号" prop="reqOrder">
          <el-input v-model="form.reqOrder" placeholder="请输入请求订单号" />
        </el-form-item>
        <el-form-item label="平台订单号" prop="platformOrder">
          <el-input v-model="form.platformOrder" placeholder="请输入平台订单号" />
        </el-form-item>
        <el-form-item label="商户订单号" prop="resOrder">
          <el-input v-model="form.resOrder" placeholder="请输入商户订单号" />
        </el-form-item>
        <el-form-item label="商户下单金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入商户下单金额" />
        </el-form-item>
        <el-form-item label="实际支付金额" prop="finalMoney">
          <el-input v-model="form.finalMoney" placeholder="请输入实际支付金额" />
        </el-form-item>
        <el-form-item label="订单创建时间" prop="orderCreateTime">
          <el-date-picker clearable
            v-model="form.orderCreateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择订单创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单完成时间" prop="finishTime">
          <el-date-picker clearable
            v-model="form.finishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择订单完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="finishStatus">
          <el-select v-model="form.finishStatus" placeholder="请选择订单状态">
            <el-option
              v-for="item in finishStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单备注或错误信息" prop="mark">
          <el-input v-model="form.mark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="记录创建时间" prop="recordCreateTime">
          <el-date-picker clearable
            v-model="form.recordCreateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择记录创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="响应码" prop="code">
          <el-input v-model="form.code" placeholder="请输入响应码" />
        </el-form-item>
        <el-form-item label="消息" prop="msg">
          <el-input v-model="form.msg" type="textarea" placeholder="请输入内容" />
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
import { listBaizhouPayQuery, getBaizhouPayQuery, delBaizhouPayQuery, addBaizhouPayQuery, updateBaizhouPayQuery } from "@/api/billard/baizhouPayQuery";

export default {
  name: "BaizhouPayQuery",
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
      // 订单状态选项
      finishStatusOptions: [
        { value: '0', label: '下单' },
        { value: '1', label: '完成' },
        { value: '2', label: '待支付' }
      ],
      // 百州支付订单查询记录表格数据
      baizhouPayQueryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        method: null,
        mchid: null,
        version: null,
        reqTime: null,
        signType: null,
        sign: null,
        reqOrder: null,
        platformOrder: null,
        resOrder: null,
        money: null,
        finalMoney: null,
        orderCreateTime: null,
        finishStatus: null,
        finishTime: null,
        mark: null,
        recordCreateTime: null,
        code: null,
        msg: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mchid: [
          { required: true, message: "商户编号不能为空", trigger: "blur" }
        ],
        reqTime: [
          { required: true, message: "请求时间不能为空", trigger: "blur" }
        ],
        sign: [
          { required: true, message: "签名不能为空", trigger: "blur" }
        ],
        reqOrder: [
          { required: true, message: "请求订单号不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询百州支付订单查询记录列表 */
    getList() {
      this.loading = true;
      listBaizhouPayQuery(this.queryParams).then(response => {
        this.baizhouPayQueryList = response.rows;
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
        queryId: null,
        method: null,
        mchid: null,
        version: null,
        reqTime: null,
        signType: null,
        sign: null,
        reqOrder: null,
        platformOrder: null,
        resOrder: null,
        money: null,
        finalMoney: null,
        orderCreateTime: null,
        finishStatus: null,
        finishTime: null,
        mark: null,
        recordCreateTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        code: null,
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
      this.ids = selection.map(item => item.queryId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加百州支付订单查询记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const queryId = row.queryId || this.ids
      getBaizhouPayQuery(queryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改百州支付订单查询记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.queryId != null) {
            updateBaizhouPayQuery(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBaizhouPayQuery(this.form).then(response => {
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
      const queryIds = row.queryId || this.ids;
      this.$modal.confirm('是否确认删除百州支付订单查询记录编号为"' + queryIds + '"的数据项？').then(function() {
        return delBaizhouPayQuery(queryIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/baizhouPayQuery/export', {
        ...this.queryParams
      }, `baizhouPayQuery_${new Date().getTime()}.xlsx`)
    },
    /** 获取订单状态文本 */
    getFinishStatusText(status) {
      const statusMap = {
        '0': '下单',
        '1': '完成',
        '2': '待支付'
      };
      return statusMap[status] || status;
    },
    /** 获取订单状态标签类型 */
    getFinishStatusTagType(status) {
      const tagMap = {
        '0': 'info',
        '1': 'success',
        '2': 'warning'
      };
      return tagMap[status] || '';
    }
  }
};
</script>
