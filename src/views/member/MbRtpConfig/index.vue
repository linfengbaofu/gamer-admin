<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户" prop="mbId">
        <member-info-select
          v-model="queryParams.mbId"
          placeholder="请选择用户"
          @change="handleMemberChange"
        />
      </el-form-item>
      <el-form-item label="rtp" prop="rtp">
        <el-input
          v-model="queryParams.rtp"
          placeholder="请输入rtp(7000-10200)"
          type="number"
          :min="7000"
          :max="10200"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开关" prop="isOpen">
        <el-select v-model="queryParams.isOpen" placeholder="请选择开关">
          <el-option label="关" value="1"></el-option>
          <el-option label="开" value="2"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="游戏" prop="gameId">
        <game-info-select
          v-model="queryParams.gameId"
          placeholder="请选择游戏"
          @change="handleGameChange"
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
          v-hasPermi="['member:MbRtpConfig:add']"
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
          v-hasPermi="['member:MbRtpConfig:edit']"
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
          v-hasPermi="['member:MbRtpConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:MbRtpConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="MbRtpConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="mbId" />
      <el-table-column label="用户账号" align="center" prop="mbAccount" />
      <el-table-column label="RTP" align="center" prop="rtp" />
      <!-- (7000,7500,8000,8500,9000,9500,9700,10200,分别对应：70%-102%) -->
      <!-- 70%-102% -->
      <el-table-column label="开关" align="center" prop="isOpen" >
        <template slot-scope="scope">
          <span>{{ scope.row.isOpen == '1' ? '关' : '开' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="游戏id" align="center" prop="gameId" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:MbRtpConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:MbRtpConfig:remove']"
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

    <!-- 添加或修改玩家rpt调控对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="mbId">
          <member-info-select
            v-model="form.mbId"
            placeholder="请选择用户"
            @change="handleFormMemberChange"
          />
        </el-form-item>
        <!-- (7000,7500,8000,8500,9000,9500,9700,10200,分别对应：70%-102%) -->
        <el-form-item label="rtp" prop="rtp">
          <el-input 
            v-model="form.rtp" 
            placeholder="请输入rtp(7000-10200)" 
            type="number"
            :min="7000"
            :max="10200"
          />
        </el-form-item>
        <el-form-item label="开关" prop="isOpen">
          <el-select v-model="form.isOpen" placeholder="请选择开关">
            <el-option label="关" :value="1"></el-option>
            <el-option label="开" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏" prop="gameId">
          <game-info-select
            v-model="form.gameId"
            placeholder="请选择游戏"
            @change="handleFormGameChange"
          />
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
import { listMbRtpConfig, getMbRtpConfig, delMbRtpConfig, addMbRtpConfig, updateMbRtpConfig } from "@/api/member/MbRtpConfig";
import GameInfoSelect from "@/components/GameInfoSelect";
import MemberInfoSelect from "@/components/MemberInfoSelect";

export default {
  name: "MbRtpConfig",
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
      // 玩家rpt调控表格数据
      MbRtpConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbId: null,
        mbAccount: null,
        rtp: null,
        isOpen: null,
        gameId: null,
      },
      // 表单参数
      form: {
        isOpen: 1,
      },
      // 表单校验
      rules: {
        rtp: [
          { required: true, message: "RTP不能为空", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('RTP不能为空'));
              } else {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                  callback(new Error('RTP必须是数字'));
                } else if (numValue < 7000 || numValue > 10200) {
                  callback(new Error('RTP必须在7000-10200之间'));
                } else {
                  callback();
                }
              }
            }, 
            trigger: "blur" 
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询玩家rpt调控列表 */
    getList() {
      this.loading = true;
      listMbRtpConfig(this.queryParams).then(response => {
        this.MbRtpConfigList = response.rows;
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
        mbId: null,
        mbAccount: null,
        rtp: null,
        isOpen: 1,
        gameId: null,
        createTime: null,
        remark: null
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
      this.title = "添加玩家rpt调控";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMbRtpConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改玩家rpt调控";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 额外验证RTP值
          if (!this.validateRtpValue(this.form.rtp)) {
            this.$message.error('RTP值必须在7000-10200之间');
            return;
          }
          
          if (this.form.id != null) {
            updateMbRtpConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMbRtpConfig(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 验证RTP值 */
    validateRtpValue(value) {
      if (value === null || value === undefined || value === '') {
        return false;
      }
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 7000 && numValue <= 10200;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除玩家rpt调控编号为"' + ids + '"的数据项？').then(function() {
        return delMbRtpConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/MbRtpConfig/export', {
        ...this.queryParams
      }, `MbRtpConfig_${new Date().getTime()}.xlsx`)
    },
    /** 查询表单用户选择变化 */
    handleMemberChange(data) {
      if (data.selectedItems) {
        this.queryParams.mbAccount = data.selectedItems.mbAccount
      }
    },
    /** 查询表单游戏选择变化 */
    handleGameChange(data) {
      // 可以在这里处理游戏选择变化
    },
    /** 编辑表单用户选择变化 */
    handleFormMemberChange(data) {
      if (data.selectedItems) {
        this.form.mbAccount = data.selectedItems.mbAccount
      }
    },
    /** 编辑表单游戏选择变化 */
    handleFormGameChange(data) {
      // 可以在这里处理游戏选择变化
    }
  }
};
</script>
