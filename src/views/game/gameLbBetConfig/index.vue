<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="游戏id" prop="gameid">
          <GameInfoSelect v-model="queryParams.gameid" placeholder="请选择游戏" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="下注金额" prop="betAmount">
        <el-input v-model="queryParams.betAmount" placeholder="请输入下注金额" clearable size="small" @keyup.enter.native="handleQuery" />
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
          v-hasPermi="['game:gameLbBetConfig:add']"
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
          v-hasPermi="['game:gameLbBetConfig:edit']"
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
          v-hasPermi="['game:gameLbBetConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['game:gameLbBetConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gameLbBetConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="configId" :fixed="true"/>
      <el-table-column label="游戏id" align="center" prop="gameid" />
      <el-table-column label="游戏名称" align="center" prop="twName" />
      
      <!-- 下注金额列 -->
      <el-table-column label="下注金额" align="center" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="400"
            trigger="hover"
            v-if="scope.row.betAmount"
          >
            <div>
              <h4 style="margin: 0 0 10px 0; color: #303133;">下注金额列表</h4>
              <div style="max-height: 200px; overflow-y: auto;">
                <el-table :data="getBetAmountTableData(scope.row)" border style="width: 100%;" size="mini">
                  <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                  <el-table-column label="下注金额" prop="amount" align="center"></el-table-column>
                </el-table>
              </div>
            </div>
            <div slot="reference" style="cursor: pointer; color: #409EFF;">
              <i class="el-icon-view"></i>
              查看金额
            </div>
          </el-popover>
          <span v-else style="color: #C0C4CC;">-</span>
        </template>
      </el-table-column>
      
      <!-- 倍率列表列 -->
      <el-table-column label="倍率列表" align="center" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="500"
            trigger="hover"
            v-if="scope.row.betRate"
          >
            <div>
              <h4 style="margin: 0 0 10px 0; color: #303133;">倍率详情</h4>
              <el-table height="300" :data="getBetRateTableData(scope.row)" border style="width: 100%; max-height: 300px; overflow-y: auto;" show-summary :summary-method="getBetRateSummary">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <!-- <el-table-column label="下注金额" prop="betAmount" align="center"></el-table-column> -->
                <el-table-column label="倍率" prop="rate" align="center"></el-table-column>
                <!-- <el-table-column label="对应金额" prop="correspondingAmount" align="center"></el-table-column> -->
              </el-table>
            </div>
            <div slot="reference" style="cursor: pointer; color: #409EFF;">
              <i class="el-icon-view"></i>
              查看倍率
            </div>
          </el-popover>
          <span v-else style="color: #C0C4CC;">-</span>
        </template>
      </el-table-column>
      
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['game:gameLbBetConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['game:gameLbBetConfig:remove']"
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

    <!-- 添加或修改游戏倍率对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="游戏id" prop="gameid">
          <GameInfoSelect :params="{formType: '1'}" v-model="form.gameid" placeholder="请选择游戏" clearable @change="handleGameChange" @keyup.enter.native="handleQuery" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="下注金额" prop="betAmount">
          <span slot="label">
            <span>下注金额</span>
            <el-tooltip content="请输入下注金额列表，格式为：1,2,3,5,10" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="form.betAmount" placeholder="请输入下注金额" />
        </el-form-item>
        <el-form-item label="倍率列表" prop="betRate">
          <span slot="label">
            <span>倍率列表</span>
            <el-tooltip content="请输入倍率列表，格式为：0,0.5,1,2,3,5,10,20" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="form.betRate" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listGameLbBetConfig, getGameLbBetConfig, delGameLbBetConfig, addGameLbBetConfig, updateGameLbBetConfig } from "@/api/game/gameLbBetConfig";
import GameInfoSelect from '@/components/GameInfoSelect'

export default {
  name: "GameLbBetConfig",
  components: {
    GameInfoSelect
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
      // 游戏倍率表格数据
      gameLbBetConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gameid: null,
        betAmount: null,
        betRate: null,
      },
      // 表单参数
      form: {
        twName: null,
      },
      // 表单校验
      rules: {
        gameid: [
          { required: true, message: "游戏id不能为空", trigger: "change" }
        ],
        betAmount: [
          { required: true, message: "下注金额不能为空", trigger: "blur" }
        ],
        betRate: [
          { required: true, message: "倍率列表不能为空", trigger: "change" }
        ]
      },
      // 提交loading状态
      submitLoading: false,
      // 是否为编辑模式
      isEdit: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询游戏倍率列表 */
    getList() {
      this.loading = true;
      listGameLbBetConfig(this.queryParams).then(response => {
        this.gameLbBetConfigList = response.rows;
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
        gameid: null,
        betAmount: null,
        betRate: null,
        remark: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        twName: null,
      };
      this.resetForm("form");
      this.isEdit = false; // 重置编辑模式
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
      this.title = "添加游戏倍率";
      this.isEdit = false; // 设置为新增模式
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const configId = row.configId || this.ids
      getGameLbBetConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏倍率";
        this.isEdit = true; // 设置为编辑模式
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.configId != null) {
            updateGameLbBetConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addGameLbBetConfig(this.form).then(response => {
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
      const configIds = row.configId || this.ids;
      this.$modal.confirm('是否确认删除游戏倍率编号为"' + configIds + '"的数据项？').then(function() {
        return delGameLbBetConfig(configIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('game/gameLbBetConfig/export', {
        ...this.queryParams
      }, `gameLbBetConfig_${new Date().getTime()}.xlsx`)
    },
    handleGameChange(data) {
      if (data && data.selectedItems && !this.isEdit) {
        this.form.twName = data.selectedItems.twName || data.selectedItems.usName || data.selectedItems.gameid;
      }
    },
    
    /** 获取下注金额详情表格数据 */
    getBetAmountTableData(row) {
      if (!row.betAmount) {
        return [];
      }
      // 解析下注金额字符串，格式如："1,2,3"
      const amounts = row.betAmount.split(',').map(item => item.trim()).filter(item => item);
      return amounts.map((amount, index) => ({
        index: index + 1,
        amount: amount
      }));
    },
    
    /** 获取倍率详情表格数据 */
    getBetRateTableData(row) {
      if (!row.betRate) {
        return [];
      }
      // 解析倍率字符串，格式如："0,0.5,1,2,3,5,10,20"
      const rates = row.betRate.split(',').map(item => item.trim()).filter(item => item);
      const betAmount = Number(row.betAmount || 0);
      
      return rates.map((rate, index) => {
        const rateValue = Number(rate || 0);
        const correspondingAmount = betAmount >= 0 && rateValue >= 0 ? 
          Number(Number((betAmount * rateValue).toFixed(8))) : '0';
        
        return {
          index: index + 1,
          betAmount: betAmount,
          rate: rate,
          correspondingAmount: correspondingAmount
        };
      });
    },
    
    /** 计算倍率详情表格汇总行 */
    getBetRateSummary(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总';
          return;
        }
        if (index === 1) {
          // 下注金额列，不显示汇总内容
          return;
        }
        if (index === 2) {
          // 倍率列，不显示汇总内容
          return;
        }
        if (index === 3) {
          // 对应金额列，计算总和
          const values = data.map(item => {
            if (item.correspondingAmount === '0') return 0;
            const amount = parseFloat(item.correspondingAmount);
            return isNaN(amount) ? 0 : amount;
          });
          if (!values.every(value => value === 0)) {
            const total = values.reduce((prev, curr) => {
              return Number(Number(Number(prev) + Number(curr)).toFixed(8));
            }, 0);
            sums[index] = total;
          } else {
            sums[index] = '0';
          }
          return;
        }
        sums[index] = '';
      });
      return sums;
    }
  }
};
</script>
