<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['member:PgRtpInfo:add']"
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
          v-hasPermi="['member:PgRtpInfo:edit']"
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
          v-hasPermi="['member:PgRtpInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:PgRtpInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="PgRtpInfoList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="id" align="center" prop="id" :fixed="true" width="150"/>
      <el-table-column label="游戏id" align="center" prop="gameId" />
      <el-table-column label="游戏名称" align="center" prop="gameName" />
      <el-table-column label="Logo" align="center" prop="gameLogo" >
        <template slot-scope="scope">
          <el-image :src="scope.row.gameLogo" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="当前rtp" align="center" prop="rtp" />
      <el-table-column label="rtp列表" align="center" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="500"
            trigger="hover"
            v-if="scope.row.mul"
          >
            <div>
              <h4 style="margin: 0 0 10px 0; color: #303133;">rtp列表</h4>
              <el-table height="300" :data="parseRtpList(scope.row.mul)" border style="width: 100%; max-height: 300px; overflow-y: auto;">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <!-- <el-table-column label="下注金额" prop="betAmount" align="center"></el-table-column> -->
                <el-table-column label="rtp" prop="rtp" align="center"></el-table-column>
                <!-- <el-table-column label="对应金额" prop="correspondingAmount" align="center"></el-table-column> -->
              </el-table>
            </div>
            <div slot="reference" style="cursor: pointer; color: #409EFF;">
              <i class="el-icon-view"></i>
              查看rtp列表
            </div>
          </el-popover>
          <span v-else style="color: #C0C4CC;">-</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >查看详情</el-button>
          <!-- <el-button
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
          >删除</el-button> -->
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

    <!-- 添加或修改PGrtp信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="rtp列表" prop="mul">
          <div>
            <el-input 
              v-model="rtpInputValue" 
              placeholder="请输入RTP值，用逗号分隔，如：1,2,3" 
              @input="updateRtpList"
              @blur="updateRtpList"
              style="margin-bottom: 10px;"
            />
            <div v-if="parsedRtpList.length > 0">
              <span style="color: #909399; font-size: 12px;">预览：</span>
              <el-tag 
                v-for="(rtpItem, index) in parsedRtpList" 
                :key="index" 
                size="mini" 
                style="margin: 2px;"
                :type="isValidRtp(rtpItem.rtp) ? 'success' : 'danger'"
              >
                {{ rtpItem.rtp }}%
              </el-tag>
            </div>
            <div v-if="rtpInputValue && parsedRtpList.length === 0" style="color: #f56c6c; font-size: 12px; margin-top: 5px;">
              请输入有效的RTP值，用逗号分隔
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog title="查看详情" :visible.sync="viewDialogVisible" width="600px" append-to-body>
      <div v-if="viewData" class="view-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">
            {{ viewData.id }}
          </el-descriptions-item>
          <el-descriptions-item label="游戏ID">
            {{ viewData.gameId }}
          </el-descriptions-item>
          <el-descriptions-item label="游戏名称">
            {{ viewData.gameName }}
          </el-descriptions-item>
          <el-descriptions-item label="当前RTP">
            {{ viewData.rtp }}%
          </el-descriptions-item>
          <el-descriptions-item label="游戏Logo" :span="2">
            <el-image 
              v-if="viewData.gameLogo" 
              :src="viewData.gameLogo" 
              style="width: 100px; height: 100px; border-radius: 4px;"
              :preview-src-list="[viewData.gameLogo]"
            />
            <span v-else style="color: #C0C4CC;">暂无图片</span>
          </el-descriptions-item>
          <el-descriptions-item label="RTP列表" :span="2">
            <div v-if="viewData.mul">
              <el-table 
                :data="parseRtpList(viewData.mul)" 
                border 
                size="mini"
                style="width: 100%; max-height: 200px; overflow-y: auto;"
              >
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="RTP值" prop="rtp" align="center">
                  <template slot-scope="scope">
                    <el-tag 
                      :type="isValidRtp(scope.row.rtp) ? 'success' : 'danger'"
                      size="mini"
                    >
                      {{ scope.row.rtp }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <span v-else style="color: #C0C4CC;">暂无RTP列表</span>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ viewData.remark || '暂无备注' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ viewData.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人">
            {{ viewData.createBy || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ viewData.updateTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新人">
            {{ viewData.updateBy || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPgRtpInfo, getPgRtpInfo, delPgRtpInfo, addPgRtpInfo, updatePgRtpInfo } from "@/api/member/PgRtpInfo";

export default {
  name: "PgRtpInfo",
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
      // PGrtp信息表格数据
      PgRtpInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查看详情对话框
      viewDialogVisible: false,
      viewData: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gameId: null,
        gameName: null,
        gameLogo: null,
        rtp: null,
        mul: null,
      },
      // 表单参数
      form: {},
      // RTP输入相关
      rtpInputValue: '',
      parsedRtpList: [],
      // 表单校验
      rules: {
        gameId: [
          { required: true, message: "游戏id不能为空", trigger: "blur" }
        ],
        gameName: [
          { required: true, message: "游戏名称不能为空", trigger: "blur" }
        ],
        rtp: [
          { required: true, message: "当前rtp不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "请输入有效的RTP值", trigger: "blur" }
        ],
        mul: [
          { validator: this.validateRtpList, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 解析RTP列表字符串 */
    parseRtpList(rtpString) {
      if (!rtpString) return [];
      try {
        let rtpArray = [];
        
        // 处理字符串格式的数组，如 "[1,2,3]"
        if (typeof rtpString === 'string') {
          // 移除方括号并分割
          const cleanString = rtpString.replace(/[\[\]]/g, '');
          rtpArray = cleanString.split(',').map(item => parseFloat(item.trim())).filter(item => !isNaN(item));
        }
        // 如果已经是数组，直接使用
        else if (Array.isArray(rtpString)) {
          rtpArray = rtpString.map(item => parseFloat(item)).filter(item => !isNaN(item));
        }
        
        // 转换为el-table需要的对象数组格式
        return rtpArray.map((rtp, index) => ({
          index: index + 1,  // 序号
          rtp: rtp,         // rtp值
          id: `rtp_${index}` // 唯一标识
        }));
      } catch (error) {
        console.error('解析RTP列表失败:', error);
        return [];
      }
    },
    /** 更新RTP列表 */
    updateRtpList() {
      if (this.rtpInputValue) {
        this.parsedRtpList = this.parseRtpList(this.rtpInputValue);
        // 将解析后的数组转换为字符串格式存储，提取rtp值
        const rtpValues = this.parsedRtpList.map(item => item.rtp);
        this.form.mul = `[${rtpValues.join(',')}]`;
      } else {
        this.parsedRtpList = [];
        this.form.mul = null;
      }
    },
    /** 验证RTP列表 */
    validateRtpList(rule, value, callback) {
      if (!this.rtpInputValue) {
        callback(new Error('RTP列表不能为空'));
        return;
      }
      
      const rtpList = this.parseRtpList(this.rtpInputValue);
      if (rtpList.length === 0) {
        callback(new Error('请输入有效的RTP值，用逗号分隔'));
        return;
      }
      
      // 检查RTP值是否在合理范围内
      for (let rtpItem of rtpList) {
        if (rtpItem.rtp < 0 || rtpItem.rtp > 100) {
          callback(new Error('RTP值应在0-100之间'));
          return;
        }
      }
      
      callback();
    },
    /** 检查RTP值是否有效 */
    isValidRtp(rtp) {
      return rtp >= 0 && rtp <= 100;
    },
    /** 查询PGrtp信息列表 */
    getList() {
      this.loading = true;
      listPgRtpInfo(this.queryParams).then(response => {
        this.PgRtpInfoList = response.rows;
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
        gameId: null,
        gameName: null,
        gameLogo: null,
        rtp: null,
        mul: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null
      };
      this.rtpInputValue = '';
      this.parsedRtpList = [];
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
      this.title = "添加PGrtp信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPgRtpInfo(id).then(response => {
        this.form = response.data;
        // 处理RTP列表显示
        if (this.form.mul) {
          const rtpList = this.parseRtpList(this.form.mul);
          this.rtpInputValue = rtpList.map(item => item.rtp).join(',');
          this.parsedRtpList = rtpList;
        }
        this.open = true;
        this.title = "修改PGrtp信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePgRtpInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPgRtpInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除PGrtp信息编号为"' + ids + '"的数据项？').then(function() {
        return delPgRtpInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/PgRtpInfo/export', {
        ...this.queryParams
      }, `PgRtpInfo_${new Date().getTime()}.xlsx`)
    },
    /** 查看详情按钮操作 */
    handleView(row) {
      const id = row.id;
      getPgRtpInfo(id).then(response => {
        this.viewData = response.data;
        this.viewDialogVisible = true;
      }).catch(() => {
        this.$modal.msgError("获取详情失败");
      });
    }
  }
};
</script>
