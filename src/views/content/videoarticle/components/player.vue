<template>
  <div :id="this.rowData.id" ref="dplayer" v-loading="loading" class="paly-info"></div>
</template>

<script>
import Hls from 'hls.js'
import DPlayer from 'dplayer'

export default {
  name: 'Player',
  props: {
    rowData: Object,
  },
  data() {
    return {
      dp: null,
      DPlayer: null,
      Hls: null,
      loading: true,
    }
  },
  watch: {
    rowData: {
      handler(newValue) {
        this.initDplayer()
        if (this.dp) {
          if (newValue.playing) {
            this.dp.play()
          } else {
            this.dp.pause()
          }
        }

      },
      immediate: true
    }
  },
  mounted() {
    this.initDplayer()
  },
  beforeDestroy() {
    if (this.dp) {
      this.dp.pause()
      setTimeout(() => {
        this.dp.destroy()
      }, 300)
    }
    window.onresize = null
  },
  methods: {
    initDplayer() {
      const dom = document.getElementById(this.rowData.id)
      const options = {
        container: dom,
        autoplay: false,
        preload: 'none',
        mutex: false,
        video: {
          quality: [
            {
              name: '流畅',
              url: this.rowData.href_w,
              type: 'customHls',
            },
          ],
          defaultQuality: 0,
          pic: this.rowData.cover,
          thumbnails: this.rowData.cover,
          type: 'customHls',
          lang: 'zh-cn',
          customType: {
            customHls(video) {
              const hls = new Hls()
              hls.loadSource(video.src)
              hls.attachMedia(video)
            }
          },
        },
      }
      this.loading = false
      if (dom) {
        this.dp = new DPlayer(options)
        this.dp.on('play', () => {
          const state = this.dp.video.paused
          if (!state) {
            this.$emit('play')
          }
        })
        // this.dp.play()
      }
    },
    play() {
      if (this.dp) {
        this.dp.play()
      }
    },
    pause() {
      if (this.dp) {
        const state = this.dp.video.paused
        if (!state) {
          this.dp.pause()
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.paly-info {
  box-sizing: border-box;
  /* max-width: 894px; */
  height: 100%;
}

.dplayer-volume {
  display: none;
}
</style>
