<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      
      <el-form-item label="账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      
      <el-form-item label="邀请人id" prop="inMbId">
        <el-input
          v-model="queryParams.inMbId"
          placeholder="请输入邀请人id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册url" prop="registerUrl">
        <el-input
          v-model="queryParams.registerUrl"
          placeholder="请输入注册url"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合营id" prop="hyId">
        <el-input
          v-model="queryParams.hyId"
          placeholder="请输入合营id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录类型" prop="recordTypeList">
        <el-select 
          v-model="queryParams.recordTypeList" 
          placeholder="请选择记录类型" 
          multiple
          collapse-tags
          clearable
          style="width: 200px"
        >
          <el-option label="手动充值" :value="8"></el-option>
          <el-option label="手动退分" :value="9"></el-option>
          <el-option label="手动活动充值" :value="16"></el-option>
          <el-option label="手动活动退分" :value="17"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['member:info:add']"
        >新增</el-button>
      </el-col> -->
      
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:info:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      
      <el-table-column label="会员ID" align="center" prop="mbId" show-overflow-tooltip width="150" :fixed="true"/>
      <el-table-column label="平台积分" align="center" prop="mbPoint" show-overflow-tooltip />

      <el-table-column label="账号" align="center" prop="mbAccount" show-overflow-tooltip width="150"/>
      <el-table-column label="合营id" align="center" prop="hyId" show-overflow-tooltip width="150"/>

      <el-table-column label="头像地址" align="center" prop="avatar" show-overflow-tooltip >
        <template slot-scope="scope">
          <el-image v-if="scope.row.avatar" :src="scope.row.avatar" style="width: 50px; height: 50px" />
          <span v-else>无头像</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" prop="nickName" show-overflow-tooltip />
      <el-table-column label="帐号状态" align="center" prop="status" show-overflow-tooltip >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.billard_member_info_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="incode" show-overflow-tooltip width="100"/>

      <el-table-column label="邀请人id" align="center" prop="inMbId" show-overflow-tooltip />
      <el-table-column label="注册url" align="center" prop="registerUrl" show-overflow-tooltip />
      <el-table-column label="注册时间" align="center" prop="registerTime" width="180" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registerTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" align="center" prop="loginDate" width="180" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" align="center" prop="loginIp" width="180" show-overflow-tooltip />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>
      
      <el-table-column label="操作" :show-overflow-tooltip="false" align="center" fixed="right" width="280" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
          >查看详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:info:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="handleAddPoint(scope.row)"
            v-hasPermi="['member:info:edit']"
          >手动上下分</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="handleMySubList(scope.row)"
          >我的下级列表</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-upload2"
            @click="handleTransferPoints(scope.row)"
            v-hasPermi="['member:transferPoints']"
          >合营上分</el-button> -->

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

    <!-- 添加或修改客户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <div v-loading="editLoading" style="min-height: 200px;">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="头像地址" prop="avatar">
                <image-upload v-model="form.avatar" :limit="1" placeholder="请输入头像地址" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 手动上下分对话框 -->
    <el-dialog 
      title="手动上下分" 
      :visible.sync="openAddPoint" 
      width="500px" 
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleAddPointDialogClose"
    >
      <div v-loading="submitAddPointLoading" style="min-height: 200px;">
        <el-form ref="addPointForm" :model="addPointForm" :rules="addPointRules" label-width="100px">
          <el-form-item label="会员ID" prop="mbId">
            <el-input v-model="addPointForm.mbId" placeholder="会员ID" disabled />
          </el-form-item>
          <el-form-item label="会员账号" prop="mbAccount">
            <el-input v-model="addPointForm.mbAccount" placeholder="会员账号" disabled />
          </el-form-item>
          <el-form-item label="操作类型" prop="recordType">
            <el-select 
              v-model="addPointForm.recordType" 
              placeholder="请选择操作类型" 
              style="width: 100%"
              @change="handleRecordTypeChange"
            >
              <el-option label="手动充值" :value="8">
                <span style="color: #67C23A;">
                  <i class="el-icon-plus"></i> 手动充值
                </span>
              </el-option>
              <el-option label="手动活动充值" :value="16">
                <span style="color: #67C23A;">
                  <i class="el-icon-plus"></i> 手动活动充值
                </span>
              </el-option>
              <el-option label="手动退分" :value="9">
                <span style="color: #F56C6C;">
                  <i class="el-icon-minus"></i> 手动退分
                </span>
              </el-option>
              <el-option label="手动活动退分" :value="17">
                <span style="color: #F56C6C;">
                  <i class="el-icon-minus"></i> 手动活动退分
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="积分数量" prop="mbPoints">
            <el-input-number 
              v-model="addPointForm.mbPoints" 
              placeholder="请输入积分数量" 
              :min="0.01"
              :precision="2"
              :step="0.01"
              style="width: 100%"
              :controls-position="'right'"
            />
          </el-form-item>
          <el-form-item label="操作备注" prop="remark">
            <el-input 
              v-model="addPointForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入操作备注（可选）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddPointDialogClose">取 消</el-button>
        <el-button 
          type="primary" 
          :loading="submitAddPointLoading" 
          @click="submitAddPoint"
          :disabled="!addPointForm.recordType || !addPointForm.mbPoints"
        >
          {{ addPointForm.recordType === 8 ? '确认充值' : addPointForm.recordType === 9 ? '确认退分' : addPointForm.recordType === 16 ? '确认活动充值' : addPointForm.recordType === 17 ? '确认活动退分' : '确 定' }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 合营上分对话框 -->
    <el-dialog title="合营上分" :visible.sync="openTransferPoints" width="500px" append-to-body>
      <el-form ref="transferPointsForm" :model="transferPointsForm" :rules="transferPointsRules" label-width="100px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="transferPointsForm.userId" placeholder="用户ID" disabled />
        </el-form-item>
        <el-form-item label="积分数量" prop="points">
          <el-input-number 
            v-model="transferPointsForm.points" 
            placeholder="请输入积分数量" 
            :min="0.01"
            :precision="2"
            :step="0.01"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitTransferPointsLoading" @click="submitTransferPoints">确 定</el-button>
        <el-button @click="cancelTransferPoints">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog title="会员详情" :visible.sync="openDetail" width="800px" append-to-body>
      <div v-loading="detailLoading" style="min-height: 300px;">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="会员ID">{{ detailData.mbId }}</el-descriptions-item>
          <el-descriptions-item label="账号">{{ detailData.mbAccount }}</el-descriptions-item>
          <el-descriptions-item label="用户昵称">{{ detailData.nickName }}</el-descriptions-item>
          <el-descriptions-item label="帐号状态">
            <dict-tag :options="dict.type.billard_member_info_status" :value="detailData.status"/>
          </el-descriptions-item>
          <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
          <el-descriptions-item label="邀请码">{{ detailData.incode }}</el-descriptions-item>
          <el-descriptions-item label="邀请人ID">{{ detailData.inMbId }}</el-descriptions-item>
          <el-descriptions-item label="合营ID">{{ detailData.hyId }}</el-descriptions-item>
          <el-descriptions-item label="平台积分">{{ detailData.mbPoint }}</el-descriptions-item>
          <el-descriptions-item label="最后登录IP">{{ detailData.loginIp }}</el-descriptions-item>
          <el-descriptions-item label="最后登录时间">
            {{ parseTime(detailData.loginDate, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            {{ parseTime(detailData.registerTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </el-descriptions-item>
          <el-descriptions-item label="注册URL" :span="2">{{ detailData.registerUrl }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ detailData.remark }}</el-descriptions-item>
          <el-descriptions-item label="头像" :span="2">
            <el-image v-if="detailData.avatar" :src="detailData.avatar" style="width: 100px; height: 100px" />
            <span v-else>无头像</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDetail = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 下级列表对话框 -->
    <el-dialog :title="`我的下级列表 (邀请人ID: ${subListQueryParams.inviterMbId})`" :visible.sync="openSubList" width="900px" append-to-body>
      <div v-loading="subListLoading" style="min-height: 300px;">
        <el-table v-loading="subListLoading" :data="subList" border>
          <el-table-column label="邀请记录ID" align="center" prop="recordId" show-overflow-tooltip width="150" :fixed="true"/>
          <el-table-column label="邀请人ID" align="center" prop="inviterMbId" width="150"/>
          <el-table-column label="邀请人账号" align="center" prop="mbAccount" width="150"/>
          <el-table-column label="被邀请人ID" align="center" prop="inviteeMbId" width="150" />
          <el-table-column label="被邀请人账号" align="center" prop="inviteeMbAccount" width="150"/>
          <el-table-column label="邀请时间" align="center" prop="inviteTime" width="180" show-overflow-tooltip >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.inviteTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="奖励积分" align="center" prop="rewardPoints" show-overflow-tooltip width="120"/> -->
          <!-- <el-table-column label="被邀请消费" align="center" prop="inviteeConsum" show-overflow-tooltip width="120"/> -->
          <!-- <el-table-column label="佣金比例" align="center" prop="commissionRate" show-overflow-tooltip width="120"/> -->
          <!-- <el-table-column label="累计佣金" align="center" prop="accumulateCommission" show-overflow-tooltip width="120"/> -->
          <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        </el-table>
        <pagination
          v-show="subListTotal>0"
          :total="subListTotal"
          :page.sync="subListQueryParams.pageNum"
          :limit.sync="subListQueryParams.pageSize"
          @pagination="getSubList"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openSubList = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo, addPoint, transferPoints } from "@/api/member/info";
import { listInviteRecord } from "@/api/member/inviteRecord";
import { listPointsRecord, listPointsRecordCount } from "@/api/member/pointsRecord";

export default {
  dicts: ['billard_member_info_status'],

  name: "Info",
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
      // 客户信息表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示手动上下分弹出层
      openAddPoint: false,
      // 是否显示合营上分弹出层
      openTransferPoints: false,
      // 是否显示详情弹出层
      openDetail: false,
      // 是否显示下级列表弹出层
      openSubList: false,
      // 详情加载状态
      detailLoading: false,
      // 编辑表单加载状态
      editLoading: false,
      // 下级列表加载状态
      subListLoading: false,
      // 提交表单loading状态
      submitLoading: false,
      // 提交上下分操作loading状态
      submitAddPointLoading: false,
      // 提交合营上分操作loading状态
      submitTransferPointsLoading: false,
      // 下级列表数据
      subList: [],
      // 下级列表总数
      subListTotal: 0,
      // 下级列表查询参数
      subListQueryParams: {
        pageNum: 1,
        pageSize: 10,
        inviterMbId: null
      },
      // 积分记录数据
      pointsRecordList: [],
      // 积分记录统计数据
      pointsRecordCount: {},
      // 积分记录加载状态
      pointsRecordLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        avatar: null,
        mbAccount: null,
        nickName: null,
        mbPassword: null,
        status: null,
        phone: null,
        incode: null,
        loginIp: null,
        loginDate: null,
        inMbId: null,
        registerUrl: null,
        hyId: null,
        mbPoint: null,
        registerTime: null,
        recordTypeList: []
      },
      // 表单参数
      form: {},
      // 手动上下分表单参数
      addPointForm: {
        mbId: null,
        mbAccount: null,
        mbPoints: null,
        recordType: null,
        remark: null
      },
      // 合营上分表单参数
      transferPointsForm: {
        userId: null,
        points: null
      },
      // 详情数据
      detailData: {},
      // 表单校验
      rules: {
      },
      // 手动上下分表单校验
      addPointRules: {
        recordType: [
          { required: true, message: "请选择操作类型", trigger: "change" }
        ],
        mbPoints: [
          { required: true, message: "积分数量不能为空", trigger: "blur" },
          { type: 'number', min: 0.01, message: "积分数量必须大于0", trigger: "blur" },
          { type: 'number', max: 999999.99, message: "积分数量不能超过999999.99", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value && typeof value === 'number') {
                // 检查是否超过2位小数
                const str = value.toString();
                const decimalIndex = str.indexOf('.');
                if (decimalIndex !== -1 && str.length - decimalIndex - 1 > 2) {
                  callback(new Error('积分数量最多支持2位小数'));
                  return;
                }
              }
              callback();
            }, 
            trigger: "blur" 
          }
        ],
        remark: [
          { max: 200, message: "备注长度不能超过200个字符", trigger: "blur" }
        ]
      },
      // 合营上分表单校验
      transferPointsRules: {
        points: [
          { required: true, message: "积分数量不能为空", trigger: "blur" },
          { type: 'number', min: 0.01, message: "积分数量必须大于0", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value && typeof value === 'number') {
                // 检查是否超过2位小数
                const str = value.toString();
                const decimalIndex = str.indexOf('.');
                if (decimalIndex !== -1 && str.length - decimalIndex - 1 > 2) {
                  callback(new Error('积分数量最多支持2位小数'));
                  return;
                }
              }
              callback();
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
    /** 查询客户信息列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
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
        mbId: null,
        avatar: null,
        mbAccount: null,
        nickName: null,
        mbPassword: null,
        status: null,
        phone: null,
        incode: null,
        remark: null,
        delFlag: null,
        loginIp: null,
        loginDate: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        inMbId: null,
        registerUrl: null,
        hyId: null,
        mbPoint: null,
        registerTime: null
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
      this.ids = selection.map(item => item.mbId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客户信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改客户信息";
      this.editLoading = true;
      const mbId = row.mbId || this.ids
      getInfo(mbId).then(response => {
        this.form = response.data;
      }).catch(() => {
        // 处理错误
      }).finally(() => {
        this.editLoading = false;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.mbId != null) {
            updateInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 处理错误
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 处理错误
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const mbIds = row.mbId || this.ids;
      this.$modal.confirm('是否确认删除客户信息编号为"' + mbIds + '"的数据项？').then(function() {
        return delInfo(mbIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/info/export', {
        ...this.queryParams
      }, `info_${new Date().getTime()}.xlsx`)
    },
    /** 手动上下分按钮操作 */
    handleAddPoint(row) {
      this.resetAddPointForm();
      this.addPointForm.mbId = row.mbId;
      this.addPointForm.mbAccount = row.mbAccount;
      this.openAddPoint = true;
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.detailData = {};
      this.openDetail = true;
      this.detailLoading = true;
      const mbId = row.mbId;
      getInfo(mbId).then(response => {
        this.detailData = response.data;
      }).catch(() => {
        // 处理错误
      }).finally(() => {
        this.detailLoading = false;
      });
    },
    // 重置手动上下分表单
    resetAddPointForm() {
      this.addPointForm = {
        mbId: null,
        mbAccount: null,
        mbPoints: null,
        recordType: null,
        remark: null
      };
      this.resetForm("addPointForm");
    },
    // 处理对话框关闭
    handleAddPointDialogClose() {
      this.openAddPoint = false;
      this.resetAddPointForm();
    },
    // 操作类型改变事件
    handleRecordTypeChange(value) {
      // 清空积分数量，让用户重新输入
      this.addPointForm.mbPoints = null;
      // 根据操作类型给出提示
      if (value === 8) {
        this.$message.info('请输入要充值的积分数量');
      } else if (value === 9) {
        this.$message.info('请输入要退分的积分数量');
      }
    },
    /** 提交手动上下分 */
    submitAddPoint() {
      const  typeStr = {
        8: "充值",
        9: "退分",
        16: "活动充值",
        17: "活动退分"
      }
      this.$refs["addPointForm"].validate(valid => {
        if (valid) {
          const operationType = typeStr[this.addPointForm.recordType];
          const confirmMsg = `确定要为会员 ${this.addPointForm.mbAccount} ${operationType} ${this.addPointForm.mbPoints} 积分吗？`;
          
          this.$confirm(confirmMsg, '确认操作', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitAddPointLoading = true;
            addPoint(this.addPointForm).then(response => {
              const successMsg = typeStr[this.addPointForm.recordType] + "成功";
              this.$modal.msgSuccess(successMsg);
              this.openAddPoint = false;
              this.resetAddPointForm();
              this.getList();
            }).catch((error) => {
              console.error('操作失败:', error);
              this.$modal.msgError(error.msg || '操作失败，请重试');
            }).finally(() => {
              this.submitAddPointLoading = false;
            });
          }).catch(() => {
            // 用户取消操作
          });
        }
      });
    },
    /** 合营上分按钮操作 */
    handleTransferPoints(row) {
      this.resetTransferPointsForm();
      this.transferPointsForm.userId = row.mbId;
      this.openTransferPoints = true;
    },
    // 重置合营上分表单
    resetTransferPointsForm() {
      this.transferPointsForm = {
        userId: null,
        points: null
      };
      this.resetForm("transferPointsForm");
    },
    // 取消合营上分
    cancelTransferPoints() {
      this.openTransferPoints = false;
      this.resetTransferPointsForm();
    },
    /** 提交合营上分 */
    submitTransferPoints() {
      this.$refs["transferPointsForm"].validate(valid => {
        if (valid) {
          this.submitTransferPointsLoading = true;
          transferPoints(this.transferPointsForm).then(response => {
            this.$modal.msgSuccess("合营上分成功");
            this.openTransferPoints = false;
            this.getList();
          }).catch(() => {
            // 处理错误
          }).finally(() => {
            this.submitTransferPointsLoading = false;
          });
        }
      });
    },
    /** 获取下级列表 */
    getSubList() {
      this.subListLoading = true;
      listInviteRecord(this.subListQueryParams).then(response => {
        this.subList = response.rows;
        this.subListTotal = response.total;
      }).catch(() => {
        this.$modal.msgError("获取下级列表失败");
        this.subList = [];
        this.subListTotal = 0;
      }).finally(() => {
        this.subListLoading = false;
      });
    },
    /** 获取下级列表按钮操作 */
    handleMySubList(row) {
      this.subListQueryParams.inviterMbId = row.mbId;
      this.subListQueryParams.pageNum = 1;
      this.openSubList = true;
      this.getSubList();
    }
  }
};
</script>
