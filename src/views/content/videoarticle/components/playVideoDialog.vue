<!--
 * @Description: 视频详情弹窗
 * @Version: 2.0
 * @Autor: jiangwei
 * @Date: 2022-06-01 16:55:36
 * @LastEditors: jiangwei
 * @LastEditTime: 2022-09-05 13:43:16
-->
<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    title="播放视频"
    top="3vh"
    :visible="visible"
    width="800px"
    @close="close"
  >
    <div class="play_box">
      <playVue v-if="visible" :url="url" />
    </div>
    <template #footer>
      <el-button @click="close">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import playVue from '@/components/play.vue'

  export default {
    name: 'VideoInfoDialog',
    components: {
      playVue,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },

      playUrl: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        url: '',
      }
    },
    watch: {
      playUrl: {
        handler(val) {
          this.url =  val
        },
        immediate: true,
      },
    },
    created() {
      this.url =  this.playUrl
    },
    methods: {
      close() {
        this.$emit('close')
      },
    },
  }
</script>
<style scoped>
  .play_box {
    width: 100%;
  }
  .play {
    width: 100%;
  }
</style>
