<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="俱乐部名称" prop="clubName">
        <el-input
          v-model="queryParams.clubName"
          placeholder="请输入俱乐部名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="营业时间" prop="businessTime">
        <el-time-picker
          v-model="queryParams.businessTime"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="HH:mm:ss"
          @change="handleTimeRangeChange">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTop">
        <el-select v-model="queryParams.isTop" placeholder="请选择是否置顶">
          <el-option v-for="item in dict.type.record_is_top" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
          v-hasPermi="['billard:club:add']"
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
          v-hasPermi="['billard:club:edit']"
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
          v-hasPermi="['billard:club:remove']"
        >删除</el-button> -->
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['billard:club:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table show-overflow-tooltip v-loading="loading" :data="clubList" @selection-change="handleSelectionChange">
      <el-table-column label="ID" :fixed="true" align="center" prop="clubId" width="150" />
      <el-table-column label="俱乐部图片" align="center" prop="clubImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.clubImgUrl" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="俱乐部名称" align="center" prop="clubName" width="140" show-overflow-tooltip/>
      <el-table-column label="俱乐部地址" align="center" prop="clubAdd" width="140" show-overflow-tooltip/>
      <el-table-column label="俱乐部电话" align="center" prop="clubTelephone" width="140" show-overflow-tooltip/>
      <el-table-column label="星级" align="center" prop="clubStar" width="140" show-overflow-tooltip/>
      <el-table-column label="营业时间(开始)" align="center" prop="businessBeginTime" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.businessBeginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业时间(结束)" align="center" prop="businessEndTime" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.businessEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="台球桌数量" align="center" prop="deskNum" width="140" show-overflow-tooltip/>
      <el-table-column label="俱乐部状态" align="center" prop="clubStatus" width="140" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.club_status" :value="scope.row.clubStatus" />
        </template>
      </el-table-column>
      <el-table-column label="俱乐部图片" align="center" prop="clubImgUrl" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.clubImgUrl" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="是否置顶" align="center" prop="isTop" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.record_is_top" :value="scope.row.isTop"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sorted" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作"  :show-overflow-tooltip="false" align="center" fixed="right" width="180" class-name="small-padding fixed-width">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['billard:club:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['billard:club:remove']"
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

    <!-- 添加或修改俱乐部对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="俱乐部名称" prop="clubName">
                <el-input v-model="form.clubName" placeholder="请输入俱乐部名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否置顶" prop="isTop">
                <el-select v-model="form.isTop" placeholder="请选择是否置顶">
                  <el-option v-for="item in dict.type.record_is_top" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" prop="sorted">
                <el-input v-model="form.sorted" placeholder="请输入排序" />
              </el-form-item>
            </el-col>

          <el-col :span="12">
            <el-form-item label="俱乐部地址" prop="clubAdd">
              <el-input v-model="form.clubAdd" placeholder="请输入俱乐部地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="俱乐部描述" prop="clubDesc">
              <editor v-model="form.clubDesc" :min-height="192" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="俱乐部电话" prop="clubTelephone">
              <el-input v-model="form.clubTelephone" placeholder="请输入俱乐部电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="星级" prop="clubStar">
              <el-input-number v-model="form.clubStar" placeholder="请输入星级" :min="0" :max="10" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="俱乐部状态" prop="clubStatus">
              <el-select v-model="form.clubStatus" placeholder="请选择俱乐部状态" style="width: 100%">
                <el-option v-for="item in dict.type.club_status" :key="item.value" :label="item.label" :value="+item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="台球桌数量" prop="deskNum">
              <el-input-number v-model="form.deskNum" placeholder="请输入台球桌数量" :min="0" :max="1000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="营业开始时间" prop="businessBeginTime">
              <el-time-picker
                v-model="form.businessBeginTime"
                placeholder="选择开始时间"
                value-format="HH:mm:ss"
                style="width: 100%">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业结束时间" prop="businessEndTime">
              <el-time-picker
                v-model="form.businessEndTime"
                placeholder="选择结束时间"
                value-format="HH:mm:ss"
                style="width: 100%">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="俱乐部图片" prop="clubImgUrl">
              <image-upload v-model="form.clubImgUrl" :limit="1" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listClub, getClub, delClub, addClub, updateClub } from "@/api/billard/club";

export default {
  dicts: ['club_status', 'record_is_top'],
  name: "Club",
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
      // 俱乐部表格数据
      clubList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clubName: null,
        clubAdd: null,
        clubTelephone: null,
        clubStar: null,
        businessBeginTime: null,
        businessEndTime: null,
        deskNum: null,
        clubStatus: null,
        clubImgUrl: null,
        businessTime: []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        clubName: [
          { required: true, message: "俱乐部名称不能为空", trigger: "blur" }
        ],
        clubAdd: [
          { required: true, message: "俱乐部地址不能为空", trigger: "blur" }
        ],
        clubTelephone: [  
          { required: true, message: "俱乐部电话不能为空", trigger: "blur" }
        ],
        clubStar: [
          { required: true, message: "星级不能为空", trigger: "blur" }
        ],
        clubStatus: [
          { required: true, message: "俱乐部状态不能为空", trigger: "change" }
        ],
        businessBeginTime: [
          { required: true, message: "营业开始时间不能为空", trigger: "change" }
        ],
        businessEndTime: [
          { required: true, message: "营业结束时间不能为空", trigger: "change" }
        ],
        deskNum: [
          { required: true, message: "台球桌数量不能为空", trigger: "blur" }
        ],
        clubImgUrl: [
          { required: false, message: "俱乐部图片不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    // 初始化业务时间范围
    this.queryParams.businessTime = [];
  },
  methods: {
    /** 查询俱乐部列表 */
    getList() {
      this.loading = true;
      listClub(this.queryParams).then(response => {
        this.clubList = response.rows;
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
        clubId: null,
        clubName: null,
        clubAdd: null,
        clubTelephone: null,
        clubStar: null,
        businessBeginTime: null,
        businessEndTime: null,
        deskNum: null,
        clubStatus: null,
        clubImgUrl: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        sorted: null,
        isTop: 0
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
      this.ids = selection.map(item => item.clubId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.title = "添加俱乐部";
      this.open = true;

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const clubId = row.clubId || this.ids
      getClub(clubId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改俱乐部";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.form.clubId != null) {
            updateClub(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 处理错误情况
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            addClub(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(() => {
              // 处理错误情况
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const clubIds = row.clubId || this.ids;
      this.$modal.confirm('是否确认删除俱乐部编号为"' + clubIds + '"的数据项？').then(function() {
        return delClub(clubIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('billard/club/export', {
        ...this.queryParams
      }, `club_${new Date().getTime()}.xlsx`)
    },
    
    /** 处理搜索表单时间范围变化 */
    handleTimeRangeChange(val) {
      if (val) {
        this.queryParams.businessBeginTime = val[0];
        this.queryParams.businessEndTime = val[1];
      } else {
        this.queryParams.businessBeginTime = null;
        this.queryParams.businessEndTime = null;
      }
    },

    
  }
};
</script>
