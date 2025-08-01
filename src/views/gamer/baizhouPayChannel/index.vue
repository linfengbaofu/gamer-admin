<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="通道编码" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入通道编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通道名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入通道名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="全部" :value="null"></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
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
          v-hasPermi="['billard:baizhouPayChannel:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['billard:baizhouPayChannel:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['billard:baizhouPayChannel:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:baizhouPayChannel:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baizhouPayChannelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="channelId" width="120"/>
      <el-table-column label="通道编码" align="center" prop="channelCode" />
      <el-table-column label="通道名称" align="center" prop="channelName" />
      <el-table-column label="单笔最小限额" align="center" prop="limitMin" width="120"/>
      <el-table-column label="单笔最大限额" align="center" prop="limitMax" width="120"/>
      <el-table-column label="赠送比例" align="center" prop="givePointRate" ></el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:baizhouPayChannel:edit']"
          >修改</el-button>
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

    <!-- 添加或修改支付通道对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道编码" prop="channelCode">
          <el-input v-model="form.channelCode" placeholder="请输入通道编码" />
        </el-form-item>
        <el-form-item label="通道名称" prop="channelName">
          <el-input v-model="form.channelName" placeholder="请输入通道名称" />
        </el-form-item>
        <el-form-item label="单笔最小限额" prop="limitMin">
          <el-input v-model="form.limitMin" placeholder="请输入单笔最小限额" />
        </el-form-item>
        <el-form-item label="单笔最大限额" prop="limitMax">
          <el-input v-model="form.limitMax" placeholder="请输入单笔最大限额" />
        </el-form-item>
        <el-form-item label="赠送比例" prop="givePointRate">
          <el-input v-model="form.givePointRate" placeholder="请输入赠送比例" />
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
import { listBaizhouPayChannel, getBaizhouPayChannel, delBaizhouPayChannel, addBaizhouPayChannel, updateBaizhouPayChannel } from "@/api/billard/baizhouPayChannel";

export default {
  name: "BaizhouPayChannel",
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
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      // 支付通道表格数据
      baizhouPayChannelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        channelCode: null,
        channelName: null,
        limitMin: null,
        limitMax: null,
        status: null,
        givePointRate: null,
        beginDate: null,
        endDate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        channelCode: [
          { required: true, message: "通道编码不能为空", trigger: "blur" }
        ],
        limitMin: [
          { required: false, pattern: /^\d+(\.\d+)?$/, message: "请输入有效的数字", trigger: "blur" }
        ],
        limitMax: [
          { required: false, pattern: /^\d+(\.\d+)?$/, message: "请输入有效的数字", trigger: "blur" }
        ],
        givePointRate: [
          { required: true, message: "赠送比例不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "请输入有效的数字", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询支付通道列表 */
    getList() {
      this.loading = true;
      listBaizhouPayChannel(this.queryParams).then(response => {
        this.baizhouPayChannelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.submitLoading = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        channelId: null,
        channelCode: null,
        channelName: null,
        limitMin: null,
        limitMax: null,
        status: null,
        givePointRate: 100,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.channelId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加支付通道";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const channelId = row.channelId || this.ids
      getBaizhouPayChannel(channelId).then(response => {
        const data = response.data;
        this.form = {
          ...data,
        };
        this.open = true;
        this.title = "修改支付通道";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const params =  {...this.form};
          if (this.form.channelId != null) {
            updateBaizhouPayChannel(params).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 处理错误情况
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addBaizhouPayChannel(params).then(response => {
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
      const channelIds = row.channelId || this.ids;
      this.$modal.confirm('是否确认删除支付通道编号为"' + channelIds + '"的数据项？').then(function() {
        return delBaizhouPayChannel(channelIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/baizhouPayChannel/export', {
        ...this.queryParams
      }, `baizhouPayChannel_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
