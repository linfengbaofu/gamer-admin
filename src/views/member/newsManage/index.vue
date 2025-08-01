<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="newsTitle">
        <el-input
          v-model="queryParams.newsTitle"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTop">
        <el-select v-model="queryParams.isTop" placeholder="请选择是否置顶">
          <el-option v-for="item in dict.type.news_manage_is_top" :key="item.value" :label="item.label" :value="item.value" />
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
          v-hasPermi="['member:newsManage:add']"
        >新增</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="newsManageList" @selection-change="handleSelectionChange">
          
      <el-table-column label="ID" :fixed="true" align="center" prop="newsId" width="180" />
      <el-table-column label="标题" align="center" prop="newsTitle" show-overflow-tooltip/>
      <el-table-column label="副标题" align="center" prop="remark" show-overflow-tooltip/>

      <el-table-column label="分类" align="center" prop="newsType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.news_manage_news_type" :value="scope.row.newsType"/>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="newsImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.newsImgUrl" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="发布日期" align="center" prop="releaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center" prop="newsAuthor" />
      <el-table-column label="阅读量" align="center" prop="readNum" />
      <el-table-column label="是否置顶" align="center" prop="isTop" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.news_manage_is_top" :value="scope.row.isTop"/>
        </template>
      </el-table-column>
      <el-table-column label="新闻状态" align="center" prop="newsStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.news_manage_news_status" :value="scope.row.newsStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="auditBy" />
      <el-table-column label="审批时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sorted" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" fixed="right" width="130" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:newsManage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:newsManage:remove']"
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

    <!-- 添加或修改台球新闻管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="max-height: 500px; overflow-y: auto;">
        <el-form-item label="标题" prop="newsTitle">
          <el-input v-model="form.newsTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="副标题" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="图片" prop="newsImgUrl">
          <image-upload v-model="form.newsImgUrl" :limit="1" />
        </el-form-item>
        <el-form-item label="新闻信息" prop="newsInfo">
          <editor v-model="form.newsInfo" :min-height="192" />
        </el-form-item>
        <el-form-item label="分类" prop="newsType">
          <el-select v-model="form.newsType" placeholder="请选择分类">
            <el-option v-for="item in dict.type.news_manage_news_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布日期" prop="releaseTime">
          <el-date-picker clearable
            v-model="form.releaseTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="作者" prop="newsAuthor">
          <el-input v-model="form.newsAuthor" placeholder="请输入作者" />
        </el-form-item>
        <!-- <el-form-item label="阅读量" prop="readNum">
          <el-input v-model="form.readNum" placeholder="请输入阅读量" />
        </el-form-item> -->
       
        <el-form-item label="是否置顶" prop="isTop">
          <el-select v-model="form.isTop" placeholder="请选择是否置顶">
            <el-option v-for="item in dict.type.news_manage_is_top" :key="item.value" :label="item.label" :value="+item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="newsStatus">
          <el-select v-model="form.newsStatus" placeholder="请选择审核状态">
            <el-option v-for="item in dict.type.news_manage_news_status" :key="item.value" :label="item.label" :value="+item.value" />
          </el-select>
        </el-form-item>

        
        <el-form-item label="排序" prop="sorted">
          <el-input-number v-model="form.sorted" placeholder="请输入排序" :min="0" :max="1000" />
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
import { listNewsManage, getNewsManage, delNewsManage, addNewsManage, updateNewsManage } from "@/api/member/newsManage";

export default {
  dicts: ['news_manage_is_top', 'news_manage_news_status', 'news_manage_news_type'],
  name: "NewsManage",
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
      // 台球新闻管理表格数据
      newsManageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 提交按钮加载状态
      submitLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        newsTitle: null,
        newsType: null,
        releaseTime: null,
        newsAuthor: null,
        readNum: null,
        isTop: null,
        newsStatus: null,
        newsInfo: null,
        auditBy: null,
        auditTime: null,
        sorted: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        newsTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        releaseTime: [
          { required: true, message: "发布日期不能为空", trigger: "blur" }
        ],
        isTop: [
          { required: true, message: "是否置顶不能为空", trigger: "blur" }
        ],
        newsStatus: [
          { required: true, message: "新闻状态不能为空", trigger: "blur" }
        ],
        newsInfo: [
          { required: true, message: "新闻信息不能为空", trigger: "blur" }
        ],
        sorted: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询台球新闻管理列表 */
    getList() {
      this.loading = true;
      listNewsManage(this.queryParams).then(response => {
        this.newsManageList = response.rows;
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
        newsId: null,
        newsTitle: null,
        newsType: null,
        releaseTime: null,
        newsAuthor: null,
        readNum: null,
        remark: null,
        isTop: null,
        newsStatus: null,
        newsInfo: null,
        createTime: null,
        createBy: null,
        auditBy: null,
        auditTime: null,
        sorted: null
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
      this.ids = selection.map(item => item.newsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加台球新闻管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const newsId = row.newsId || this.ids
      getNewsManage(newsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改台球新闻管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.newsId != null) {
            updateNewsManage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addNewsManage(this.form).then(response => {
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
      const newsIds = row.newsId || this.ids;
      this.$modal.confirm('是否确认删除台球新闻管理编号为"' + newsIds + '"的数据项？').then(function() {
        return delNewsManage(newsIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/newsManage/export', {
        ...this.queryParams
      }, `newsManage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
