<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="赛事名称" prop="matchName">
        <el-input
          v-model="queryParams.matchName"
          placeholder="请输入赛事名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="赛事状态" prop="matchStatus">
        <el-select v-model="queryParams.matchStatus" placeholder="请选择赛事状态" clearable>
          <el-option v-for="dict in dict.type.match_status" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="桌球员A" prop="playerA">
        <el-input
          v-model="queryParams.playerA"
          placeholder="请输入桌球员A"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="桌球员B" prop="playerB">
        <el-input
          v-model="queryParams.playerB"
          placeholder="请输入桌球员B"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['billard:match:add']"
        >新增</el-button>
      </el-col>
      
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:match:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="matchList" @selection-change="handleSelectionChange">
      
      <el-table-column label="赛事ID" align="center" prop="matchId" :fixed="true"/>
      <el-table-column label="赛事名称" align="center" prop="matchName" width="200"/>
      <el-table-column label="赛事日期-时间" align="center" prop="matchDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.matchDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="赛事时间" align="center" prop="matchTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.matchTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="直播地址" align="center" prop="liveUrl" show-overflow-tooltip/>
      <!-- <el-table-column label="桌球员A" align="center" prop="playerA" /> -->
      <el-table-column label="桌球员A" align="center" prop="playerAName" />

      <el-table-column label="桌球员A头像" align="center" prop="playerAAvatar" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.playerAAvatar" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="桌球员B" align="center" prop="playerB" /> -->
      <el-table-column label="桌球员B" align="center" prop="playerBName" />

      <el-table-column label="桌球员B头像" align="center" prop="playerBAvatar" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.playerBAvatar" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="桌球员A分数" align="center" prop="playerAPoint" width="100"/>
      <el-table-column label="桌球员B分数" align="center" prop="playerBPoint" width="100"/>
      <el-table-column label="赛事状态" align="center" prop="matchStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.match_status" :value="scope.row.matchStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createUser" />
      <el-table-column label="修改人" align="center" prop="updateUser" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" fixed="right" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleViewDetail(scope.row)"
            v-hasPermi="['billard:match:query']"
          >查看详情</el-button>
          <el-button
            v-if="[1, 2].includes(scope.row.matchStatus)"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:match:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:match:remove']"
          >删除</el-button>
          <el-button
            v-if="[1, 2].includes(scope.row.matchStatus)"
            size="mini"
            type="text"
            icon="el-icon-refresh"
            @click="handleStatusUpdate(scope.row)"
            v-hasPermi="['billard:match:edit']"
          >更新状态</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleGuessManage(scope.row)"
            v-hasPermi="['billard:match:edit']"
          >竞猜管理</el-button>
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

    <!-- 添加或修改赛事对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px" v-loading="formLoading">
        <el-form-item label="赛事名称" prop="matchName">
          <el-input v-model="form.matchName" placeholder="请输入赛事名称" />
        </el-form-item>
        <el-form-item label="赛事日期-时间" prop="matchDate">
          <el-date-picker clearable
            v-model="form.matchDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择赛事日期-时间">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="赛事时间" prop="matchTime">
          <el-time-picker
            v-model="form.matchTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择赛事时间">
          </el-time-picker>
        </el-form-item> -->
        <el-form-item label="直播地址" prop="liveUrl">
          <el-input v-model="form.liveUrl" placeholder="请输入直播地址" />
        </el-form-item>
        <!-- <el-form-item label="桌球员A头像" prop="playerAAvatar">
          <image-upload v-model="form.playerAAvatar" />
        </el-form-item>
        <el-form-item label="桌球员B头像" prop="playerBAvatar">
          <image-upload v-model="form.playerBAvatar" />
        </el-form-item>  -->
        <el-form-item label="桌球员A" prop="playerA">
          <player-select v-model="form.playerA" @change="handlePlayerAChange" />
        </el-form-item>
        <el-form-item label="桌球员B" prop="playerB">
          <player-select v-model="form.playerB" @change="handlePlayerBChange" />
        </el-form-item>
        <el-form-item label="桌球员A分数" prop="playerAPoint">
          <el-input v-model.number="form.playerAPoint" placeholder="请输入桌球员A分数" />
        </el-form-item>
        <el-form-item label="桌球员B分数" prop="playerBPoint">
          <el-input v-model.number="form.playerBPoint" placeholder="请输入桌球员B分数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog title="赛事详情" :visible.sync="detailOpen" width="1200px" append-to-body>
      <div v-loading="detailLoading">
        <!-- 赛事基本信息 -->
        <el-card class="box-card" style="margin-bottom: 20px;">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;">赛事基本信息</span>
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="赛事ID">{{ detailData.matchId }}</el-descriptions-item>
            <el-descriptions-item label="赛事名称">{{ detailData.matchName }}</el-descriptions-item>
            <el-descriptions-item label="赛事日期-时间">
              {{ detailData.matchDate }}
            </el-descriptions-item>
            <el-descriptions-item label="直播地址">{{ detailData.liveUrl }}</el-descriptions-item>
            <el-descriptions-item label="桌球员A">{{ detailData.playerA }}</el-descriptions-item>
            <el-descriptions-item label="桌球员A头像">
              <el-image :src="detailData.playerAAvatar" style="width: 50px; height: 50px;" />
            </el-descriptions-item>
            <el-descriptions-item label="桌球员B">{{ detailData.playerB }}</el-descriptions-item>
            <el-descriptions-item label="桌球员B头像">
              <el-image :src="detailData.playerBAvatar" style="width: 50px; height: 50px;" />
            </el-descriptions-item>
            <el-descriptions-item label="桌球员A分数">{{ detailData.playerAPoint }}</el-descriptions-item>
            <el-descriptions-item label="桌球员B分数">{{ detailData.playerBPoint }}</el-descriptions-item>
            <el-descriptions-item label="赛事状态">
              <dict-tag :options="dict.type.match_status" :value="detailData.matchStatus"/>
            </el-descriptions-item>
            <el-descriptions-item label="创建人">{{ detailData.createUser }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 竞猜信息 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;">竞猜信息 ({{ guessList.length }}个)</span>
          </div>
          <div v-if="guessList.length === 0" style="text-align: center; color: #999; padding: 40px;">
            暂无竞猜信息
          </div>
          <div v-else>
            <el-collapse v-model="activeNames">
              <el-collapse-item 
                v-for="guess in guessList" 
                :key="guess.guessId" 
                :title="`${guess.guessContent} (${guess.guessOptions ? guess.guessOptions.length : 0}个选项)`" 
                :name="guess.guessId.toString()"
              >
                <div style="margin-bottom: 15px;">
                  <el-tag 
                    :type="guess.guessStatus === 1 ? 'success' : guess.guessStatus === 2 ? 'warning' : 'info'"
                    style="margin-right: 10px;"
                  >
                    状态: 
                    <span v-if="guess.guessStatus === 1">进行中</span>
                    <span v-else-if="guess.guessStatus === 2">已结束</span>
                    <span v-else>未知</span>
                  </el-tag>
                  <el-tag v-if="guess.drawingUser" type="warning">
                    开奖人: {{ guess.drawingUser }}
                  </el-tag>
                </div>

                <!-- 竞猜选项 -->
                <div v-if="guess.guessOptions && guess.guessOptions.length > 0">
                  <h4 style="margin: 10px 0;">竞猜选项:</h4>
                  <el-row :gutter="20">
                    <el-col 
                      v-for="option in guess.guessOptions" 
                      :key="option.optionId" 
                      :xs="24" :sm="12" :md="8" :lg="6"
                      style="margin-bottom: 15px;"
                    >
                      <el-card class="option-card" :class="{'win-option': option.winFlag === 1}">
                        <div style="text-align: center;">
                          <div style="font-weight: bold; margin-bottom: 8px;">{{ option.optionsInfo }}</div>
                          <div style="margin-bottom: 8px;">
                            <el-tag size="small">赔率: {{ option.odds }}</el-tag>
                          </div>
                          <div v-if="option.winFlag === 1">
                            <el-tag type="success" size="small">
                              <i class="el-icon-trophy"></i> 中奖选项
                            </el-tag>
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
                <div v-else style="color: #999; text-align: center; padding: 20px;">
                  暂无竞猜选项
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailOpen = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 更新赛事状态对话框 -->
    <match-status-update
      :visible="statusDialogVisible"
      :matchId="selectedMatchId"
      @close="statusDialogVisible = false"
      @success="handleStatusSuccess"
    />
  </div>
</template>

<script>
// match_status
import { listMatch, getMatch, delMatch, addMatch, updateMatch } from "@/api/billard/match";
import { listGuess } from "@/api/billard/guess";
import { listGuessOption } from "@/api/billard/guessOption";
import MatchStatusUpdate from './components/MatchStatusUpdate';
import PlayerSelect from '@/components/PlayerSelect';

export default {
  name: "Match",
  dicts: ["match_status"],
  components: {
    MatchStatusUpdate,
    PlayerSelect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表单加载状态
      formLoading: false,
      // 提交按钮加载状态
      submitLoading: false,
      // 详情弹出层是否显示
      detailOpen: false,
      // 详情数据
      detailData: {},
      // 详情加载状态
      detailLoading: false,
      // 竞猜列表
      guessList: [],
      // 折叠面板活动项
      activeNames: [],
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
      // 赛事表格数据
      matchList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态更新对话框可见性
      statusDialogVisible: false,
      // 选中的赛事ID
      selectedMatchId: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        matchName: null,
        matchDate: null,
        matchTime: null,
        liveUrl: null,
        playerA: null,
        playerB: null,
        playerAAvatar: null,
        playerBAvatar: null,
        playerAPoint: null,
        playerBPoint: null,
        matchStatus: null,
        createUser: null,
        updateUser: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        matchName: [
          { required: true, message: "赛事名称不能为空", trigger: "blur" }
        ],
        matchDate: [
          { required: true, message: "赛事日期-时间不能为空", trigger: "blur" }
        ],
        matchTime: [
          { required: true, message: "赛事时间不能为空", trigger: "blur" }
        ],
        liveUrl: [
          // { required: true, message: "直播地址不能为空", trigger: "blur" },
          { 
            pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.?=&%-]*)*\/?$/, 
            message: "请输入正确的URL格式", 
            trigger: "blur" 
          }
        ],
        playerA: [
          // { required: true, message: "桌球员A不能为空", trigger: "blur" },
          { validator: (rule, value, callback) => {
              if (value && this.form.playerB && value === this.form.playerB) {
                callback(new Error("桌球员A和桌球员B不能相同"));
              } else {
                callback();
              }
            }, 
            trigger: "blur" 
          }
        ],
        playerB: [
          // { required: true, message: "桌球员B不能为空", trigger: "blur" },
          { validator: (rule, value, callback) => {
              if (value && this.form.playerA && value === this.form.playerA) {
                callback(new Error("桌球员A和桌球员B不能相同"));
              } else {
                callback();
              }
            }, 
            trigger: "blur" 
          }
        ],
        playerAPoint: [
          // { required: true, message: "桌球员A分数不能为空", trigger: "blur" },
          { type: 'number', message: "桌球员A分数必须为数字", trigger: "blur" },
          { validator: (rule, value, callback) => {
              if (value < 0 || !Number.isInteger(value)) {
                callback(new Error("分数必须是大于等于0的整数"));
              } else {
                callback();
              }
            }, 
            trigger: "blur" 
          }
        ],
        playerBPoint: [
          // { required: true, message: "桌球员B分数不能为空", trigger: "blur" },
          { type: 'number', message: "桌球员B分数必须为数字", trigger: "blur" },
          { validator: (rule, value, callback) => {
              if (value < 0 || !Number.isInteger(value)) {
                callback(new Error("分数必须是大于等于0的整数"));
              } else {
                callback();
              }
            }, 
            trigger: "blur" 
          }
        ],
        playerAAvatar: [
          { required: true, message: "桌球员A头像不能为空", trigger: "blur" }
        ],
        playerBAvatar: [
          { required: true, message: "桌球员B头像不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询赛事列表 */
    getList() {
      this.loading = true;
      listMatch(this.queryParams).then(response => {
        response.rows.forEach(item => {
          const matchDate=item.matchDate;
          const matchTime=item.matchTime;
          if (matchDate && matchTime) {
            const temp = matchDate.split(" ");
            const temp2 = matchTime.split(" ");
            const temp3 = temp[0] + " " + temp2[1];
            item.matchDate=temp3;
          }
        });
        this.matchList = response.rows;
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
        matchId: null,
        matchName: null,
        matchDate: null,
        matchTime: null,
        liveUrl: null,
        playerA: null,
        playerB: null,
        playerAPoint: null,
        playerBPoint: null,
        matchStatus: null,
        createUser: null,
        createTime: null,
        updateUser: null,
        updateTime: null
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
      this.ids = selection.map(item => item.matchId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加赛事";
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.detailData = {};
      this.detailOpen = true;
      this.detailLoading = true;
      
      const matchId = row.matchId;
      getMatch(matchId).then(response => {
        const matchDate=response.data.matchDate;
        const matchTime=response.data.matchTime;
        if (matchDate && matchTime) {
          const temp = matchDate.split(" ");
          const temp2 = matchTime.split(" ");
          const temp3 = temp[0] + " " + temp2[1];
          this.detailData.matchDate=temp3;
        }
        this.detailData = response.data;
        this.detailLoading = false;
      }).catch(() => {
        this.detailLoading = false;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改赛事";
      this.formLoading = true;
      
      const matchId = row.matchId || this.ids
      getMatch(matchId).then(response => {
        const matchDate=response.data.matchDate;
        const matchTime=response.data.matchTime;
        if (matchDate && matchTime) {
          // matchDate: "2025-06-25 16:00:00"
          // matchTime: "1969-12-31 18:00:00"
          const temp = matchDate.split(" ");
          const temp2 = matchTime.split(" ");
          const temp3 = temp[0] + " " + temp2[1];
          response.data.matchDate=temp3;
          this.form = response.data;
        } else {
          this.form = response.data;
        }
        this.formLoading = false;
      }).catch(() => {
        this.formLoading = false;
      });
    },
    /** 更新状态按钮操作 */
    handleStatusUpdate(row) {
      this.selectedMatchId = row.matchId;
      this.statusDialogVisible = true;
    },
    /** 状态更新成功回调 */
    handleStatusSuccess() {
      this.getList();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const params = {
            ...this.form,
            matchTime: this.form.matchDate
          }
          
          if (this.form.matchId != null) {
            updateMatch(params).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.submitLoading = false;
            }).catch(() => {
              this.submitLoading = false;
            });
          } else {
            addMatch(params).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.submitLoading = false;
            }).catch(() => {
              this.submitLoading = false;
            });
          }
        }
      });
    },

    /** 查看详情按钮操作 */
    handleViewDetail(row) {
      this.detailData = {};
      this.guessList = [];
      this.activeNames = [];
      this.detailOpen = true;
      this.detailLoading = true;
      
      const matchId = row.matchId;
      
      // 获取赛事基本信息
      getMatch(matchId).then(response => {
        const matchDate=response.data.matchDate;
        const matchTime=response.data.matchTime;
        if (matchDate && matchTime) {
          const temp = matchDate.split(" ");
          const temp2 = matchTime.split(" ");
          const temp3 = temp[0] + " " + temp2[1];
          response.data.matchDate=temp3;
        }
        console.log('this.detailData.matchDate', this.detailData.matchDate);
        this.detailData = response.data;
        // 获取竞猜信息
        return this.getMatchGuesses(matchId);
      }).catch(() => {
        this.$modal.msgError("获取赛事详情失败");
      }).finally(() => {
        this.detailLoading = false;
      });
    },
    
    /** 获取赛事的竞猜信息 */
    async getMatchGuesses(matchId) {
      try {
        // 获取竞猜列表
        const guessResponse = await listGuess({ 
          matchId: matchId,
          pageNum: 1,
          pageSize: 1000  // 获取所有竞猜
        });
        
        const guessList = guessResponse.rows || [];
        
        // 为每个竞猜获取选项
        for (let i = 0; i < guessList.length; i++) {
          const guess = guessList[i];
          try {
            const optionResponse = await listGuessOption({
              guessId: guess.guessId,
              pageNum: 1,
              pageSize: 1000  // 获取所有选项
            });
            guess.guessOptions = optionResponse.rows || [];
          } catch (error) {
            console.error(`获取竞猜 ${guess.guessId} 的选项失败:`, error);
            guess.guessOptions = [];
          }
        }
        
        this.guessList = guessList;
        // 默认展开第一个竞猜
        if (guessList.length > 0) {
          this.activeNames = [guessList[0].guessId.toString()];
        }
      } catch (error) {
        console.error('获取竞猜信息失败:', error);
        this.guessList = [];
      }
    },
    
    /** 竞猜管理按钮操作 */
    handleGuessManage(row) {
      this.$router.push({
        path: '/billard/guess/' + row.matchId
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const matchIds = row.matchId || this.ids;
      this.$modal.confirm('是否确认删除赛事编号为"' + matchIds + '"的数据项？').then(function() {
        return delMatch(matchIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/match/export', {
        ...this.queryParams
      }, `match_${new Date().getTime()}.xlsx`)
    },
    /** 桌球员A变化处理 */
    handlePlayerAChange() {
      this.$nextTick(() => {
        this.$refs.form.validateField('playerB');
      });
    },
    /** 桌球员B变化处理 */
    handlePlayerBChange() {
      this.$nextTick(() => {
        this.$refs.form.validateField('playerA');
      });
    }
  }
};
</script>

<style scoped>
.option-card {
  transition: all 0.3s ease;
  cursor: default;
}

.option-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.win-option {
  border: 2px solid #67C23A;
  background-color: #f0f9ff;
}

.win-option:hover {
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

.box-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
