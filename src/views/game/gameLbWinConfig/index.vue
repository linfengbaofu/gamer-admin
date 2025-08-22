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
      <el-form-item label="游戏id" prop="gameid">
        <el-input
          v-model="queryParams.gameid"
          placeholder="请输入游戏id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否开启" prop="isOpen">
        <el-select v-model="queryParams.isOpen" placeholder="请选择是否开启"> 
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="控制时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择控制时间">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="控制结束时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          placeholder="请选择控制结束时间">
        </el-date-picker>
      </el-form-item> -->
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
          v-hasPermi="['game:gameLbWinConfig:add']"
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
          v-hasPermi="['game:gameLbWinConfig:edit']"
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
          v-hasPermi="['game:gameLbWinConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['game:gameLbWinConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gameLbWinConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="configId" :fixed="true"/>
      <el-table-column label="会员id" align="center" prop="mbId" />
      <el-table-column label="游戏id" align="center" prop="gameid" />
      <el-table-column label="匹配金额,金额匹配成功开始控制" align="center" prop="amountLimit" />
      <el-table-column label="倍率列表" align="center" prop="betRateList" />
      <el-table-column label="下注次数，最大支持100次" align="center" prop="betCount" />
      <el-table-column label="是否开启" align="center" prop="isOpen" />
      <el-table-column label="控制开始时间" align="center" prop="beginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="控制结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['game:gameLbWinConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['game:gameLbWinConfig:remove']"
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

    <!-- 添加或修改游戏输赢控制对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="会员id" prop="mbId">
          <MemberInfoSelect v-model="form.mbId" placeholder="请选择会员" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="游戏id" prop="gameid">
          <GameInfoSelect v-model="form.gameid" placeholder="请选择游戏" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="匹配金额" prop="amountLimit">
          <span slot="label">
            <span>匹配金额</span>
            <el-tooltip content="金额匹配成功开始控制" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="form.amountLimit" placeholder="请输入匹配金额" />
        </el-form-item>
        <el-form-item label="倍率列表" prop="betRateList">
          <span slot="label">
            <span>倍率列表</span>
            <el-tooltip content="请输入倍率列表，格式为：1.0,2.0,3.0" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="form.betRateList" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="下注次数，最大支持100次" prop="betCount">
          <el-input v-model="form.betCount" placeholder="请输入下注次数，最大支持100次" />
        </el-form-item>
        <el-form-item label="是否开启" prop="isOpen">
          <el-select v-model="form.isOpen" placeholder="请选择是否开启"> 
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="控制时间" prop="beginTime">
          <el-date-picker clearable
            v-model="form.createTime"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择控制时间">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listGameLbWinConfig, getGameLbWinConfig, delGameLbWinConfig, addGameLbWinConfig, updateGameLbWinConfig } from "@/api/game/gameLbWinConfig";
import GameInfoSelect from '@/components/GameInfoSelect'
import MemberInfoSelect from '@/components/MemberInfoSelect'

export default {
  name: "GameLbWinConfig",
  components: {
    GameInfoSelect,
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
      // 游戏输赢控制表格数据
      gameLbWinConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        createTime: [], 
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        gameid: null,
        amountLimit: null,
        betRateList: null,
        betCount: null,
        isOpen: null,
        beginTime: null,
        endTime: null,
      },
      // 表单参数
      form: {
        createTime: [], 
      },
      // 表单校验
      rules: {
        mbId: [
          { required: true, message: "会员id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询游戏输赢控制列表 */
    getList() {
      this.loading = true;
      listGameLbWinConfig(this.queryParams).then(response => {
        this.gameLbWinConfigList = response.rows;
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
        gameid: null,
        amountLimit: null,
        betRateList: null,
        betCount: null,
        isOpen: null,
        beginTime: null,
        endTime: null,
        remark: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        createTime: []
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
      this.title = "添加游戏输赢控制";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const configId = row.configId || this.ids
      if (row.beginTime && row.endTime) {
        this.form.createTime = [row.beginTime, row.endTime]
      } else {
        this.form.createTime = []
      }
      getGameLbWinConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏输赢控制";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const params = {
            ...this.form,
            beginTime: this.form.createTime[0],
            endTime: this.form.createTime[1]
          }
          if (this.form.configId != null) {
            updateGameLbWinConfig(params).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameLbWinConfig(params).then(response => {
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
      this.$modal.confirm('是否确认删除游戏输赢控制编号为"' + configIds + '"的数据项？').then(function() {
        return delGameLbWinConfig(configIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('game/gameLbWinConfig/export', {
        ...this.queryParams
      }, `gameLbWinConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
