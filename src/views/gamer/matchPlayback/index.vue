<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="回放标题" prop="playbackTitle">
        <el-input
          v-model="queryParams.playbackTitle"
          placeholder="请输入回放标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="赛事id" prop="matchId">
        <el-input
          v-model="queryParams.matchId"
          placeholder="请输入赛事id"
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
          v-hasPermi="['billard:matchPlayback:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['billard:matchPlayback:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <!-- <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:matchPlayback:export']"
        >导出</el-button> -->
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="matchPlaybackList" @selection-change="handleSelectionChange">
      
      <el-table-column label="回放ID" align="center" prop="playbackId" />
      <el-table-column label="回放标题" align="center" prop="playbackTitle" />
      <el-table-column label="赛事id" align="center" prop="matchId" />
      <el-table-column label="时长(秒)" align="center" prop="videoLength" />
      <el-table-column label="观看次数" align="center" prop="watchNum" />
      <el-table-column label="赛事状态" align="center" prop="videoStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.match_status" :value="scope.row.videoStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="视频地址" align="center" prop="videoUrl" />
      <el-table-column label="视频图片地址" align="center" prop="videoImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.videoImgUrl" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <!-- <el-table-column label="审批人" align="center" prop="auditBy" /> -->
      <!-- <el-table-column label="审批时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="排序" align="center" prop="sorted" />
      <el-table-column label="操作" align="center" fixed="right" width="160" class-name="small-padding fixed-width" :show-overflow-tooltip="false">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:matchPlayback:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:matchPlayback:remove']"
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

    <!-- 添加或修改赛事回放对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="回放标题" prop="playbackTitle">
          <el-input v-model="form.playbackTitle" placeholder="请输入回放标题" />
        </el-form-item>
        <el-form-item label="赛事id" prop="matchId">
          <el-input v-model="form.matchId" placeholder="请输入赛事id" />
        </el-form-item>
        <el-form-item label="时长(秒)" prop="videoLength">
          <el-input type="number" v-model="form.videoLength" placeholder="请输入时长(秒)" />
        </el-form-item>
        <el-form-item label="视频地址" prop="videoUrl">
          <el-input v-model="form.videoUrl" placeholder="请输入视频地址" />
        </el-form-item>
        <el-form-item label="视频图片地址" prop="videoImgUrl">
          <image-upload v-model="form.videoImgUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="排序" prop="sorted">
          <el-input v-model="form.sorted" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMatchPlayback, getMatchPlayback, delMatchPlayback, addMatchPlayback, updateMatchPlayback } from "@/api/billard/matchPlayback";

export default {
  dicts: ['match_status'],
  name: "MatchPlayback",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 提交按钮loading
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
      // 赛事回放表格数据
      matchPlaybackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        playbackTitle: null,
        matchId: null,
        videoLength: null,
        watchNum: null,
        videoStatus: null,
        videoUrl: null,
        videoImgUrl: null,
        auditBy: null,
        auditTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        playbackTitle: [
          { required: true, message: "回放标题不能为空", trigger: "blur" }
        ],
        matchId: [
          { required: true, message: "赛事id不能为空", trigger: "blur" }
        ],
        videoLength: [
          { required: true, message: "时长不能为空", trigger: "blur" }
        ],
        videoUrl: [
          { required: true, message: "视频地址不能为空", trigger: "blur" }
        ],
        sorted: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        videoImgUrl: [
          { required: true, message: "视频图片地址不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询赛事回放列表 */
    getList() {
      this.loading = true;
      listMatchPlayback(this.queryParams).then(response => {
        this.matchPlaybackList = response.rows;
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
        playbackId: null,
        playbackTitle: null,
        matchId: null,
        videoLength: null,
        watchNum: null,
        videoStatus: null,
        videoUrl: null,
        videoImgUrl: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        auditBy: null,
        auditTime: null,
        sorted: null
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
      this.ids = selection.map(item => item.playbackId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加赛事回放";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const playbackId = row.playbackId || this.ids
      getMatchPlayback(playbackId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改赛事回放";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.playbackId != null) {
            updateMatchPlayback(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.submitLoading = false;
            }).catch(() => {
              this.submitLoading = false;
            });
          } else {
            addMatchPlayback(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const playbackIds = row.playbackId || this.ids;
      this.$modal.confirm('是否确认删除赛事回放编号为"' + playbackIds + '"的数据项？').then(function() {
        return delMatchPlayback(playbackIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/matchPlayback/export', {
        ...this.queryParams
      }, `matchPlayback_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
