<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="商户订单号" prop="reqOrder">
        <el-input
          v-model="queryParams.reqOrder"
          placeholder="请输入商户订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="recordNo">
        <el-input
          v-model="queryParams.recordNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="会员id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入会员id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入账号"
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
          v-hasPermi="['billard:baizhouRechargeRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baizhouRechargeRecordList" @selection-change="handleSelectionChange">
      <el-table-column label="主键ID" align="center" prop="recordId" width="180" show-overflow-tooltip/>
      <el-table-column label="商户订单号" align="center" prop="reqOrder" width="300" show-overflow-tooltip/>
      <el-table-column label="订单号" align="center" prop="recordNo" width="300" show-overflow-tooltip/>
      <el-table-column label="会员id" align="center" prop="mbId" width="150" show-overflow-tooltip/>
      <el-table-column label="支付类型" align="center" prop="payType" >
        <template slot-scope="scope">
          {{ getChannelName(scope.row.payType) }}
        </template>
      </el-table-column>
      <el-table-column label="完成状态" align="center" prop="finishStatus" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.finishStatus === 1" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" align="center" prop="rechargeAmout" />
      <el-table-column label="充值积分数" align="center" prop="rechargePoints" />
      <el-table-column label="账号" align="center" prop="mbAccount" />
      <!-- <el-table-column label="邀请人id" align="center" prop="inMbId" /> -->
      <!-- <el-table-column label="合营id" align="center" prop="hyId" /> -->
      <!-- <el-table-column label="usdt汇率" align="center" prop="exchangeRate" /> -->
      <el-table-column label="赠送积分" align="center" prop="givePoints" />
      <el-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:baizhouRechargeRecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:baizhouRechargeRecord:remove']"
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

    <!-- 添加或修改百州充值记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商户订单号" prop="reqOrder">
          <el-input v-model="form.reqOrder" placeholder="请输入商户订单号" />
        </el-form-item>
        <el-form-item label="订单号" prop="recordNo">
          <el-input v-model="form.recordNo" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="会员id" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入会员id" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="充值金额" prop="rechargeAmout">
          <el-input v-model="form.rechargeAmout" placeholder="请输入充值金额" />
        </el-form-item>
        <el-form-item label="充值积分数" prop="rechargePoints">
          <el-input v-model="form.rechargePoints" placeholder="请输入充值积分数" />
        </el-form-item>
        <el-form-item label="账号" prop="mbAccount">
          <el-input v-model="form.mbAccount" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="邀请人id" prop="inMbId">
          <el-input v-model="form.inMbId" placeholder="请输入邀请人id" />
        </el-form-item>
        <el-form-item label="合营id" prop="hyId">
          <el-input v-model="form.hyId" placeholder="请输入合营id" />
        </el-form-item>
        <el-form-item label="usdt汇率" prop="exchangeRate">
          <el-input v-model="form.exchangeRate" placeholder="请输入usdt汇率" />
        </el-form-item>
        <el-form-item label="赠送积分" prop="givePoints">
          <el-input v-model="form.givePoints" placeholder="请输入赠送积分" />
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
import { listBaizhouRechargeRecord, getBaizhouRechargeRecord, delBaizhouRechargeRecord, addBaizhouRechargeRecord, updateBaizhouRechargeRecord } from "@/api/billard/baizhouRechargeRecord";
import { listBaizhouPayChannel } from "@/api/billard/baizhouPayChannel";

export default {
  name: "BaizhouRechargeRecord",
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
      // 百州充值记录表格数据
      baizhouRechargeRecordList: [],
      // 支付渠道列表
      baizhouPayChannelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reqOrder: null,
        recordNo: null,
        mbId: null,
        payType: null,
        finishStatus: null,
        rechargeAmout: null,
        rechargePoints: null,
        mbAccount: null,
        inMbId: null,
        hyId: null,
        exchangeRate: null,
        givePoints: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reqOrder: [
          { required: true, message: "商户订单号不能为空", trigger: "blur" }
        ],
        finishStatus: [
          { required: true, message: "完成状态不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getPayChannelList();
  },
  methods: {
    /** 查询百州充值记录列表 */
    getList() {
      this.loading = true;
      listBaizhouRechargeRecord(this.queryParams).then(response => {
        this.baizhouRechargeRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询支付渠道列表 */
    getPayChannelList() {
      listBaizhouPayChannel({}).then(response => {
        this.baizhouPayChannelList = response.rows || [];
      });
    },
    /** 根据渠道代码获取渠道名称 */
    getChannelName(channelCode) {
      const channel = this.baizhouPayChannelList.find(item => item.channelCode === channelCode);
      return channel ? channel.channelName : channelCode;
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
        reqOrder: null,
        recordNo: null,
        mbId: null,
        payType: null,
        finishStatus: null,
        remark: null,
        rechargeAmout: null,
        rechargePoints: null,
        createTime: null,
        createBy: null,
        mbAccount: null,
        inMbId: null,
        hyId: null,
        exchangeRate: null,
        givePoints: null
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
      this.title = "添加百州充值记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getBaizhouRechargeRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改百州充值记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recordId != null) {
            updateBaizhouRechargeRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBaizhouRechargeRecord(this.form).then(response => {
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
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除百州充值记录编号为"' + recordIds + '"的数据项？').then(function() {
        return delBaizhouRechargeRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/baizhouRechargeRecord/export', {
        ...this.queryParams
      }, `baizhouRechargeRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
