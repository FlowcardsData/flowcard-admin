<!-- 视频编辑弹窗 -->
<template>
  <el-dialog :title="isUpdate?'修改视频':'添加视频'" :visible="visible" width="750px" :destroy-on-close="true" :lock-scroll="false" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="封面图片:" prop="cover">
        <uploadImage :limit="1" v-model="form.cover" @success="handleUpload"></uploadImage>
      </el-form-item>
      <el-form-item label="视频标题:" prop="title">
        <el-input :maxlength="125" v-model="form.title" placeholder="请添加视频标题，“#文字”可以添加话题" clearable />
      </el-form-item>

      <el-form-item label="视频标签:" prop="tags">
        <treeselect multiple :options="tagList" placeholder="请选择视频标签" v-model="tags" disable-branch-nodes :normalizer="normalizer" @deselect="clearSelected" />
      </el-form-item>

      <el-form-item label="观看权限:" prop="is_coins">
        <el-radio-group
          v-model="form.is_coins">
<!--          <el-radio :label="1">付费点播(非会员原价，VIP折扣购买)</el-radio>-->
          <el-radio :label="2">免费视频(所有人免费看)</el-radio>
<!--          <el-radio :label="3">VIP免费(非会员原价购买，VIP免费看)</el-radio>-->
<!--          <el-radio :label="0">VIP专属(VIP免费看，非会员无法购买与观看)</el-radio>-->
        </el-radio-group>
      </el-form-item>

      <el-form-item label="解锁费用:" prop="is_coins" v-if="form.is_coins == 1 || form.is_coins == 3">
        <el-input-number
          :min="0"
          v-model="form.coins"
          placeholder="请输入"
          controls-position="right"
          class="ele-text-left"/>
      </el-form-item>
<!--      <el-form-item label="关联商品:" v-if="isStore" >-->
<!--        <el-input :maxlength="125"  style="width: 84%;padding-right: 4%" v-model="good_title" placeholder="请选择关联商品"  clearable/>-->
<!--         <el-button type="success"  class="ele-btn-icon" @click="openSelectGoods()">选择</el-button>-->
<!--      </el-form-item>-->
     <!--  <el-form-item label="上架状态:" prop="is_lower" v-if="isUpdate">
        <el-select clearable v-model="form.is_lower" placeholder="请选择上架状态" class="ele-fluid">
          <el-option label="上架" :value="0" />
          <el-option label="下架" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="下架原因:" v-if="form.is_lower === 2" prop="lower_reason">
        <el-input
          :rows="3"
          clearable
          type="textarea"
          :maxlength="200"
          v-model="form.lower_reason"
          placeholder="请输入下架原因"/>
      </el-form-item> -->
      <!--   <el-form-item label="视频标签:" prop="tags">
        <el-select v-model="form.tags" placeholder="请选择">
          <el-option-group
            v-for="group in tagList"
            :key="group.id"
            :label="group.name">
            <el-option
              v-for="item in group.children"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item> -->
      <!--      <el-form-item label="排序号:" prop="sort">
        <el-input-number
          :min="0"
          v-model="form.sort"
          placeholder="请输入排序号"
          controls-position="right"
          class="ele-fluid ele-text-left"/>
      </el-form-item> -->
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="save" :loading="loading">保存
      </el-button>
    </div>

    <!-- 选择商品窗口 -->
    <select-goods :visible.sync="showSelectGoods"  :is_good.sync="is_good"  :good_title.sync="good_title" :good_id.sync="good_id"/>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import uploadImage from '@/components/uploadImage'
export default {
  name: 'edit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
  },
  components: { uploadImage, Treeselect },
  data() {
    return {
      // 表单数据
      form: Object.assign({ is_lower: 1,is_coins:1}, this.data),
      // 表单验证规则
      rules: {
        cover: [
          { required: true, message: '请输入封面图片', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        is_coins: [
          { required: true, message: '请选择观看权限', trigger: 'blur' }
        ],
        is_lower: [
          { required: true, message: '请选择上架状态', trigger: 'blur' }
        ],
        coins: [
          { required: true, message: '请输入解锁费用', trigger: 'blur' }
        ],

        lower_reason: [
          {
            required: true,
            type: 'string',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入下架原因'));
              }
              return callback();
            }
          }
        ],

      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      isStore: false, //是否商家
      //视频标签
      tagList: [],
      tags: [],
      store_id: 0,
      member_id: 0,
      store_type: '',
      is_good: 2, //是否商品视频：1是 2否
      good_title: '',
      good_id: 0,
      // 是否显示编辑弹窗
      showSelectGoods: false,
    };
  },
  created() {
  },
  watch: {
    data() {
      if (this.data) {
        var tags = this.data.tags;
        this.tags = tags ? tags.split(',') : null;

        this.form = Object.assign({}, this.data);
        this.good_title = this.data.good_title;
        this.member_id = this.data.uid;
        this.isUpdate = true;
      } else {
        this.tags = null;
        this.form = {};
        this.isUpdate = false;
      }
    },
    visible() {
      if (this.visible) {
        /*获取商家账号信息*/
        this.$http.post('/store/getInfo', {}).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            var store = res.data.data;
            if(store){
              if(store.status == 1){
                  this.store_id = store.id
                  this.isStore = true
                  this.store_type = store.store_type
              }
            }
          }
        })
        this.getTagList();
      }
    }
  },
  methods: {
    /* 显示编辑 */
    openSelectGoods() {
      this.showSelectGoods = true;
    },
    // 清除单选树选中
    clearSelected(node, instanceId) {
      console.log(node, instanceId, 'delete')
    },
    getTagList() {
      this.$http.post('/videotagsclassify/index', {}).then(res => {
        res.data.data = this.$util.toTreeData(res.data.data, 'id', 'pid');
        this.tagList = res.data.data;
      });
    },
    /* 下拉树格式化 */
    normalizer(d) {
      return {
        id: d.id,
        label: d.name,
        children: d.children || undefined,
        // isDisabled: d.pid !==0 ? true : false
      };
    },
    /* 保存编辑 */
    save() {
      this.form.tags    = this.tags
      this.form.store_type    = this.store_type

      this.form.is_good    = this.is_good
      this.form.good_title    = this.good_title
      this.form.good_id    = this.good_id
      if(this.good_title=='') {
        this.form.is_good = 2;
        this.form.good_id = 0;
      }

      this.form.store_id    = this.store_id
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/video/edit', this.form).then(res => {
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
    handleUpload({ oss_type }) {
      this.form.oss_type = oss_type;
    }
  }
}

</script>
<style scoped>
</style>
