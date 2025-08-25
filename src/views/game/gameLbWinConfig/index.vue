<template>
  <div class="app-container">
                  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="会员ID" prop="mbId">
          <el-input
            v-model="queryParams.mbId"
            placeholder="请输入会员ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="会员账号" prop="mbAccount">
          <el-input
            v-model="queryParams.mbAccount"
            placeholder="请输入会员账号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="游戏ID" prop="gameid">
          <el-input
            v-model="queryParams.gameid"
            placeholder="请输入游戏ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="游戏名称" prop="twName">
          <el-input
            v-model="queryParams.twName"
            placeholder="请输入游戏名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      <el-form-item label="是否开启" prop="isOpen">
        <el-select v-model="queryParams.isOpen" placeholder="请选择是否开启"> 
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="控制时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="datetimerange"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['game:gameLbWinConfig:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['game:gameLbWinConfig:remove']"
        >删除</el-button>
      </el-col> -->
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
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <!-- <el-table-column label="主键ID" align="center" prop="configId" width="170" :fixed="true"/> -->
        <el-table-column label="会员ID" align="center" prop="mbId" width="170" :fixed="true"/>
        <el-table-column label="会员账号" align="center" prop="mbAccount" width="120"  show-overflow-tooltip/>
        <el-table-column label="游戏ID" align="center" prop="gameid" width="100" />
        <el-table-column label="游戏名称" align="center" prop="twName" width="120"  show-overflow-tooltip/>
      <el-table-column align="center" prop="amountLimit" width="120">
        <template>
          <div slot="header">
            <span>匹配下注金额</span>
            <el-tooltip content="金额匹配成功开始控制" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      
             <!-- 轮次列表列 -->
       <el-table-column label="轮次列表" align="center" width="120">
         <template slot-scope="scope">
           <el-popover
             placement="top-start"
             width="500"
             trigger="hover"
             v-if="scope.row.betRateList"
           >
             <div >
               <h4 style="margin: 0 0 10px 0; color: #303133;">轮次详情</h4>
               <el-table height="300" :data="getRoundTableData(scope.row)" border style="width: 100%; max-height: 300px; overflow-y: auto;" show-summary :summary-method="getRoundSummary">
                 <el-table-column label="轮次" type="index" width="60" align="center"></el-table-column>
                 <el-table-column label="匹配下注金额" prop="amountLimit" align="center"></el-table-column>
                 <el-table-column label="赔率" prop="rate" align="center"></el-table-column>
                 <el-table-column label="对应金额" prop="betAmount" align="center"></el-table-column>
               </el-table>
             </div>
             <div slot="reference" style="cursor: pointer; color: #409EFF;">
               <i class="el-icon-view"></i>
               查看轮次
             </div>
           </el-popover>
           <span v-else style="color: #C0C4CC;">-</span>
         </template>
       </el-table-column>
   
      <!-- <el-table-column label="倍率列表" align="center" prop="betRateList" width="100">
      </el-table-column>
      <el-table-column label="倍率金额列表" align="center" prop="betAmountMatch" width="100">
      </el-table-column>
      <el-table-column label="下注次数" align="center" prop="betCount" width="100">
      </el-table-column>
       -->
      <el-table-column label="要赢的金额" align="center" prop="winAmount" width="100" />
      <el-table-column label="误差率" align="center" prop="allowRate" />
      <el-table-column label="总赢金额" align="center" prop="totalWinAmount" width="100" />
      <el-table-column label="是否开启" align="center" prop="isOpen" >
        <template slot-scope="scope">
          <span>{{ scope.row.isOpen === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="控制开始时间" align="center" prop="beginTime" width="180"></el-table-column>
      <el-table-column label="控制结束时间" align="center" prop="endTime" width="180"></el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" width="240" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleViewDetail(scope.row)"
          >查看详情</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
                                           <!-- 左列 -->
            <el-col :span="12">
              <el-form-item label="会员ID" prop="mbId">
                <el-input v-model="form.mbId" placeholder="请输入会员ID" :readonly="isEdit" style="width: 100%;"/>
              </el-form-item>
              <el-form-item label="会员账号" prop="mbAccount">
                <el-input v-model="form.mbAccount" placeholder="请输入会员账号" :readonly="isEdit" style="width: 100%;"/>
              </el-form-item>
              <el-form-item label="游戏ID" prop="gameid">
                <el-input v-model="form.gameid" placeholder="请输入游戏ID" :readonly="isEdit" style="width: 100%;"/>
              </el-form-item>
              <el-form-item label="游戏名称" prop="twName">
                <el-input v-model="form.twName" placeholder="请输入游戏名称" :readonly="isEdit" style="width: 100%;"/>
              </el-form-item>
            <el-form-item label="是否开启" prop="isOpen">
              <el-select v-model="form.isOpen" placeholder="请选择是否开启" style="width: 100%;"> 
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="控制时间" prop="createTime">
              <el-date-picker clearable
                v-model="form.createTime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择控制时间"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :readonly="isEdit"/>
            </el-form-item>
          </el-col>
          
          <!-- 分割线 -->
          <el-col :span="1" style="display: flex; justify-content: center; align-items: center;">
            <el-divider direction="vertical" style="height: 100%; margin: 0;"></el-divider>
          </el-col>
          
          <!-- 右列 -->
          <el-col :span="11">
            <el-form-item label="匹配下注金额" prop="amountLimit">
              <span slot="label">
                <span>匹配下注金额</span>
                <el-tooltip content="金额匹配成功开始控制" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-select v-model="form.amountLimit" placeholder="请选择匹配下注金额" @change="checkCanClickRandomButton" :disabled="isEdit" style="width: 100%;">
                <el-option
                  v-for="amount in betAmountOptions"
                  :key="amount"
                  :label="amount"
                  :value="amount"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="!isEdit" label="零率" prop="zeroRate">
              <span slot="label">
                <span>零率</span>
                <el-tooltip content="范围为0-1，赔率为0的概率" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.zeroRate" placeholder="零率" />
            </el-form-item>
            <el-form-item label="要赢的金额" prop="winAmount">
              <el-input v-model="form.winAmount" placeholder="请输入要赢的金额" @input="checkCanClickRandomButton" :readonly="isEdit" />
            </el-form-item>
            <el-form-item label="下注次数" prop="betCount">
              <span slot="label">
                <span>下注次数</span>
                <el-tooltip content="最大支持100次" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.betCount" placeholder="请输入下注次数" @input="checkCanClickRandomButton" :readonly="isEdit" />
            </el-form-item>
            <el-form-item label="误差率" prop="allowRate">
              <el-input v-model="form.allowRate" placeholder="请输入误差率" @input="checkCanClickRandomButton" :readonly="isEdit" />
            </el-form-item>
            
            
            <!-- 总赢金额显示 -->
            <el-form-item label="总赢金额" prop="totalWinAmount">
              <el-input v-model="form.totalWinAmount" placeholder="总赢金额" readonly  />
            </el-form-item>
            
            <el-form-item label="倍率列表" prop="betRateList">
              <span slot="label">
                <span>倍率列表</span>
                <el-tooltip content="请输入倍率列表，格式为：1.0,2.0,3.0" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.betRateList" type="textarea" placeholder="请输入内容" readonly />
            </el-form-item>
            
            <!-- 随机生成按钮 -->
            <el-form-item v-if="!isEdit">
              <el-button 
                type="warning" 
                icon="el-icon-refresh" 
                @click="generateRandomParams"
                :loading="randomParamsLoading"
                :disabled="!canClickRandomButton || randomParamsLoading"
                style="width: 100%;">
                {{ randomParamsLoading ? '生成中...' : '随机生成参数' }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="submitLoading" :disabled="submitLoading">确 定</el-button>
        <el-button @click="cancel" :disabled="submitLoading">取 消</el-button>
      </div>
    </el-dialog>

         <!-- 查看详情对话框 -->
     <DetailDialog 
       :visible.sync="detailOpen" 
       :detailData="detailForm"
       @close="handleDetailClose"
     />
  </div>
</template>

<script>

import { listGameLbWinConfig, getGameLbWinConfig, delGameLbWinConfig, addGameLbWinConfig, updateGameLbWinConfig, gameLbWinConfig } from "@/api/game/gameLbWinConfig";
import BetGameInfoSelect from './BetGameInfoSelect/index.vue'
import MemberInfoSelect from '@/components/MemberInfoSelect'
import DetailDialog from './components/DetailDialog.vue'

export default {
  name: "GameLbWinConfig",
  components: {
    BetGameInfoSelect,
    MemberInfoSelect,
    DetailDialog
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
          mbAccount: null,
          gameid: null,
          twName: null,
          amountLimit: null,
          betRateList: null,
          betCount: null,
          isOpen: null,
          beginTime: null,
          endTime: null,
        },
                           // 表单参数
        form: {
          mbId: null,
          mbAccount: null,
          gameid: null,
          twName: null,
          zeroRate: null,
          createTime: [],
          winAmount: null,
          allowRate: null,  
          isOpen: 1,
          totalWinAmount: null,
        },
      // 是否显示随机生成按钮
      canClickRandomButton: false,
      // 是否为编辑模式
      isEdit: false,
      // 提交按钮loading状态
      submitLoading: false,
      // 随机生成参数loading状态
      randomParamsLoading: false,
      // 下注金额选项列表
      betAmountOptions: [],
                           // 表单校验
        rules: {
          mbId: [
            { required: true, message: "会员ID不能为空", trigger: "blur" }
          ],
          mbAccount: [
            { required: true, message: "会员账号不能为空", trigger: "blur" }
          ],
          gameid: [
            { required: true, message: "游戏ID不能为空", trigger: "blur" }
          ],
          twName: [
            { required: true, message: "游戏名称不能为空", trigger: "blur" }
          ],
        isOpen: [
          { required: true, message: "是否开启不能为空", trigger: "change" }
        ],
        amountLimit: [
          { required: true, message: "匹配下注金额不能为空", trigger: "blur" }
        ],
        winAmount: [
          { required: true, message: "要赢的金额不能为空", trigger: "blur" }
        ],
        betCount: [
          { required: true, message: "下注次数不能为空", trigger: "blur" },
          // { type: 'number', min: 1, max: 100, message: "下注次数必须在1-100之间", trigger: "blur" }
        ],
        allowRate: [
          { required: true, message: "误差率不能为空", trigger: "blur" }
        ],
        totalWinAmount: [
          { required: true, message: "总赢金额不能为空", trigger: "blur" }
        ],
        betRateList: [
          { required: true, message: "倍率列表不能为空", trigger: "blur" }
        ],
        zeroRate: [
          { required: true, message: "零率不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "控制时间不能为空", trigger: "blur" }
        ]
      },
                                         // 查看详情对话框相关
         detailOpen: false,
         detailForm: {
           configId: null,
           mbId: null,
           mbAccount: null,
           gameid: null,
           twName: null,
           amountLimit: null,
           betRateList: null,
           betCount: null,
           isOpen: null,
           beginTime: null,
           endTime: null,
           remark: null,
           createBy: null,
           updateTime: null,
           updateBy: null,
           createTime: [],
           winAmount: null,
           allowRate: null,
           totalWinAmount: null,
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
        const tableData = response.rows;
        tableData.forEach(item => {
          const amountLimit = Number(item.amountLimit || 0);
          const betRateList = item.betRateList ? item.betRateList.split(',') : [];
          const templateArr = [];
          if (betRateList.length > 0) {
            betRateList.forEach(rate => {
              templateArr.push(Number(amountLimit * Number(rate).toFixed(6)));
            });
          }
          item.betAmountMatch = templateArr.join(',');
          // item.betRateList = item.betRateList.join(',');
        });
        this.gameLbWinConfigList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.isEdit = false;
      this.reset();
      this.submitLoading = false; // 重置提交按钮loading状态
    },
                   // 表单重置
      reset() {
        this.form = {
          configId: null,
          mbId: null,
          mbAccount: null,
          gameid: null,
          twName: null,
          amountLimit: null,
          betRateList: null,
          betCount: null,
          isOpen: 1,
          beginTime: null,
          endTime: null,
          remark: null,
          createBy: null,
          updateTime: null,
          updateBy: null,
          createTime: [],
          winAmount: null,
          allowRate: null,
          totalWinAmount: null,
        };
      this.isEdit = false;
      this.resetForm("form");
      this.canClickRandomButton = false; // 重置随机生成按钮状态
      this.betAmountOptions = []; // 重置匹配下注金额选项
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
      this.canClickRandomButton = false;
      this.isEdit = false;
      this.open = true;
      this.title = "添加游戏输赢控制";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.canClickRandomButton = false;
      this.isEdit = true;
      const configId = row.configId || this.ids
   
      getGameLbWinConfig(configId).then(response => {
        const formData = response.data;
        if (formData.beginTime && formData.endTime) {
          formData.createTime = [formData.beginTime, formData.endTime]
        } else {
          formData.createTime = []
        }
        this.form = formData;
        this.open = true;
        this.title = "修改游戏输赢控制";
        // 检查是否显示随机生成按钮
        this.checkCanClickRandomButton();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true; // 开始提交
          const params = {
            ...this.form,
            beginTime: this.form.createTime[0],
            endTime: this.form.createTime[1]
          }
          delete params.createTime;
          if (this.form.configId != null) {
            updateGameLbWinConfig(params).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 修改失败时重置loading状态
              this.submitLoading = false;
            }).finally(() => {
              this.submitLoading = false; // 提交完成
            });
          } else {
            addGameLbWinConfig(params).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 新增失败时重置loading状态
              this.submitLoading = false;
            }).finally(() => {
              this.submitLoading = false; // 提交完成
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
    },
    
    /** 随机生成参数 */
    generateRandomParams() {
      // 设置loading状态
      this.randomParamsLoading = true;
      
                           // 调用gameLbWinConfig接口进行参数验证和获取回显数据
        const randomParams = {
          amountLimit: this.form.amountLimit,
          winAmount: this.form.winAmount,
          betCount: this.form.betCount,
          allowRate: this.form.allowRate,
          mbId: this.form.mbId,
          gameid: this.form.gameid,
          zeroRate: this.form.zeroRate
        };
      
      // 调用gameLbWinConfig接口进行参数验证
      gameLbWinConfig(randomParams).then(response => {
        const formData = response.data;
        // 回显接口返回的数据
        if (formData.betRateList) {
          this.form.betRateList = formData.betRateList;
        }
        if (formData.totalWinAmount) {
          this.form.totalWinAmount = formData.totalWinAmount;
        }
        this.$modal.msgSuccess("参数验证成功，数据已回显！");
      }).catch(error => {
        this.$modal.msgError("参数验证失败：" + (error.message || "未知错误"));
      }).finally(() => {
        // 无论成功还是失败，都要重置loading状态
        this.randomParamsLoading = false;
      });
    },
    
                   /** 检查是否显示随机生成按钮 */
      checkCanClickRandomButton() {
        // 检查必填字段是否都已填写
        this.canClickRandomButton = !!(this.form.amountLimit && 
                                   this.form.winAmount && 
                                   this.form.betCount && 
                                   this.form.allowRate && 
                                   this.form.mbId && 
                                   this.form.gameid);
      },
    
    /** 处理游戏选择变化 */
    handleGameChange(data) {
      if (data && data.selectedItems && !this.isEdit) {
        // 从选中的游戏信息中获取betAmount
        const selectedGame = data.selectedItems;
        if (selectedGame.betAmount) {
          // 解析betAmount字符串，格式如："1,2,3"
          this.betAmountOptions = selectedGame.betAmount.split(',').map(item => item.trim()).filter(item => item);
          // 清空之前选择的匹配金额
          this.form.amountLimit = null;
          // 触发检查随机生成按钮状态
          this.$nextTick(() => {
            this.checkCanClickRandomButton();
          });
        } else {
          // 如果没有betAmount，清空选项
          this.betAmountOptions = [];
          this.form.amountLimit = null;
        }
      }
    },

    /** 查看详情按钮操作 */
    handleViewDetail(row) {
      this.showDetailDialog(row);
    },

                                       /** 显示详情对话框 */
     showDetailDialog(row) {
       this.detailForm = row;
       this.detailOpen = true;
     },
     
     /** 处理详情对话框关闭 */
     handleDetailClose() {
       this.detailOpen = false;
     },

      /** 计算表格汇总行 */
      getSummary(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '汇总';
            return;
          }
          if (index === 1) {
            // 匹配下注金额列，显示第一个值
            // sums[index] = data.length > 0 ? data[0].amountLimit : '';
            return;
          }
          if (index === 2) {
            // 倍率列，显示"合计"
            // sums[index] = '合计';
            return;
          }
          if (index === 3) {
            // 对应金额列，计算总和
            const values = data.map(item => {
              const amount = parseFloat(item.betAmount);
              return isNaN(amount) ? 0 : amount;
            });
            if (!values.every(value => value === 0)) {
              const total = values.reduce((prev, curr) => {
                return Number((Number(prev) + Number(curr)).toFixed(8));
              }, 0);
              sums[index] = total;
            } else {
              sums[index] = 'N/A';
            }
            return;
          }
          sums[index] = '';
        });
        return sums;
      },
      
                    /** 生成轮次表格数据 */
        getRoundTableData(row) {
          if (!row.betRateList) return [];
          
          const rates = row.betRateList.split(',');
          const amountLimit = Number(row.amountLimit || 0);
          const amounts = row.betAmountMatch ? row.betAmountMatch.split(',') : [];
          
          return rates.map((rate, index) => ({
            amountLimit: amountLimit,
            rate: rate,
            betAmount: amounts[index] || (amountLimit > 0 ? Number(Number(Number(amountLimit) * Number(rate)).toFixed(8)) : 'N/A')
          }));
        },
        
        /** 计算轮次表格汇总行 */
        getRoundSummary(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '汇总';
              return;
            }
            if (index === 1) {
              // 匹配下注金额列，不显示汇总内容
              return;
            }
            if (index === 2) {
              // 赔率列，不显示汇总内容
              return;
            }
            if (index === 3) {
              // 对应金额列，计算总和
              const values = data.map(item => {
                const amount = parseFloat(item.betAmount);
                return isNaN(amount) ? 0 : amount;
              });
              if (!values.every(value => value === 0)) {
                const total = values.reduce((prev, curr) => {
                  return Number(Number(Number(Number(prev) + Number(curr)).toFixed(8)));
                }, 0);
                sums[index] = total;
              } else {
                sums[index] = 'N/A';
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

<style scoped>
.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.el-descriptions {
  margin-bottom: 20px;
}

.el-divider {
  margin: 20px 0;
}

.el-table {
  margin-bottom: 20px;
}
</style>
