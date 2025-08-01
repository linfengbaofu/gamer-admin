<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="会员id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入会员id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录类型" prop="reordTypeList">
        <el-select v-model="queryParams.reordTypeList" placeholder="请选择记录类型" multiple clearable>
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
      <!-- ：1-收入，2-支出 -->
      <el-form-item label="收支" prop="isIncome">
        <el-select v-model="queryParams.isIncome" placeholder="请选择收支">
          <el-option v-for="item in dict.type.billard_points_record_is_income" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
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
          v-hasPermi="['billard:pointsRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <div class="mb10">
      <el-row :gutter="10" class="statistics-panel">
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="statistics-label">收入积分</div>
              <div class="statistics-value income">{{ pointsRecordCount.totalIncomePoints || 0 }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="statistics-label">支出积分</div>
              <div class="statistics-value expense">{{ pointsRecordCount.totalExpensesPoints || 0 }}</div>
            </div>
          </el-card>
        </el-col>
        <!-- <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="statistics-label">赠送收入积分</div>
              <div class="statistics-value gift-income">{{ pointsRecordCount.giveIncomePoints || 0 }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="statistics-label">赠送支出积分</div>
              <div class="statistics-value gift-expense">{{ pointsRecordCount.giveExpensesPoints || 0 }}</div>
            </div>
          </el-card>
        </el-col> -->
      </el-row>
    </div>
    <el-table v-loading="loading" :data="pointsRecordList" @selection-change="handleSelectionChange">
      
      <el-table-column label="ID" :fixed="true" align="center" prop="recordId" width="150"/>
      <el-table-column label="会员id" align="center" prop="mbId" width="150"/>
      <el-table-column label="会员账号" align="center" prop="mbAccount" width="150"/>
      <el-table-column label="来源记录ID" align="center" prop="sourceId" width="150"/>
      <!-- (1-下注;2-中奖;3-充值;4-提现;5-划转;6-佣金)不能为空 -->
      <el-table-column label="记录类型" align="center" prop="reordType" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_points_record_reord_type" :value="scope.row.reordType"/>
        </template>
      </el-table-column>
      <el-table-column label="被抽水人id" align="center" prop="pumpBetMbId" width="150"/>
      <el-table-column label="被抽水人账号" align="center" prop="pumpBetAccount" width="150"/>
      <el-table-column label="抽水比例" align="center" prop="pumpRate" width="120"/>
      <el-table-column label="被抽水的积分" align="center" prop="pumpBetPoints" width="150"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="收支" align="center" prop="isIncome" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_points_record_is_income" :value="scope.row.isIncome"/>
        </template>
      </el-table-column>
      <el-table-column label="变更积分数" align="center" prop="points" width="150"/>
      <el-table-column label="原积分数" align="center" prop="oldPoints" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

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
        <el-form-item label="用户id" prop="mbId">
          <el-input v-model="form.mbId" placeholder="请输入会员id" />
        </el-form-item>
        <el-form-item label="收支" prop="isIncome">
          <el-select v-model="form.isIncome" placeholder="请选择收支">
            <el-option label="收入" :value="1"></el-option>
            <el-option label="支出" :value="2"></el-option>
            <!-- <el-option v-for="item in dict.type.billard_points_record_is_income" :key="item.value" :label="item.label" :value="item.value" /> -->
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
import { listPointsRecord, getPointsRecord, delPointsRecord, addPointsRecord, updatePointsRecord, listPointsRecordCount } from "@/api/billard/pointsRecord";

export default {
  dicts: ['billard_points_record_is_income', 'billard_points_record_reord_type'],
  name: "PointsRecord",
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
      // 积分流水记录统计数据
      pointsRecordCount: {
        totalIncomePoints: 0,
        totalExpensesPoints: 0,
        "createBy": null,
        "createTime": null,
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "incomePoints": 8.02,
        "expensesPoints": 0,
        "giveIncomePoints": 0,
        "giveExpensesPoints": 0
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        sourceId: null,
        reordTypeList: null,
        isIncome: null,
        points: null,
        oldPoints: null,
        pumpBetMbId: null,
        pumpBetAccount: null,
        pumpRate: null,
        pumpBetPoints: null,
        createTime: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mbId: [
          { required: true, message: "会员id不能为空", trigger: "blur" }
        ],
        // (1-下注;2-中奖;3-充值;4-提现;5-划转;6-佣金)不能为空
        reordTypeList: [
          { required: true, message: "记录类型不能为空", trigger: "change" }
        ],
        isIncome: [
          { required: true, message: "收支", trigger: "blur" }
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
    handleParams() {
      const { createTime, reordTypeList, ...rest} = this.queryParams;
      const params = { ...rest };
      if (createTime) {
        params.beginDate = createTime[0];
        params.endDate = createTime[1];
      }
      if (reordTypeList && reordTypeList.length > 0) {
        params.reordTypeList = reordTypeList;
      }
      return params;
    },
    /** 查询积分流水记录列表 */
    getList() {
      this.loading = true;
      const params = this.handleParams();
      
      Promise.all([
        listPointsRecord(params),
        listPointsRecordCount(params)
      ]).then(([listResponse, countResponse]) => {
        this.pointsRecordList = listResponse.rows;
        this.total = listResponse.total;
        const obj = countResponse.data || {}; 
        this.pointsRecordCount = {
          ...obj,
          totalIncomePoints: Number((obj.incomePoints || 0) + (obj.giveIncomePoints || 0)).toFixed(2),
          totalExpensesPoints: Number((obj.expensesPoints || 0) + (obj.giveExpensesPoints || 0)).toFixed(2),
        };
        this.loading = false;
      }).catch(() => {
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
        mbId: null,
        sourceId: null,
        reordType: null,
        remark: null,
        isIncome: null,
        points: null,
        oldPoints: null,
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
      this.download('billard/pointsRecord/export', {
        ...this.handleParams()
      }, `pointsRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style scoped>
.statistics-panel {
  margin-bottom: 20px;
}

.statistics-card {
  border-radius: 8px;
}

.statistics-item {
  text-align: center;
  padding: 10px;
}

.statistics-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.statistics-value {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.statistics-value.income {
  color: #67c23a;
}

.statistics-value.expense {
  color: #f56c6c;
}

.statistics-value.gift-income {
  color: #409eff;
}

.statistics-value.gift-expense {
  color: #e6a23c;
}
</style>
