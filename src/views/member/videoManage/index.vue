<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="视频标题" prop="videoTitle">
        <el-input
          v-model="queryParams.videoTitle"
          placeholder="请输入视频标题"
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
          v-hasPermi="['member:videoManage:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="videoManageList" @selection-change="handleSelectionChange">
      <el-table-column label="视频ID" align="center" prop="videoId" width="150" :fixed="true"/>
      <el-table-column label="视频标题" align="center" prop="videoTitle" />
      <el-table-column label="视频分类" align="center" prop="videoType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.video_manage_video_type" :value="scope.row.videoType"/>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" align="center" prop="releaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长(秒)" align="center" prop="videoLength" />
      <el-table-column label="观看次数" align="center" prop="watchNum" />
      <el-table-column label="赛事状态" align="center" prop="videoStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.video_manage_video_status" :value="scope.row.videoStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="视频地址" align="center" prop="videoUrl" show-overflow-tooltip/>
      <el-table-column label="视频图片地址" align="center" prop="videoImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.videoImgUrl" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      
      <!-- <el-table-column label="审批人" align="center" prop="auditBy" />
      <el-table-column label="审批时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="排序" align="center" prop="sorted" />
      <el-table-column label="操作" align="center" fixed="right" width="160" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:videoManage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:videoManage:remove']"
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

    <!-- 添加或修改台球视频集锦管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="视频标题" prop="videoTitle" show-overflow-tooltip>
          <el-input v-model="form.videoTitle" placeholder="请输入视频标题" />
        </el-form-item>
        <el-form-item label="发布日期" prop="releaseTime">
          <el-date-picker clearable
            v-model="form.releaseTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="视频分类" prop="videoType">
          <el-select v-model="form.videoType" placeholder="请选择视频分类">
            <el-option v-for="item in dict.type.video_manage_video_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="时长(秒)" prop="videoLength">
          <el-input type="number" v-model="form.videoLength" placeholder="请输入时长(秒)" />
        </el-form-item>
        <el-form-item label="观看次数" prop="watchNum">
          <el-input type="number" v-model="form.watchNum" placeholder="请输入观看次数" />
        </el-form-item>
        <el-form-item label="视频地址" prop="videoUrl">
          <el-input v-model="form.videoUrl" placeholder="请输入视频地址" />
        </el-form-item>
        <el-form-item label="视频图片地址" prop="videoImgUrl">
          <image-upload v-model="form.videoImgUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="排序" prop="sorted">
          <el-input-number v-model="form.sorted" placeholder="请输入排序" :min="0" :max="1000" />
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
import { listVideoManage, getVideoManage, delVideoManage, addVideoManage, updateVideoManage } from "@/api/member/videoManage";

export default {
  dicts: ['video_manage_video_status', 'video_manage_video_type'],
  name: "VideoManage",
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
      // 台球视频集锦管理表格数据
      videoManageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        videoTitle: null,
        videoType: null,
        releaseTime: null,
        videoLength: null,
        watchNum: null,
        videoStatus: null,
        videoUrl: null,
        videoImgUrl: null,
        auditBy: null,
        auditTime: null,
        sorted: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        videoTitle: [
          { required: true, message: "视频标题不能为空", trigger: "blur" }
        ],
        // videoType: [
        //   { required: true, message: "视频分类不能为空", trigger: "blur" }
        // ],
        releaseTime: [  
          { required: true, message: "发布日期不能为空", trigger: "blur" }
        ],
        videoLength: [
          { required: true, message: "时长不能为空", trigger: "blur" }
        ],
        watchNum: [
          { required: true, message: "观看次数不能为空", trigger: "blur" }
        ],
        videoUrl: [
          { required: true, message: "视频地址不能为空", trigger: "blur" }
        ],
        videoImgUrl: [
          { required: true, message: "视频图片地址不能为空", trigger: "blur" }
        ],
        sorted: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        videoStatus: [
          { required: true, message: "赛事状态不能为空", trigger: "blur" }
        ],
        videoId: [
          { required: true, message: "视频ID不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询台球视频集锦管理列表 */
    getList() {
      this.loading = true;
      listVideoManage(this.queryParams).then(response => {
        this.videoManageList = response.rows;
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
        videoId: null,
        videoTitle: null,
        videoType: null,
        releaseTime: null,
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
      this.ids = selection.map(item => item.videoId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加台球视频集锦管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const videoId = row.videoId || this.ids
      getVideoManage(videoId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改台球视频集锦管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.videoId != null) {
            updateVideoManage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVideoManage(this.form).then(response => {
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
      const videoIds = row.videoId || this.ids;
      this.$modal.confirm('是否确认删除台球视频集锦管理编号为"' + videoIds + '"的数据项？').then(function() {
        return delVideoManage(videoIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/videoManage/export', {
        ...this.queryParams
      }, `videoManage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
