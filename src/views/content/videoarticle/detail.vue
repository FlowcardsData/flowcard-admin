<!-- 详情弹窗 -->
<template>
  <el-dialog
    title="详情"
    width="900px"
    :visible="visible"
    :lock-scroll="false"
    :destroy-on-close="true"
    @update:visible="updateVisible">
    <el-form
      size="mini"
      label-width="82px"
      class="ele-form-detail">
      <el-form-item label="ID:">
        <div class="ele-text-secondary">
          {{ data.id }}
        </div>
      </el-form-item>
      <el-form-item label="标题:">
        <div class="ele-text-secondary">
          {{ data.title }}
        </div>
      </el-form-item>
      <el-form-item label="图片:">
        <div class="ele-text-secondary">
          <el-image v-for="url in data.imgs" :key="url" :src="url" lazy style="width: 100px;max-width: 100px; max-height: 180px;padding-right:10px " :preview-src-list="data.imgs">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size: 80px;"></i>
            </div>
          </el-image>
        </div>
      </el-form-item>
      <el-form-item label="正文:">
        <div class="ele-text-secondary">
          <div v-html="data.details.content" class="content-wrapper"></div>
        </div>
      </el-form-item>


      <el-form-item label="审核:" prop="status" v-if="data.status==2">
        <el-radio-group v-model="quality">
          <el-radio :label=1>合格</el-radio>
          <el-radio :label=2>差</el-radio>
          <el-radio :label=3>不合格</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="状态:" v-else>
        <div class="ele-text-secondary">
          <span v-if="data.mark==0">已删除</span>
          <span v-else-if="data.status<=2">待审核</span>
          <span v-else-if="data.status==3 && data.is_lower==0">上架中</span>
          <span v-else-if="data.status==4">审核不通过【{{data.refuse_reason}}】</span>
          <span v-else-if="data.is_lower==1">用户下架</span>
          <span v-else-if="data.is_lower==2">运营下架【{{data.lower_reason}}】</span>
        </div>
      </el-form-item>

      <el-form-item v-if="quality == '3'" style="margin-top: 20px;">
        <el-input
          :rows="3"
          clearable
          type="textarea"
          :maxlength="150"
          v-model="data.refuseReason"
          placeholder="请输入不合格原因"/>
      </el-form-item>

    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">关闭</el-button>
      <el-button type="primary" @click="submit" :loading="loading">保存
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
export default {
  name: 'detail',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    videoid: Number
  },
  data() {
    return {
      data: {'details':[]},
      loading: false,
      quality: null,
    };
  },
  watch: {
    data() {
      if (this.data) {
        if (this.data.quality === null) {
          this.quality = 1;
        }else{
          this.quality = this.data.quality;
        }
      }
    },
    visible() {
      if (this.visible) {
        /*获取详情*/
        this.$http.post('/video/info', {'id':this.videoid}).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.data = res.data.data;
          }
        })
      }
    }
  },
  methods: {
    /* 保存编辑 */
    submit() {
      this.$http.post('/video/toExamine', { id: this.videoid,quality:this.quality,refuse_reason:this.data.refuse_reason }).then(res => {
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.updateVisible(false);
          this.$emit('done');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
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
.ele-text-secondary {
  /* 添加一个容器，用于控制内容溢出情况 */
  overflow: auto; /* 或者使用 overflow: hidden; */
}

.content-wrapper img {
  max-width: 100%; /* 设置图片最大宽度为容器的100% */
  height: auto; /* 自适应高度 */
}
</style>
