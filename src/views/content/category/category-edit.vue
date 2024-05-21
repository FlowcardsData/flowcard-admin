<!-- 广告位编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate?'修改分类':'添加分类'"
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
        label="名称:"
        prop="title">
        <el-input
          :maxlength="20"
          v-model="form.title"
          placeholder="请输入分类名称"
          clearable/>
      </el-form-item>
      
      <el-form-item label="视频标签:" prop="tags">
        <treeselect multiple :options="tagList" placeholder="请选择视频标签" v-model="tags" disable-branch-nodes :normalizer="normalizer" @deselect="clearSelected" />
      </el-form-item>

      <el-form-item label="排序号:" prop="sort">
        <el-input-number
          :min="0"
          v-model="form.sort"
          placeholder="请输入排序号"
          controls-position="right"
          class="ele-fluid ele-text-left"/>
      </el-form-item>
      <el-form-item label="分类状态:" prop="status">
        <el-radio-group
          v-model="form.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
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
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'AdSortEdit',
  components: {Treeselect},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 栏目数据
    cateList: Array
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({status: 1}, this.data),

      // 表单验证规则
      rules: {
        title: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ],
        // tags: [
        //   {required: true, message: '请选择分类标签', trigger: 'blur'}
        // ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
      },
      //视频标签
      tagList: [],
      tags: [],
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        var tags = this.data.tags;
        this.tags = tags ? tags.split(',') : null;

        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.tags = null;
        this.form = {};
        this.isUpdate = false;
      }
    },
    visible() {
      if (this.visible) {
        this.getTagList();
      }
    }
  },
  methods: {
    /* 下拉树格式化 */
    normalizer(d) {
      return {
        id: d.id,
        label: d.name,
        children: d.children || undefined
      };
    },
    getTagList() {
      this.$http.post('/videotagsclassify/index', {}).then(res => {
        res.data.data = this.$util.toTreeData(res.data.data, 'id', 'pid');
        this.tagList = res.data.data;
      });
    },
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.form.tags = this.tags.join(',');
          this.$http.post('/category/edit', this.form).then(res => {
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
