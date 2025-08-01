<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="pdName">
        <el-input
          v-model="queryParams.pdName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否展示" prop="isShow">
        <el-select v-model="queryParams.isShow" placeholder="请选择是否展示">
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
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
          v-hasPermi="['member:pointsPd:add']"
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
          v-hasPermi="['member:pointsPd:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:pointsPd:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pointsPdList" @selection-change="handleSelectionChange">
      <el-table-column label="商品ID" align="center" prop="pdId" width="150" :fixed="true"/>
      <el-table-column label="商品名称" align="center" prop="pdName" />
      <el-table-column label="需要积分" align="center" prop="needPoints" />
      <el-table-column label="商品排序" align="center" prop="pdSort" />
      <el-table-column label="是否展示" align="center" prop="isShow" >
        <template slot-scope="scope">
          {{ scope.row.isShow === 0 ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column label="商品图片地址" align="center" prop="pdImgUrl" >
        <template slot-scope="scope">
          <el-image :src="scope.row.pdImgUrl" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:pointsPd:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:pointsPd:remove']"
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

    <!-- 添加或修改积分商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商品图片地址" prop="pdImgUrl">
          <image-upload v-model="form.pdImgUrl" :limit="1" placeholder="请输入商品图片地址" />
        </el-form-item>
        <el-form-item label="商品名称" prop="pdName">
          <el-input v-model="form.pdName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="需要积分" prop="needPoints">
          <el-input-number v-model="form.needPoints" placeholder="请输入需要积分" :precision="2" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品排序" prop="pdSort">
          <el-input v-model="form.pdSort" placeholder="请输入商品排序" />
        </el-form-item>
        <el-form-item label="是否展示" prop="isShow">
          <el-select v-model="form.isShow" placeholder="请选择是否展示">
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
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
import { listPointsPd, getPointsPd, delPointsPd, addPointsPd, updatePointsPd } from "@/api/member/pointsPd";

export default {
  name: "PointsPd",
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
      // 积分商品表格数据
      pointsPdList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pdName: null,
        needPoints: null,
        pdSort: null,
        isShow: null,
        pdImgUrl: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pdImgUrl: [
          { required: true, message: "商品图片地址不能为空", trigger: "blur" }
        ],
        pdName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        needPoints: [
          { required: true, message: "需要积分不能为空", trigger: "blur" },
          { type: "number", message: "需要积分必须为数字", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              if (value !== null && value !== undefined) {
                const numStr = value.toString();
                const decimalIndex = numStr.indexOf('.');
                if (decimalIndex !== -1 && numStr.length - decimalIndex - 1 > 2) {
                  callback(new Error('积分最多保留2位小数'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }, 
            trigger: "blur" 
          }
        ],
        pdSort: [
          { required: true, message: "商品排序不能为空", trigger: "blur" }
        ],
        isShow: [
          { required: true, message: "是否展示不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询积分商品列表 */
    getList() {
      this.loading = true;
      listPointsPd(this.queryParams).then(response => {
        this.pointsPdList = response.rows;
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
        pdId: null,
        pdName: null,
        needPoints: null,
        pdSort: null,
        isShow: null,
        pdImgUrl: null,
        createBy: null,
        createTime: null,
        updateBy: null,
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
      this.ids = selection.map(item => item.pdId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加积分商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row};
      this.open = true;
      this.title = "修改积分商品";
      // getPointsPd(pdId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改积分商品";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pdId != null) {
            updatePointsPd(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPointsPd(this.form).then(response => {
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
      const pdIds = row.pdId || this.ids;
      this.$modal.confirm('是否确认删除积分商品编号为"' + pdIds + '"的数据项？').then(function() {
        return delPointsPd(pdIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/pointsPd/export', {
        ...this.queryParams
      }, `pointsPd_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
