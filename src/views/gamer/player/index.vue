<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      
      <el-form-item label="名字" prop="playerName">
        <el-input
          v-model="queryParams.playerName"
          placeholder="请输入名字"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['billard:player:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="playerList" @selection-change="handleSelectionChange">
      
      <el-table-column label="球员ID" align="center" prop="playerId" width="180" />
      <el-table-column label="头像地址" align="center" prop="avatar" >
        <template slot-scope="scope">
          <image-preview :src="scope.row.avatar" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="名字" align="center" prop="playerName" />
      <el-table-column label="性别" align="center" prop="playerSex" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_player_sex" :value="scope.row.playerSex"/>
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center" prop="playerAge" />
      <el-table-column label="球员状态" align="center" prop="playerStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_player_status" :value="scope.row.playerStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="球员信息" align="center" prop="refereeInfo" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" fixed="right" width="130" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:player:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:player:remove']"
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

    <!-- 添加或修改球员信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="头像地址" prop="avatar">
          <image-upload v-model="form.avatar" :limit="1" placeholder="请输入头像地址" />
        </el-form-item>
        <el-form-item label="名字" prop="playerName">
          <el-input v-model="form.playerName" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="年龄" prop="playerAge">
          <el-input v-model="form.playerAge" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="性别" prop="playerSex">
          <el-select v-model="form.playerSex" placeholder="请选择性别">
            <el-option v-for="item in dict.type.billard_player_sex" :key="item.value" :label="item.label" :value="+item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="球员状态" prop="playerStatus">
          <el-select v-model="form.playerStatus" placeholder="请选择球员状态">
            <el-option v-for="item in dict.type.billard_player_status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
       
        <el-form-item label="球员信息" prop="refereeInfo">
          <el-input v-model="form.refereeInfo" type="textarea" placeholder="请输入内容" />
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
import { listPlayer, getPlayer, delPlayer, addPlayer, updatePlayer } from "@/api/billard/player";

export default {
  dicts: ['billard_player_sex', 'billard_player_status'],
  name: "Player",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 提交loading
      submitLoading: false,
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
      // 球员信息表格数据
      playerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        avatar: null,
        playerName: null,
        playerSex: null,
        playerAge: null,
        playerStatus: null,
        refereeInfo: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        avatar: [
          { required: true, message: "头像地址不能为空", trigger: "blur" }
        ],
        playerName: [
          { required: true, message: "名字不能为空", trigger: "blur" }
        ],
        playerAge: [
          // { required: true, message: "年龄不能为空", trigger: "blur" },
          { pattern: /^[1-9]\d*$/, message: "年龄必须为正整数", trigger: "blur" }
        ],
        playerStatus: [
          { required: true, message: "球员状态不能为空", trigger: "blur" }
        ],
        refereeInfo: [
          { required: true, message: "球员信息不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询球员信息列表 */
    getList() {
      this.loading = true;
      listPlayer(this.queryParams).then(response => {
        this.playerList = response.rows;
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
        playerId: null,
        avatar: null,
        playerName: null,
        playerSex: null,
        playerAge: null,
        playerStatus: '0',
        remark: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        refereeInfo: null
      };
      this.submitLoading = false;
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
      this.ids = selection.map(item => item.playerId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加球员信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const playerId = row.playerId || this.ids
      getPlayer(playerId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改球员信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.playerId != null) {
            updatePlayer(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(() => {
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addPlayer(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(() => {
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const playerIds = row.playerId || this.ids;
      this.$modal.confirm('是否确认删除球员信息编号为"' + playerIds + '"的数据项？').then(function() {
        return delPlayer(playerIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/player/export', {
        ...this.queryParams
      }, `player_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
