<!-- 广告编辑弹窗 -->
<template>
  <el-dialog :title="isUpdate?'修改广告':'添加广告'" :visible="visible" width="850px" :destroy-on-close="true" :lock-scroll="false" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="广告图片：">
        <uploadImage :limit="1" v-model="form.cover" @success="handleUpload"></uploadImage>
      </el-form-item>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="广告标题:" prop="title">
            <el-input clearable :maxlength="150" v-model="form.title" placeholder="请输入广告标题" />
          </el-form-item>
          <el-form-item label="广告URL:" prop="url">
            <el-input clearable :maxlength="255" v-model="form.url" placeholder="请输入广告URL" />
          </el-form-item>
          <el-form-item label="广告宽度:" prop="width">
            <el-input-number :min="0" v-model="form.width" placeholder="请输入广告宽度" controls-position="right" class="ele-fluid ele-text-left" />
          </el-form-item>
         <!--  <el-form-item label="开始时间:">
            <el-date-picker type="datetime" class="ele-fluid" v-model="form.start_time" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间" />
          </el-form-item> -->
          <el-form-item label="排序号:" prop="sort">
            <el-input-number :min="0" v-model="form.sort" placeholder="请输入排序号" controls-position="right" class="ele-fluid ele-text-left" />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <!-- <el-form-item label="广告类型:" prop="type">
            <el-select clearable class="ele-block" v-model="form.type" placeholder="请选择广告类型">
              <el-option label="图片" :value="1" />
              <el-option label="文字" :value="2" />
              <el-option label="视频" :value="3" />
              <el-option label="推荐" :value="4" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="所属广告位:" prop="ad_sort_id">
            <el-select filterable clearable v-model="form.ad_sort_id" size="small" placeholder="-请选择所属广告位-" class="ele-block">
              <el-option v-for="item in sortList" :key="item.id" :label="item.description" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="广告高度:" prop="height">
            <el-input-number :min="0" v-model="form.height" placeholder="请输入广告高度" controls-position="right" class="ele-fluid ele-text-left" />
          </el-form-item>
   <!--        <el-form-item label="结束时间:">
            <el-date-picker type="datetime" class="ele-fluid" v-model="form.end_time" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间" />
          </el-form-item> -->
          <el-form-item label="广告状态:" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 广告描述 -->
     <!--  <el-form-item label="广告描述:">
        <el-input :rows="3" clearable type="textarea" :maxlength="255" v-model="form.description" placeholder="请输入备注" />
      </el-form-item> -->
      <!-- 富文本编辑器 -->
      <!-- <el-form-item label="通知内容:" prop="content">
        <tinymce-editor v-model="form.content" :init="initEditor" />
      </el-form-item> -->
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="save" :loading="loading">保存
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import uploadImage from '@/components/uploadImage'
// import TinymceEditor from '@/components/TinymceEditor';

export default {
  name: 'AdEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 广告位列表
    sortList: Array
  },
  components: { uploadImage },
  data() {
    return {
      // 表单数据
      form: Object.assign({ status: 1 }, this.data),
      // 表单验证规则
      rules: {
        title: [
          { required: true, message: '请输入广告标题', trigger: 'blur' }
        ],
        // type: [
        //   { required: true, message: '请选择广告类型', trigger: 'blur' }
        // ],
        status: [
          { required: true, message: '请选择广告状态', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
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
  computed: {
    // 初始化富文本
    initEditor() {
      return {
        height: 300,
        branding: false,
        skin_url: '/tinymce/skins/ui/oxide',
        content_css: '/tinymce/skins/content/default/content.css',
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        plugins: 'code print preview fullscreen paste searchreplace save autosave link autolink image imagetools media table codesample lists advlist hr charmap emoticons anchor directionality pagebreak quickbars nonbreaking visualblocks visualchars wordcount',
        toolbar: 'fullscreen preview code | undo redo | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | formatselect fontselect fontsizeselect | link image media emoticons charmap anchor pagebreak codesample | ltr rtl',
        toolbar_drawer: 'sliding',
        images_upload_handler: (blobInfo, success, error) => {
          let file = blobInfo.blob();
          // 使用axios上传
          const formData = new FormData();
          formData.append('file', file, file.name);
          this.$http.post('/upload/uploadImage', formData).then(res => {
            if (res.data.code == 0) {
              success(res.data.data);
            } else {
              error(res.data.msg);
            }
          }).catch(e => {
            console.error(e);
            error(e.message);
          });
        },
        file_picker_types: 'media',
        file_picker_callback: () => {}
      }
    }
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/ad/edit', this.form).then(res => {
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
    // 上传图片成功
    handleUpload({oss_type }) {
      this.form.oss_type = oss_type;
    }
  }
}

</script>
<style scoped>
</style>
