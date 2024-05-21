<!-- 布局描述编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate?'修改布局描述':'添加布局描述'"
    :visible="visible"
    width="460px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-form-item
        label="布局描述:"
        prop="loc_desc">
        <el-input
          :maxlength="20"
          v-model="form.loc_desc"
          placeholder="请输入布局描述描述"
          clearable/>
      </el-form-item>
      <el-form-item label="描述位置:" prop="loc_id">
        <el-input-number
          :min="0"
          v-model="form.loc_id"
          placeholder="请输入描述位置"
          controls-position="right"
          class="ele-fluid ele-text-left"/>
      </el-form-item>
      <el-form-item label="所属站点:" prop="item_id">
        <el-select
          filterable
          clearable
          v-model="form.item_id"
          size="small"
          placeholder="-请选择所属站点-"
          class="ele-block">
          <el-option v-for="item in itemList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="排序号:" prop="sort">
        <el-input-number
          :min="0"
          v-model="form.sort"
          placeholder="请输入排序号"
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
export default {
  name: 'LayoutDescEdit',
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 站点数据
    itemList: Array
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({status: 1}, this.data),
      // 表单验证规则
      rules: {
        loc_desc: [
          {required: true, message: '请输入布局描述', trigger: 'blur'}
        ],
        loc_id: [
          {required: true, message: '请选择布局描述位置', trigger: 'blur'}
        ],
        item_id: [
          {required: true, message: '请选择所属站点', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', trigger: 'blur'}
        ]
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
          this.$http.post('/layoutdesc/edit', this.form).then(res => {
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
