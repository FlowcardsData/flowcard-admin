<template>
  <el-dialog :destroy-on-close="true" :lock-scroll="false" :title="isUpdate ? '修改产品' : '添加产品'" :visible="visible"
    width="880px" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row :gutter="15">
        <el-form-item label="选择产品:" prop="extend_offset_coins">
          <el-tag v-if="this.selectMemberData">
            {{ selectMemberData.nickname }}
          </el-tag>
          <el-button style="margin-left: 10px" type="success" class="ele-btn-icon"
            @click="openSelectMember()">请选择</el-button>
        </el-form-item>

        <el-form-item label="上架状态:" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input :rows="3" clearable type="textarea" :maxlength="125" v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">保存
      </el-button>
    </div>
  </el-dialog>
  <!-- 选择商品窗口 -->
</template>

<script>
export default {
  name: 'giftEdit',
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    rowdata: Object,
    agentLevelOptions: Array,
  },
  data() {
    return {
      // 是否显示编辑弹窗
      showSelectMember: false,
      // 表单数据
      form: Object.assign({ status: 1 }, this.data),
      // 表单验证规则
      rules: {
        title: [
          { required: true, message: '请输入权益等级名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      selectMemberData: null,
      selectMemberId: 0,
    };
  },
  watch: {
    rowdata() {
      if (this.rowdata) {
        this.form = Object.assign({}, this.rowdata);
        this.isUpdate = true;
      } else {
        this.form = { status: 1 };
        this.isUpdate = false;
      }
    }
  },
  methods: {
    getTagType(type) {
      // 根据 register 的某个条件来返回相应的 type
      if (type === 1) {
        return 'success';
      } else if (type === 2) {
        return 'warning';
      } else {
        return 'danger';
      }
    },
    handleCustomEvent(data) {
      this.selectMemberData = data;
      this.selectMemberId = this.selectMemberData.user_id;
    },
    // 上传图片成功
    handleUpload({ oss_type }) {
      this.form.oss_type = oss_type;
    },
    /* 显示编辑 */
    openSelectMember() {
      this.showSelectMember = true;
    },
    /* 下拉树格式化 */
    normalizer(d) {
      return {
        id: d.id,
        label: d.name,
        children: d.children || undefined
      };
    },
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.form.member_id = this.selectMemberId;
          this.$http.post('/agent/edit', {
            ...this.form
          }).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              if (!this.isUpdate) {
                // this.form = {};
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
