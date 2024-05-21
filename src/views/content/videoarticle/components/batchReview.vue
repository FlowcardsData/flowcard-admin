<template>
  <el-drawer destroy-on-close :visible="visible" @update:visible="updateVisible" title="批量审核"
    :close-on-click-modal="false" size="88%">
    <el-row class="videoView" :v-if="currentList.length">
      <el-col v-for="(item, index) in currentList" :key="index" :span="6">
        <div class="video-item">
          <div class="player-wrapper">
            <playVue :rowData="item" />
          </div>
          <div class="player-title">
            <p style="font-size: 13px">{{ item.title }}</p>
          </div>
          <el-radio-group v-model="item.quality">
            <el-radio class="radio-item" label="1">推荐</el-radio>
            <el-radio class="radio-item" label="2">不推荐</el-radio>
            <el-radio class="radio-item" label="3">驳回</el-radio>
          </el-radio-group>
          <div class="reason" v-if="item.quality === '3'">
            <p style="width: 40%">驳回原因</p>
            <el-input v-model="item.refuse_reason" placeholder="请输入内容">
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 分页器 -->
    <el-pagination :current-page="currentPage" :page-size="8" layout="total, prev, pager, next"
      @current-change="handleCurrentChange" :total="videoList.length">
    </el-pagination>
    <el-row type="flex" class="button" justify="center">
      <el-button type="primary" @click="playAllVideos">全部播放</el-button>
      <el-button type="primary" @click="submitStatus">提交审核状态</el-button>
      <el-button @click="cancel">退出</el-button>
    </el-row>
  </el-drawer>
</template>

<script>
import playVue from './player.vue'
export default {
  components: {
    playVue
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    ids: {
      type: [Array, String],
      required: true
    }
  },
  data() {
    return {
      videoList: [],
      currentList: [],
      currentPage: 1,
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.$http.post('/video/getAll', { ids: this.ids }).then(res => {
          if (res.data.list) {
            res.data.list.map((item) => {
              item.quality = '1';
              item.playing = false
              return item
            })
            this.videoList = res.data.list;
            this.listCut(1, res.data.list)

          } else {
            this.videoList = []
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    }
  },
  mounted() {

  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },

    // 设置当前页的8个视频
    listCut(index, list) {
      let startToCut = 0;
      let lengthToCut = 8;
      if (index > 1) {
        startToCut = (index - 1) * 8
      }
      if (startToCut + lengthToCut > list.length) {
        lengthToCut = list.length - startToCut + 1
      }
      let newList = list.slice(startToCut, startToCut + lengthToCut);
      this.currentList = newList

    },

    // 分页按钮
    handleCurrentChange(val) {
      this.currentPage = val
      this.listCut(val, this.videoList)
    },

    // 暂停、播放所有
    playAllVideos() {
      let newList = []
      this.currentList.map((item) => {
        newList.push({
          ...item,
          playing: !item.playing
        })
        return item
      })
      this.currentList = newList
      // 全部播放视频逻辑
    },

    //批量审核
    submitStatus() {
      console.log(this.videoList);

      this.$confirm('确定要审核选中的视频吗?', '提示', {
        type: 'warning'
      }).then(() => {
        let params = this.videoList.map((item) => ({
          id: item.id,
          quality: item.quality,
          refuse_reason: item.refuse_reason,
        }));

        const loading = this.$loading({ lock: true });
        this.$http.post('/video/batchReview', params)
          .then(res => {
            loading.close();
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              // 触发成功事件，可以传递需要的数据
              this.$emit('success', res.data);
            } else {
              this.$message.error(res.data.msg);
            }
            // 请求处理完毕后再执行cancel事件，无论成功或失败
            this.$emit('cancel');
          })
          .catch(e => {
            loading.close();
            this.$message.error(e.message);
            // 同样，在捕获异常后也需要执行cancel事件
            this.$emit('cancel');
          });
      }).catch(() => {
        // 这里通常是处理取消确认弹窗的逻辑，如果没有则不需要写内容
      });
      // 提交审核状态逻辑结束
    },
    confirm() {
      const data = {
        type: this.selectedOption,
        refuse_reason: this.form.refuseReason,
      };
      this.$emit('close', data);
      this.updateVisible(false);
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
  }
};

</script>



<style type="text/css">
.videoView {
  box-sizing: border-box;
  height: 80vh;
  padding: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: scroll;
}

.el-radio {
  font-weight: 400;
  margin-bottom: 5px
}

.reason {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.video-item {
  position: relative;
  box-sizing: border-box;
  height: 300px;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 5px;
}

.radio-item {
  width: 21%;
}

.player-wrapper {
  height: 60%;
  box-sizing: border-box;
  width: 100%
}

.player-title {
  min-height: 40px;
  margin-top: 5px;
  margin-bottom: 5px
}

.button {
  width: 100%;
  margin-top: 50px
}

.cover-image {
  width: 100%;
  height: 100%;
}

.player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
