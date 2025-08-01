<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="员工id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入员工id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录类型" prop="reordType">
        <el-select v-model="queryParams.reordType" placeholder="请选择记录类型">
          <el-option v-for="item in dict.type.billard_points_record_reord_type" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="会员账号" prop="mbAccount"> 
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入会员账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源记录ID" prop="sourceId">
        <el-input
          v-model="queryParams.sourceId"
          placeholder="请输入来源记录ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收支" prop="isIncome">
        <el-select v-model="queryParams.isIncome" placeholder="请选择收支">
          <el-option v-for="item in dict.type.billard_points_record_is_income" :key="item.value" :label="item.label" :value="item.value" />
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
          v-hasPermi="['member:pointsRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pointsRecordList" @selection-change="handleSelectionChange">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="id" width="150"/>
      <el-table-column label="员工id" align="center" prop="userId" width="150"/>
      <el-table-column label="来源记录ID" align="center" prop="sourceId" width="150"/>
      <el-table-column label="记录类型" align="center" prop="reordType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_points_record_reord_type" :value="scope.row.reordType"/>
        </template>
      </el-table-column>

      <el-table-column label="被抽水人id" align="center" prop="pumpBetMbId" width="150"/>
      <el-table-column label="被抽水人账号" align="center" prop="pumpBetAccount" width="150"/>
      <el-table-column label="抽水比例" align="center" prop="pumpRate" width="120"/>
      <el-table-column label="被抽水的积分" align="center" prop="pumpBetPoints" width="150"/>
      <el-table-column label="收支" align="center" prop="isIncome" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_points_record_is_income" :value="scope.row.isIncome"/>
        </template>
      </el-table-column>
      <el-table-column label="变更积分数" align="center" prop="points" />
      <el-table-column label="原积分数" align="center" prop="oldPoints" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>
      <el-table-column label="备注" align="center" prop="remark" />
      

    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改积分流水记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入员工id" />
        </el-form-item>
        <el-form-item label="来源记录ID" prop="sourceId">
          <el-input v-model="form.sourceId" placeholder="请输入来源记录ID" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="收支" prop="isIncome">
          <el-select v-model="form.isIncome" placeholder="请选择收支">
            <el-option v-for="item in dict.type.billard_points_record_is_income" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更积分数" prop="points">
          <el-input v-model="form.points" placeholder="请输入变更积分数" />
        </el-form-item>
        <el-form-item label="原积分数" prop="oldPoints">
          <el-input v-model="form.oldPoints" placeholder="请输入原积分数" />
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
import { listPointsRecord, getPointsRecord, delPointsRecord, addPointsRecord, updatePointsRecord } from "@/api/member/pointsRecord";

export default {
  name: "MemberPointsRecord",
  dicts: ['billard_points_record_is_income', 'billard_points_record_reord_type'],
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
      // 积分流水记录表格数据
      pointsRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        sourceId: null,
        reordType: null,
        isIncome: null,
        points: null,
        oldPoints: null,
        pumpBetMbId: null,
        pumpBetAccount: null,
        pumpRate: null,
        pumpBetPoints: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "员工id不能为空", trigger: "blur" }
        ],
        reordType: [
          { required: true, message: "记录类型(1-划转)不能为空", trigger: "change" }
        ],
        isIncome: [
          { required: true, message: "收支：1-收入，2-支出不能为空", trigger: "blur" }
        ],
        points: [
          { required: true, message: "变更积分数不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询积分流水记录列表 */
    getList() {
      this.loading = true;
      listPointsRecord(this.queryParams).then(response => {
        this.pointsRecordList = response.rows;
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
        userId: null,
        sourceId: null,
        reordType: null,
        remark: null,
        isIncome: null,
        points: null,
        oldPoints: null,
        createTime: null,
        createBy: null,
        pumpBetMbId: null,
        pumpBetAccount: null,
        pumpRate: null,
        pumpBetPoints: null,
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
      this.title = "添加积分流水记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPointsRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改积分流水记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePointsRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPointsRecord(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除积分流水记录编号为"' + ids + '"的数据项？').then(function() {
        return delPointsRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/pointsRecord/export', {
        ...this.queryParams
      }, `pointsRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
