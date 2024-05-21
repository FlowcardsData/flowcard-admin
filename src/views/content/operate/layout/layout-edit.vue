<!-- 页面推荐编辑弹窗 -->
<template>
  <el-drawer
    class="edit-table"
    title="页面推荐"
    :visible.sync="showDrawer"
    :direction="direction"
    :size="'calc(100vw - 256px)'"
    :before-close="close"
    >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="150px"
      style="margin:10px 30px;">
      <el-form-item label="推荐图片：">
        <uploadImage :limit="1" v-model="form.image"></uploadImage>
      </el-form-item>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="推荐位置：" prop="loc_desc_id">
            <el-select
              filterable
              clearable
              v-model="form.loc_desc_id"
              size="small"
              placeholder="-请选择推荐位置-"
              class="ele-block">
              <el-option v-for="item in layoutDescList" :key="item.id" :label="item.loc_desc+'>>'+item.loc_id" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐类型:" prop="type">
            <el-select
              clearable
              class="ele-block"
              v-model="form.type"
              placeholder="请选择推荐类型">
              <el-option label="普通文章" :value="1"/>
              <el-option label="图文文章" :value="2"/>
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
        </el-col>
        <el-col :sm="12">
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
          <el-form-item
            label="推荐内容:"
            prop="type_id">
            <el-input
              :maxlength="20"
              v-model="form.type_id"
              placeholder="请输入推荐内容"
              clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
        <el-button @click="save" type="primary" size="medium">保存 </el-button>
        <el-button @click="$emit('close')" size="medium">返回</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import uploadImage from '@/components/uploadImage'

export default {
  name: 'LayoutEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 推荐描述
    layoutDescList: Array,
    // 站点列表
    itemList: Array
  },
  components: {uploadImage},
  data() {
    return {
      showDrawer: this.visible,
      direction: 'rtl',
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入页面推荐名称', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择页面推荐状态', trigger: 'blur'}
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
  mounted() {
    this.getInfo();
  },
  methods: {
    /* 获取页面推荐详情 */
    getInfo(){
      if (this.data.id > 0) {
        this.$http.get('/layout/info?id=' + this.data.id).then(res => {
          if (res.data.code === 0) {
            this.form = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/layout/edit', this.form).then(res => {
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
    },
    /* 关闭页面 */
    close(hide) {
      if (hide) {
        hide();
      }
      this.$emit("done");
    }
  }
}
</script>

<style scoped>
</style>
