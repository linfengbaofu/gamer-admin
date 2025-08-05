<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="礼品码" prop="gameCode">
        <el-input
          v-model="queryParams.gameCode"
          placeholder="请输入礼品码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="会员" prop="mbId">
        <el-select
          v-model="queryParams.mbId"
          placeholder="请选择会员"
          filterable
          remote
          reserve-keyword
          :remote-method="remoteSearchQueryMember"
          :loading="queryMemberLoading"
          clearable
          style="width: 200px"
          @change="handleQueryMemberChange"
        >
          <el-option
            v-for="item in queryMemberOptions"
            :key="item.mbId"
            :label="`${item.mbAccount}`"
            :value="item.mbId"
          >
            <span style="float: left">{{ item.mbAccount }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mbId }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否兑换完成" prop="isRedemption">
        <el-select
          v-model="queryParams.isRedemption"
          placeholder="请选择兑换状态"
          clearable
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="dict in dict.type.record_is_redemption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
          >搜索</el-button
        >
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
          v-hasPermi="['game:gameCodeRecord:add']"
          >新增</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['game:gameCodeRecord:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gameCodeRecordList">
      <el-table-column
        label="主键ID"
        align="center"
        prop="recordId"
        :fixed="true"
        width="150"
      />
      <el-table-column label="礼品码" align="center" prop="gameCode" width="200">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center; justify-content: center">
            <span style="margin-right: 8px">{{ scope.row.gameCode }}</span>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document-copy"
              @click="copyGameCode(scope.row.gameCode)"
              title="复制礼品码"
            ></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="礼品码金额" align="center" prop="codeAmount" width="150" />
      <el-table-column label="会员id" align="center" prop="mbId" width="150" />
      <el-table-column label="会员账号" align="center" prop="mbAccount" width="150" />
      <el-table-column
        label="是否兑换完成"
        align="center"
        prop="isRedemption"
        width="150"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.record_is_redemption"
            :value="scope.row.isRedemption"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" width="150" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150" />
      <el-table-column label="备注" align="center" prop="remark" width="150" />

      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isRedemption === 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['game:gameCodeRecord:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改礼品码记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="礼品码金额" prop="codeAmount">
          <el-input v-model="form.codeAmount" placeholder="请输入礼品码金额" />
        </el-form-item>
        <el-form-item label="会员" prop="mbId">
          <el-select
            v-model="form.mbId"
            placeholder="请选择会员"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteSearchMember"
            :loading="memberLoading"
            style="width: 100%"
            @change="handleMemberChange"
          >
            <el-option
              v-for="item in memberOptions"
              :key="item.mbId"
              :label="`${item.mbAccount}`"
              :value="item.mbId"
            >
              <span style="float: left">{{ item.mbAccount }}</span>
              <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mbId }}</span> -->

            </el-option>
          </el-select>
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
import {
  listGameCodeRecord,
  getGameCodeRecord,
  delGameCodeRecord,
  addGameCodeRecord,
  updateGameCodeRecord,
} from "@/api/game/gameCodeRecord";
import { listInfo } from "@/api/member/info";

export default {
  dicts: ["record_is_redemption"],
  name: "GameCodeRecord",
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
      // 礼品码记录表格数据
      gameCodeRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gameCode: null,
        codeAmount: null,
        mbId: null,
        isRedemption: null,
      },
      // 表单参数
      form: {
        mbAccount: null, // 添加会员账号字段
      },
      // 会员选项
      memberOptions: [],
      // 查询表单会员选项
      queryMemberOptions: [],
      // 会员搜索loading
      memberLoading: false,
      // 查询表单会员搜索loading
      queryMemberLoading: false,
      // 表单校验
      rules: {
        gameCode: [{ required: true, message: "礼品码不能为空", trigger: "blur" }],
        codeAmount: [{ required: true, message: "礼品码金额不能为空", trigger: "blur" }],
        mbId: [{ required: true, message: "请选择会员", trigger: "change" }],
      },
    };
  },
  created() {
    this.getList();
    // 初始化会员选项数据
    this.loadInitialMembers();
    // 初始化查询表单会员选项数据
    this.loadInitialQueryMembers();
  },
  methods: {
    /** 查询礼品码记录列表 */
    getList() {
      this.loading = true;
      listGameCodeRecord(this.queryParams).then((response) => {
        this.gameCodeRecordList = response.rows;
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
        recordId: null,
        gameCode: null,
        codeAmount: null,
        mbId: null,
        mbAccount: null, // 重置会员账号
        remark: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        isRedemption: null,
      };
      this.memberOptions = [];
      this.memberLoading = false;
      this.resetForm("form");
      // 重置后加载初始会员数据
      this.loadInitialMembers();
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
      this.ids = selection.map((item) => item.recordId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加礼品码记录";
      // 确保有初始会员数据
      if (this.memberOptions.length === 0) {
        this.loadInitialMembers();
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids;
      getGameCodeRecord(recordId).then((response) => {
        this.form = response.data;
        // 确保会员账号字段存在
        if (!this.form.mbAccount) {
          this.form.mbAccount = null;
        }
        this.open = true;
        this.title = "修改礼品码记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.recordId != null) {
            updateGameCodeRecord(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameCodeRecord(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除礼品码记录编号为"' + recordIds + '"的数据项？')
        .then(function () {
          return delGameCodeRecord(recordIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "game/gameCodeRecord/export",
        {
          ...this.queryParams,
        },
        `gameCodeRecord_${new Date().getTime()}.xlsx`
      );
    },
              /** 加载初始会员数据 */
    loadInitialMembers() {
      this.memberLoading = true;
      listInfo({
        pageNum: 1,
        pageSize: 20,
      })
        .then((response) => {
          this.memberOptions = response.rows || [];
          this.memberLoading = false;
        })
        .catch((error) => {
          console.error("加载初始会员数据失败:", error);
          this.memberOptions = [];
          this.memberLoading = false;
        });
    },
    /** 加载查询表单初始会员数据 */
    loadInitialQueryMembers() {
      this.queryMemberLoading = true;
      listInfo({
        pageNum: 1,
        pageSize: 20,
      })
        .then((response) => {
          this.queryMemberOptions = response.rows || [];
          this.queryMemberLoading = false;
        })
        .catch((error) => {
          console.error("加载查询表单初始会员数据失败:", error);
          this.queryMemberOptions = [];
          this.queryMemberLoading = false;
        });
    },
    /** 远程搜索会员 */
    remoteSearchMember(query) {
      // 如果查询为空，显示初始数据
      if (!query || query.trim() === '') {
        this.loadInitialMembers();
        return;
      }
      
      this.memberLoading = true;
      listInfo({
        mbAccount: query.trim(),
        pageNum: 1,
        pageSize: 20,
      })
        .then((response) => {
          this.memberOptions = response.rows || [];
          this.memberLoading = false;
        })
        .catch((error) => {
          console.error("搜索会员失败:", error);
          this.memberOptions = [];
          this.memberLoading = false;
        });
    },
    /** 查询表单远程搜索会员 */
    remoteSearchQueryMember(query) {
      // 如果查询为空，显示初始数据
      if (!query || query.trim() === '') {
        this.loadInitialQueryMembers();
        return;
      }
      
      this.queryMemberLoading = true;
      listInfo({
        mbAccount: query.trim(),
        pageNum: 1,
        pageSize: 20,
      })
        .then((response) => {
          this.queryMemberOptions = response.rows || [];
          this.queryMemberLoading = false;
        })
        .catch((error) => {
          console.error("查询表单搜索会员失败:", error);
          this.queryMemberOptions = [];
          this.queryMemberLoading = false;
        });
    },
    /** 会员选择改变事件 */
    handleMemberChange(value) {
      if (value) {
        // 找到选中的会员信息
        const selectedMember = this.memberOptions.find((item) => item.mbId === value);
        if (selectedMember) {
          console.log("选择的会员:", selectedMember);
          // 保存会员账号到表单
          this.form.mbAccount = selectedMember.mbAccount;
        }
      } else {
        // 清空选择时，也清空会员账号
        this.form.mbAccount = null;
      }
    },
    /** 查询表单会员选择改变事件 */
    handleQueryMemberChange(value) {
      if (value) {
        // 找到选中的会员信息
        const selectedMember = this.memberOptions.find((item) => item.mbId === value);
        if (selectedMember) {
          console.log("查询选择的会员:", selectedMember);
        }
      }
      // 自动触发查询
      this.handleQuery();
    },
    /** 复制礼品码 */
    copyGameCode(gameCode) {
      if (navigator.clipboard) {
        // 使用现代 Clipboard API
        navigator.clipboard
          .writeText(gameCode)
          .then(() => {
            this.$message.success("礼品码已复制到剪贴板");
          })
          .catch(() => {
            this.fallbackCopyTextToClipboard(gameCode);
          });
      } else {
        // 降级方案
        this.fallbackCopyTextToClipboard(gameCode);
      }
    },
    /** 降级复制方案 */
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          this.$message.success("礼品码已复制到剪贴板");
        } else {
          this.$message.error("复制失败，请手动复制");
        }
      } catch (err) {
        this.$message.error("复制失败，请手动复制");
      }

      document.body.removeChild(textArea);
    },
  },
};
</script>
