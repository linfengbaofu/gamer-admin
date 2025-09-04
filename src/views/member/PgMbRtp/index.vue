<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入用户账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="游戏id" prop="gameId">
        <el-input
          v-model="queryParams.gameId"
          placeholder="请输入游戏id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="游戏名称" prop="gameName">
        <el-input
          v-model="queryParams.gameName"
          placeholder="请输入游戏名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     
      <el-form-item label="rtp" prop="rtp">
        <el-input
          v-model="queryParams.rtp"
          placeholder="请输入rtp"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否开启" prop="isOpen">
        <el-select v-model="queryParams.isOpen" placeholder="请选择是否开启" style="width: 100%;">
          <el-option label="开启" value="1" />
          <el-option label="关闭" value="0" />
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
          v-hasPermi="['member:PgMbRtp:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['member:PgMbRtp:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:PgMbRtp:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="PgMbRtpList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="mbId" />
      <el-table-column label="用户账号" align="center" prop="mbAccount" />
      <el-table-column label="游戏id" align="center" prop="gameId" />
      <el-table-column label="游戏名称" align="center" prop="gameName" />
      <el-table-column label="游戏logo" align="center" prop="gameLogo" >
        <template slot-scope="scope">
          <el-image :src="scope.row.gameLogo" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="rtp" align="center" prop="rtp" />
      <el-table-column label="是否开启" align="center" prop="isOpen" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOpen === '1' ? 'success' : 'danger'">{{ scope.row.isOpen === '1' ? '开启' : '关闭' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" width="140" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:PgMbRtp:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:PgMbRtp:remove']"
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

    <!-- 添加或修改用户rtp控制对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="mbId">
          <member-info-select 
            v-if="form.id == null"
            v-model="form.mbId" 
            placeholder="请选择用户"
            @change="handleMemberChange"
            style="width: 100%;"
          />
          <el-input v-else v-model="form.mbAccount" readonly />
        </el-form-item>
        <el-form-item label="用户账号" prop="mbAccount">
          <el-input v-model="form.mbAccount" placeholder="用户账号" :disabled="true" />
        </el-form-item>
        <el-form-item label="游戏" prop="gameId">
          <el-select 
            v-model="form.gameId" 
            placeholder="请选择游戏" 
            :disabled="isEdit"
            @change="handleGameChange"
            style="width: 100%"
          >
            <el-option
              v-for="game in gameList"
              :key="game.id"
              :label="game.gameName"
              :value="game.gameId"
            >
              <span style="float: left">{{ game.gameName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ game.gameId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="form.gameName" placeholder="游戏名称" :disabled="true" />
        </el-form-item>
        <el-form-item label="游戏logo" prop="gameLogo">
          <el-image :src="form.gameLogo" style="width: 50px; height: 50px;" />
        </el-form-item>
        <el-form-item label="RTP值" prop="rtp">
          <el-select 
            v-model="form.rtp" 
            placeholder="请选择RTP值" 
            style="width: 100%"
          >
            <el-option
              v-for="rtp in availableRtpList"
              :key="rtp"
              :label="rtp"
              :value="rtp"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启" prop="isOpen">
          <el-select v-model="form.isOpen" placeholder="请选择状态" style="width: 100%">
            <el-option label="开启" value="1" />
            <el-option label="关闭" value="0" />
          </el-select>
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
import { listPgMbRtp, getPgMbRtp, delPgMbRtp, addPgMbRtp, updatePgMbRtp } from "@/api/member/PgMbRtp";
import { listPgRtpInfo } from "@/api/member/PgRtpInfo";
import MemberInfoSelect from "@/components/MemberInfoSelect";

export default {
  name: "PgMbRtp",
  components: {
    MemberInfoSelect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 提交按钮loading状态
      submitLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 是否为编辑模式
      isEdit: false,
      // 游戏列表数据
      gameList: [],
      // 可用的RTP列表
      availableRtpList: [],
      // 总条数
      total: 0,
      // 用户rtp控制表格数据
      PgMbRtpList: [],
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
        gameId: null,
        gameName: null,
        gameLogo: null,
        rtp: null,
        isOpen: null,
      },
      // 表单参数
      form: {
        mbId: null,
        mbAccount: null,
        gameId: null,
        gameName: null,
        gameLogo: null,
        rtp: null,
        isOpen: '1',
      },
      // 表单校验
      rules: {
        mbId: [
          { required: true, message: "请选择用户", trigger: "change" }
        ],
        gameId: [
          { required: true, message: "请选择游戏", trigger: "change" }
        ],
        rtp: [
          { required: true, message: "请选择RTP值", trigger: "change" }
        ],
        isOpen: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getGameList();
  },
  methods: {
    /** 查询用户rtp控制列表 */
    getList() {
      this.loading = true;
      listPgMbRtp(this.queryParams).then(response => {
        this.PgMbRtpList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取游戏列表 */
    getGameList() {
      return listPgRtpInfo({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.gameList = response.rows || [];
        return response;
      });
    },
    /** 解析RTP列表字符串 */
    parseRtpList(rtpString) {
      if (!rtpString) return [];
      try {
        let rtpArray = [];
        
        // 处理字符串格式的数组，如 "[1,2,3]"
        if (typeof rtpString === 'string') {
          // 移除方括号并分割
          const cleanString = rtpString.replace(/[\[\]]/g, '');
          rtpArray = cleanString.split(',').map(item => (item.trim())).filter(item => !isNaN(item));
        }
        // 如果已经是数组，直接使用
        else if (Array.isArray(rtpString)) {
          rtpArray = rtpString.map(item => (item)).filter(item => !isNaN(item));
        }
        
        return rtpArray;
      } catch (error) {
        console.error('解析RTP列表失败:', error);
        return [];
      }
    },
    /** 用户选择变化处理 */
    handleMemberChange(data) {
      if (data && data.selectedItems) {
        this.form.mbAccount = data.selectedItems.mbAccount;
      }
    },
    /** 游戏选择变化处理 */
    handleGameChange(gameId) {
      const selectedGame = this.gameList.find(game => game.gameId === gameId);
      if (selectedGame) {
        this.form.gameName = selectedGame.gameName;
        this.form.gameLogo = selectedGame.gameLogo;
        
        // 解析RTP列表
        this.availableRtpList = this.parseRtpList(selectedGame.mul);
      }
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
        gameId: null,
        gameName: null,
        gameLogo: null,
        rtp: null,
        isOpen: '1',
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null
      };
      this.availableRtpList = [];
      this.isEdit = false;
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
      this.isEdit = false;
      this.open = true;
      this.title = "添加用户rtp控制";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.isEdit = true;
      const id = row.id || this.ids
      
      // 重新获取游戏列表数据，确保下拉选项是最新的
      this.getGameList().then(() => {
        getPgMbRtp(id).then(response => {
          this.form = response.data;
          
          // 在编辑模式下，根据游戏ID获取对应的游戏信息和RTP列表
          const selectedGame = this.gameList.find(game => game.gameId === this.form.gameId);
          if (selectedGame) {
            this.form.gameName = selectedGame.gameName;
            this.form.gameLogo = selectedGame.gameLogo;
            // 解析RTP列表
            this.availableRtpList = this.parseRtpList(selectedGame.mul);
          }
          
          this.open = true;
          this.title = "修改用户rtp控制";
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.id != null) {
            updatePgMbRtp(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addPgMbRtp(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除用户rtp控制编号为"' + ids + '"的数据项？').then(function() {
        return delPgMbRtp(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/PgMbRtp/export', {
        ...this.queryParams
      }, `PgMbRtp_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
