<template>
  <div id="dplayer" ref="dplayer" v-loading="loading" class="paly-info"></div>
</template>

<script>
  import Hls from 'hls.js'
  import DPlayer from 'dplayer'

  export default {
    name: 'PalyInfo',
    props: {
      url: {
        type: String,
        default:
          'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
      },
      coverUrl: {
        type: String,
        default: '',
      },
      path720: {
        type: String,
        default: '',
      },
      path1080: {
        type: String,
        default: '',
      },      
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
      url: {
        handler(val) {
          if (val) {
            this.initDplayer()
          }
        },
        immediate: true,
      },
      coverUrl: {
        handler(val) {
          if (val) {
            this.initDplayer()
          }
        },
        immediate: true,
      },
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
        const dom = document.getElementById('dplayer')
        const options = {
          container: dom,
          autoplay: false,
          preload: 'none',
          mutex: true,
          video: {
            quality: [
              {
                name: '流畅',
                url: this.url,
                type: 'customHls',
              },
            ],
            defaultQuality: 0,
            pic: this.coverUrl,
            thumbnails: this.coverUrl,
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
        if (this.path720) {
          options.video.quality.push({
            name: '标清',
            url: this.path720,
            type: 'customHls',
          })
        }
        if (this.path1080) {
          options.video.quality.push({
            name: '高清',
            url: this.path1080,
            type: 'customHls',
          })
        }
        if(this.url.split('.')[this.url.split('.').length-1]=='mp4')
        {
          options.video={
            quality: [
              {
                name: '流畅',
                url: this.url,
                type: 'mp4',
              },
            ],
            defaultQuality: 0,
            pic: this.coverUrl,
            thumbnails: this.coverUrl,
            type: 'mp4',
            lang: 'zh-cn',
            customType: {
              
            },
          }
        }
        if (dom) {
          this.dp = new DPlayer(options)
          this.dp.on('ratechange', (res) => {
            console.log('res is change', res)
          })
          this.dp.on('play', () => {
            const state = this.dp.video.paused
            if (!state) {
              this.$emit('play')
            }
          })
          this.dp.on('fullscreen', () => {
            // console.log('fullscreen ing')
          })
          this.dp.on('fullscreen_cancel', () => {
            // console.log('fullscreen_cancel ing')
          })
          this.dp.on('resize', () => {
            this.$emit('resize')
          })
          this.dp.play()
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
    margin-top: 31px;
    box-sizing: border-box;
    /* max-width: 894px; */
    height: 503px;
  }
</style>
