<template>
  <el-dialog :destroy-on-close="true" :lock-scroll="false" :title="isUpdate ? '修改产品' : '添加产品'" :visible="visible"
    width="880px" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row :gutter="15">
        <!-- <el-form-item label="选择产品:" prop="extend_offset_coins">
          <el-tag v-if="this.selectMemberData">
            {{ selectMemberData.nickname }}
          </el-tag>
          <el-button style="margin-left: 10px" type="success" class="ele-btn-icon"
            @click="openSelectMember()">请选择</el-button>
        </el-form-item> -->

        <el-form-item label="标题:" prop="title">
          <el-input clearable :maxlength="150" v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-row :gutter="15">
          <el-col :sm="12">
            <el-form-item label="商品编码:"  prop="id">
              <el-input clearable :maxlength="50" v-model="form.id" placeholder="请输入商品编码" />
            </el-form-item>
            <el-form-item label="上架状态:" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="2">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="主图:" prop="img">
              <uploadImage :limit="1" v-model="form.img"></uploadImage>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="佣金:" prop="price">
              <el-input-number v-model="form.price" controls-position="right" :min="0" :max="1000" placeholder="请输入佣金"
                class="ele-fluid ele-text-left" />
            </el-form-item>
            <el-form-item label="结算规则:" prop="rule">
              <el-radio-group v-model="form.rule">
                <el-radio :label="1">次月结</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="副图:">
              <uploadImage :limit="1" v-model="form.img2"></uploadImage>
            </el-form-item>
          </el-col>
        </el-row>



        <el-form-item label="简介:" prop="desc">
          <el-input :rows="2" clearable type="textarea" :maxlength="150" v-model="form.desc" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="简介2:">
          <el-input :rows="2" clearable type="textarea" :maxlength="150" v-model="form.desc2" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="简介3:">
          <el-input :rows="2" clearable type="textarea" :maxlength="150" v-model="form.desc3" placeholder="请输入简介" />
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
import uploadImage from '@/components/uploadImage'
export default {
  name: 'giftEdit',
  components: { uploadImage },
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
      form: Object.assign({ status: 1, rule: 1 }, this.data),
      // 表单验证规则
      rules: {
        id: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请输入银行图标', trigger: 'blur' }
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
    // 上传图片成功
    handleUpload({ oss_type }) {
      this.form.oss_type = oss_type;
    },
    /* 显示编辑 */
    openSelectMember() {
      this.showSelectMember = true;
    },
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(valid, this.form);
          // this.loading = true;
          // this.form.member_id = this.selectMemberId;
          // this.$http.post('/agent/edit', {
          //   ...this.form
          // }).then(res => {
          //   this.loading = false;
          //   if (res.data.code === 0) {
          //     this.$message.success(res.data.msg);
          //     if (!this.isUpdate) {
          //       // this.form = {};
          //     }
          //     this.updateVisible(false);
          //     this.$emit('done');
          //   } else {
          //     this.$message.error(res.data.msg);
          //   }
          // }).catch(e => {
          //   this.loading = false;
          //   this.$message.error(e.message);
          // });
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
