<!-- 系统支持银行编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate?'修改银行':'添加银行'"
    :visible="visible"
    width="550px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px">

      <el-form-item
        label="银行名称:"
        prop="bank_name">
        <el-input
          :maxlength="20"
          v-model="form.bank_name"
          placeholder="请输入银行名称"
          clearable/>
      </el-form-item>

      <el-form-item
        label="银行图标:"
        prop="bank_icon">
        <uploadImage :limit="1" v-model="form.bank_icon"></uploadImage>
      </el-form-item>



      <el-form-item label="状态:" prop="status">
        <el-radio-group
          v-model="form.status">
          <el-radio :label="1">在用</el-radio>
          <el-radio :label="2">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item  label="背景图:">
        <uploadImage :limit="1" v-model="form.bank_background"></uploadImage>
      </el-form-item>
      <el-form-item label="排序:" >
        <el-input-number
          :min="0"
          v-model="form.sort"
          placeholder="请输入排序"
          controls-position="right"
          class="ele-fluid ele-text-left"/>
      </el-form-item>
                </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button
        type="primary"
        @click="save"
        :loading="loading">保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import uploadImage from '@/components/uploadImage'

export default {
  name: 'SysBankEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {uploadImage},
  data() {
    return {
      // 表单数据
      form: Object.assign({status:1,sort:125}, this.data),
      // 表单验证规则
      rules: {
              bank_name: [
          {required: true, message: '请输入银行名称', trigger: 'blur'}
        ],
                  bank_icon: [
          {required: true, message: '请输入银行图标', trigger: 'blur'}
        ],
                  sort: [
          {required: true, message: '请输入排序权重,数值越大越靠前', trigger: 'blur'}
        ],
                  status: [
          {required: true, message: '请输入状态:0显示,1不显示', trigger: 'blur'}
        ],
        bank_background: [
          {required: true, message: '请输入背景图', trigger: 'blur'}
        ],
            },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    }
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/sysbank/edit', this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              if (!this.isUpdate) {
                this.form = {};
              }
              this.updateVisible(false);
              this.$emit('done');
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            this.loading = false;
            this.$message.error(e.message);
          });
        } else {
          return false;
        }
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
