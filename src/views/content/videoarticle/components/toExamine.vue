<template>
  <el-dialog :visible.sync="visible" title="请选择" custom-class="message-box" :close-on-click-modal="false" width="680px">
    <el-form ref="elForm" :model="form" :rules="rules">
      <!-- <p>传递的参数值：{{ id }}</p> -->
      <el-radio-group v-model="selectedOption">
        <el-radio label=1>推荐</el-radio>
        <el-radio label=2>不推荐</el-radio>
        <el-radio label=3>驳回</el-radio>
      </el-radio-group>

      <el-form-item v-if="selectedOption == '3'" prop="refuseReason" style="margin-top: 20px;">
        <el-input
          :rows="3"
          clearable
          type="textarea"
          :maxlength="150"
          v-model="form.refuseReason"
          placeholder="请输入驳回原因"/>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectedOption: 1,
      form: {
        refuseReason: '',
      },
      rules: {
        /*refuseReason: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' }
        ]*/
      }
    };
  },
  mounted() {
    // 设置默认选中第一个选项
    this.selectedOption = '1';
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      const data = {
        id: this.id,
        type: this.selectedOption,
        refuse_reason: this.form.refuseReason,
      };
      this.$emit('confirm', data);
      this.updateVisible(false);
      this.$emit('done');
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
  }
};

</script>
<style scoped>
.message-box .el-dialog__body {
  padding: 20px;
}

</style>
