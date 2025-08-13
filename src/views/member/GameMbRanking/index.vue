<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      
      <el-form-item label="用户id" prop="mbId">
        <el-input
          v-model="queryParams.mbId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="mbAccount">
        <el-input
          v-model="queryParams.mbAccount"
          placeholder="请输入用户账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
             <el-form-item label="排名时间" prop="rankingDate">
         <el-date-picker
           v-model="queryParams.rankingDate"
           type="date"
           value-format="yyyy-MM-dd"
           placeholder="请选择排名时间"
           clearable
           style="width: 200px;"
         />
       </el-form-item>
       <el-form-item label="是否显示" prop="isShow">
         <el-select v-model="queryParams.isShow" placeholder="请选择是否显示" clearable style="width: 120px;">
           <el-option label="显示" value="1" />
           <el-option label="隐藏" value="0" />
         </el-select>
       </el-form-item>
               <el-form-item label="是否为真实用户" prop="isTrue">
          <el-select v-model="queryParams.isTrue" placeholder="请选择是否为真实用户" clearable style="width: 120px;">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:GameMbRanking:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="GameMbRankingList" @selection-change="handleSelectionChange">
      <el-table-column label="id" align="center" prop="id" width="130" :fixed="true"/>
      <el-table-column label="排名" align="center" prop="ranking" />
      <el-table-column label="用户id" align="center" prop="mbId" />
      <el-table-column label="用户账号" align="center" prop="mbAccount" />
      <el-table-column label="下注金额" align="center" prop="gameBet" />
             <el-table-column label="排名时间" align="center" prop="rankingDate" />
       <el-table-column label="是否显示" align="center" prop="isShow" width="100">
         <template slot-scope="scope">
           <el-tag :type="scope.row.isShow === '1' ? 'success' : 'info'">
             {{ scope.row.isShow === '1' ? '显示' : '隐藏' }}
           </el-tag>
         </template>
       </el-table-column>
               <el-table-column label="是否为真实用户" align="center" prop="isTrue" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isTrue === '1' ? 'success' : 'danger'">
              {{ scope.row.isTrue === '1' ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
       <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" fixed="right" align="center" prop="createDate" width="180">
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
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

         <!-- 查看或修改玩家下注排行对话框 -->
     <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
       <el-form ref="form" :model="form" :rules="rules" label-width="80px">
         <el-form-item label="排名" prop="ranking">
           <el-input v-model="form.ranking" placeholder="排名" readonly />
         </el-form-item>
         <el-form-item label="用户id" prop="mbId">
           <el-input v-model="form.mbId" placeholder="用户id" readonly />
         </el-form-item>
         <el-form-item label="用户账号" prop="mbAccount">
           <el-input v-model="form.mbAccount" placeholder="用户账号" readonly />
         </el-form-item>
         <el-form-item label="下注金额" prop="gameBet">
           <el-input v-model="form.gameBet" placeholder="请输入下注金额" />
         </el-form-item>
         <el-form-item label="是否显示" prop="isShow">
           <el-select v-model="form.isShow" placeholder="请选择是否显示" style="width: 100%;">
             <el-option label="显示" value="1" />
             <el-option label="隐藏" value="0" />
           </el-select>
         </el-form-item>
                   <el-form-item label="是否为真实用户" prop="isTrue">
            <el-select v-model="form.isTrue" placeholder="请选择是否为真实用户" style="width: 100%;">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
         <!-- <el-form-item label="排名时间" prop="rankingDate">
           <el-input v-model="form.rankingDate" placeholder="排名时间" readonly />
         </el-form-item> -->
         <!-- <el-form-item label="创建时间" prop="createDate">
           <el-input v-model="form.createDate" placeholder="创建时间" readonly />
         </el-form-item>
         <el-form-item label="修改时间" prop="updateDate">
           <el-input v-model="form.updateDate" placeholder="修改时间" readonly />
         </el-form-item>
         <el-form-item label="备注" prop="remark">
           <el-input v-model="form.remark" placeholder="备注" readonly />
         </el-form-item> -->
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="submitForm">确 定</el-button>
         <el-button @click="cancel">取 消</el-button>
       </div>
     </el-dialog>
  </div>
</template>

<script>
import { listGameMbRanking, getGameMbRanking, delGameMbRanking, addGameMbRanking, updateGameMbRanking } from "@/api/member/GameMbRanking";

export default {
  name: "GameMbRanking",
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
      // 玩家下注排行表格数据
      GameMbRankingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
             // 查询参数
       queryParams: {
         pageNum: 1,
         pageSize: 10,
         ranking: null,
         mbId: null,
         mbAccount: null,
         gameBet: null,
         rankingDate: null,
         isShow: null,
         isTrue: null,
         createDate: null,
         updateDate: null,
       },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    // 设置排名时间默认为昨天
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.queryParams.rankingDate = this.formatDate(yesterday);
    this.getList();
  },
  methods: {
    /** 格式化日期为yyyy-MM-dd格式 */
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    /** 查询玩家下注排行列表 */
    getList() {
      this.loading = true;
      listGameMbRanking(this.queryParams).then(response => {
        this.GameMbRankingList = response.rows;
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
         ranking: null,
         mbId: null,
         mbAccount: null,
         gameBet: null,
         rankingDate: null,
         isShow: '1',
         isTrue: '1',
         createDate: null,
         createBy: null,
         updateDate: null,
         updateBy: null,
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
      this.title = "添加玩家下注排行";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameMbRanking(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改玩家下注排行";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
                         updateGameMbRanking({
               id: this.form.id,
               // ranking: this.form.ranking,
               mbId: this.form.mbId,
               mbAccount: this.form.mbAccount,
               gameBet: this.form.gameBet,
               rankingDate: this.form.rankingDate,
               isShow: this.form.isShow,
               isTrue: this.form.isTrue,
             }).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameMbRanking(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除玩家下注排行编号为"' + ids + '"的数据项？').then(function() {
        return delGameMbRanking(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('member/GameMbRanking/export', {
        ...this.queryParams
      }, `GameMbRanking_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
