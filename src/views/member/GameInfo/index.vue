<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="游戏id" prop="gameid">
        <el-input
          v-model="queryParams.gameid"
          placeholder="请输入游戏id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="英文名称" prop="usName">
        <el-input
          v-model="queryParams.usName"
          placeholder="请输入英文名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日语名称" prop="jpName">
        <el-input
          v-model="queryParams.jpName"
          placeholder="请输入日语名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="韩语名称" prop="krName">
        <el-input
          v-model="queryParams.krName"
          placeholder="请输入韩语名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="中文繁体名称" prop="twName">
        <el-input
          v-model="queryParams.twName"
          placeholder="请输入中文繁体名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="英文封面" prop="usImg">
        <el-input
          v-model="queryParams.usImg"
          placeholder="请输入英文封面"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日语封面" prop="jpImg">
        <el-input
          v-model="queryParams.jpImg"
          placeholder="请输入日语封面"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="韩语封面" prop="krImg">
        <el-input
          v-model="queryParams.krImg"
          placeholder="请输入韩语封面"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="中文繁体封面" prop="twImg">
        <el-input
          v-model="queryParams.twImg"
          placeholder="请输入中文繁体封面"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属平台" prop="platform">
        <el-input
          v-model="queryParams.platform"
          placeholder="请输入所属平台"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否热门" prop="isHot">
        <el-input
          v-model="queryParams.isHot"
          placeholder="请输入是否热门"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="isOpen">
        <el-input
          v-model="queryParams.isOpen"
          placeholder="请输入是否启用"
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
          v-hasPermi="['member:GameInfo:add']"
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
          v-hasPermi="['member:GameInfo:edit']"
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
          v-hasPermi="['member:GameInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:GameInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="GameInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="游戏id" align="center" prop="gameid" />
      <el-table-column label="英文名称" align="center" prop="usName" />
      <el-table-column label="日语名称" align="center" prop="jpName" />
      <el-table-column label="韩语名称" align="center" prop="krName" />
      <el-table-column label="中文繁体名称" align="center" prop="twName" />
      <el-table-column label="英文封面" align="center" prop="usImg" />
      <el-table-column label="日语封面" align="center" prop="jpImg" />
      <el-table-column label="韩语封面" align="center" prop="krImg" />
      <el-table-column label="中文繁体封面" align="center" prop="twImg" />
      <el-table-column label="所属平台" align="center" prop="platform" />
      <el-table-column label="游戏类型" align="center" prop="gametype" />
      <el-table-column label="游戏状态" align="center" prop="status" />
      <el-table-column label="是否热门" align="center" prop="isHot" />
      <el-table-column label="是否启用" align="center" prop="isOpen" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:GameInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:GameInfo:remove']"
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

    <!-- 添加或修改游戏列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="游戏id" prop="gameid">
          <el-input v-model="form.gameid" placeholder="请输入游戏id" />
        </el-form-item>
        <el-form-item label="英文名称" prop="usName">
          <el-input v-model="form.usName" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="日语名称" prop="jpName">
          <el-input v-model="form.jpName" placeholder="请输入日语名称" />
        </el-form-item>
        <el-form-item label="韩语名称" prop="krName">
          <el-input v-model="form.krName" placeholder="请输入韩语名称" />
        </el-form-item>
        <el-form-item label="中文繁体名称" prop="twName">
          <el-input v-model="form.twName" placeholder="请输入中文繁体名称" />
        </el-form-item>
        <el-form-item label="英文封面" prop="usImg">
          <el-input v-model="form.usImg" placeholder="请输入英文封面" />
        </el-form-item>
        <el-form-item label="日语封面" prop="jpImg">
          <el-input v-model="form.jpImg" placeholder="请输入日语封面" />
        </el-form-item>
        <el-form-item label="韩语封面" prop="krImg">
          <el-input v-model="form.krImg" placeholder="请输入韩语封面" />
        </el-form-item>
        <el-form-item label="中文繁体封面" prop="twImg">
          <el-input v-model="form.twImg" placeholder="请输入中文繁体封面" />
        </el-form-item>
        <el-form-item label="所属平台" prop="platform">
          <el-input v-model="form.platform" placeholder="请输入所属平台" />
        </el-form-item>
        <el-form-item label="是否热门" prop="isHot">
          <el-input v-model="form.isHot" placeholder="请输入是否热门" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isOpen">
          <el-input v-model="form.isOpen" placeholder="请输入是否启用" />
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
import { listGameInfo, getGameInfo, delGameInfo, addGameInfo, updateGameInfo } from "@/api/member/GameInfo";

export default {
  name: "GameInfo",
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
      // 游戏列表表格数据
      GameInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gameid: null,
        usName: null,
        jpName: null,
        krName: null,
        twName: null,
        usImg: null,
        jpImg: null,
        krImg: null,
        twImg: null,
        platform: null,
        gametype: null,
        status: null,
        isHot: null,
        isOpen: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询游戏列表列表 */
    getList() {
      this.loading = true;
      listGameInfo(this.queryParams).then(response => {
        this.GameInfoList = response.rows;
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
        gameid: null,
        usName: null,
        jpName: null,
        krName: null,
        twName: null,
        usImg: null,
        jpImg: null,
        krImg: null,
        twImg: null,
        platform: null,
        gametype: null,
        status: null,
        isHot: null,
        isOpen: null,
        createTime: null,
        remark: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加游戏列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGameInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除游戏列表编号为"' + ids + '"的数据项？').then(function() {
        return delGameInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/GameInfo/export', {
        ...this.queryParams
      }, `GameInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
