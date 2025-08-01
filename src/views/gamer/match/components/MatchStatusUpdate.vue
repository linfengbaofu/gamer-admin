<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="400px"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="赛事状态" prop="matchStatus">
        <el-select v-model="form.matchStatus" placeholder="请选择赛事状态">
          <el-option
            v-for="dict in dict.type.match_status"
            :key="dict.value"
            :label="dict.label"
            :value="+dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMatch, updateMatch } from "@/api/billard/match";

export default {
  name: "MatchStatusUpdate",
  dicts: ["match_status"],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    matchId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      // 弹出层标题
      title: "更新赛事状态",
      // 表单参数
      form: {
        matchId: null,
        matchStatus: null
      },
      // 是否显示弹出层
      open: false,
      // 提交loading状态
      loading: false,
      // 表单校验
      rules: {
        matchStatus: [
          { required: true, message: "赛事状态不能为空", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    visible(val) {
      this.open = val;
      if (val && this.matchId) {
        this.getMatchData();
      }
    },
    open(val) {
      if (!val) {
        this.$emit('close');
      }
    }
  },
  methods: {
    /** 获取赛事数据 */
    getMatchData() {
      getMatch(this.matchId).then(response => {
        this.form = {
          matchId: response.data.matchId,
          matchStatus: response.data.matchStatus
        };
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
        matchStatus: null
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          updateMatch(this.form).then(response => {
            this.$modal.msgSuccess("状态更新成功");
            this.open = false;
            this.$emit('success');
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    }
  }
};
</script> 