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
      <el-form-item label="繁体名称" prop="twName">
        <el-input
          v-model="queryParams.twName"
          placeholder="请输入中文繁体名称"
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
          v-hasPermi="['game:gameRankingConfig:add']"
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
          v-hasPermi="['game:gameRankingConfig:edit']"
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
          v-hasPermi="['game:gameRankingConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['game:gameRankingConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gameRankingConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :fixed="true" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="游戏id" align="center" prop="gameid"  />
      <el-table-column label="英文名称" align="center" prop="usName" />
      <el-table-column label="日语名称" align="center" prop="jpName" />
      <el-table-column label="韩语名称" align="center" prop="krName" />
      <el-table-column label="繁体名称" align="center" prop="twName" />
      <el-table-column label="英文封面" align="center" prop="usImg" >
        <template slot-scope="scope">
          <el-image v-if="scope.row.usImg" :src="scope.row.usImg" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="日语封面" align="center" prop="jpImg" >
        <template slot-scope="scope">
          <el-image v-if="scope.row.jpImg" :src="scope.row.jpImg" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="韩语封面" align="center" prop="krImg" >
        <template slot-scope="scope">
          <el-image v-if="scope.row.krImg" :src="scope.row.krImg" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="繁体封面" align="center" prop="twImg" >
        <template slot-scope="scope">
          <el-image v-if="scope.row.twImg" :src="scope.row.twImg" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="最小金额" align="center" prop="minAmount" />
      <el-table-column label="最大金额" align="center" prop="maxAmount" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['game:gameRankingConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['game:gameRankingConfig:remove']"
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

    <!-- 添加或修改游戏排行设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="游戏id" prop="gameid">
              <game-info-select v-model="form.gameid" placeholder="请选择游戏" @game-selected="handleGameSelected" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名称" prop="usName">
              <el-input v-model="form.usName" placeholder="请输入英文名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日语名称" prop="jpName">
              <el-input v-model="form.jpName" placeholder="请输入日语名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="韩语名称" prop="krName">
              <el-input v-model="form.krName" placeholder="请输入韩语名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="中文繁体名称" prop="twName">
              <el-input v-model="form.twName" placeholder="请输入中文繁体名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小金额" prop="minAmount">
              <el-input v-model="form.minAmount" placeholder="请输入最小金额" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="最大金额" prop="maxAmount">
              <el-input v-model="form.maxAmount" placeholder="请输入最大金额" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="英文封面" prop="usImg">
              <image-upload v-model="form.usImg" :limit="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日语封面" prop="jpImg">
              <image-upload v-model="form.jpImg" :limit="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="韩语封面" prop="krImg">
              <image-upload v-model="form.krImg" :limit="1" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="中文繁体封面" prop="twImg">
              <image-upload v-model="form.twImg" :limit="1" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGameRankingConfig, getGameRankingConfig, delGameRankingConfig, addGameRankingConfig, updateGameRankingConfig } from "@/api/game/gameRankingConfig";
import GameInfoSelect from '@/components/GameInfoSelect'
export default {
  name: "GameRankingConfig",
  components: {
    GameInfoSelect
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
      // 游戏排行设置表格数据
      gameRankingConfigList: [],
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
        minAmount: null,
        maxAmount: null,
      },
      // 表单参数
      form: {
        gameid: null,
        usName: null,
        jpName: null,
        krName: null,
        twName: null,
        usImg: null,
        jpImg: null,
        krImg: null,
        twImg: null,
        minAmount: null,
        maxAmount: null,
      },
      // 表单校验
      rules: {
        gameid: [
          { required: true, message: "游戏ID不能为空", trigger: "change" }
        ],
        minAmount: [
          { required: true, message: "最小金额不能为空", trigger: "blur" }
        ],
        maxAmount: [
          { required: true, message: "最大金额不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询游戏排行设置列表 */
    getList() {
      this.loading = true;
      listGameRankingConfig(this.queryParams).then(response => {
        this.gameRankingConfigList = response.rows;
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
        minAmount: null,
        maxAmount: null,
        remark: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
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
      this.title = "添加游戏排行设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameRankingConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏排行设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGameRankingConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameRankingConfig(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除游戏排行设置编号为"' + ids + '"的数据项？').then(function() {
        return delGameRankingConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('game/gameRankingConfig/export', {
        ...this.queryParams
      }, `gameRankingConfig_${new Date().getTime()}.xlsx`)
    },
    /** 游戏选择事件 */
    handleGameSelected(gameInfo) {
      this.form.usName = gameInfo.usName;
      this.form.jpName = gameInfo.jpName;
      this.form.krName = gameInfo.krName;
      this.form.twName = gameInfo.twName;
      this.form.usImg = gameInfo.usImg;
      this.form.jpImg = gameInfo.jpImg;
      this.form.krImg = gameInfo.krImg;
      this.form.twImg = gameInfo.twImg;
    }
  }
};
</script>
