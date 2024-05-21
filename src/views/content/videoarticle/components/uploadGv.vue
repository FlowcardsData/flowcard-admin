<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    title="上传视频1"
    top="15vh"
    :visible="visible"
    width="600px"
    @close="closeInput"
  >
    <div class="w">
      <el-tabs v-model="activeName">
        <el-tab-pane label="本地上传" ></el-tab-pane>
      </el-tabs>

      <div  class="uploadBox">
        <div v-loading="loading" element-loading-text="文件上传中请勿关闭弹窗">
       <!--    <el-upload
            ref="upload"
            accept=".mp4,.avi,.mkv"
            action="#"
            :auto-upload="true"
            :before-upload="beforeAvatarUpload"
            class="mirror-upload"
            :http-request="putinMirror"
            :limit="1"
            :show-file-list="false"
          > -->
          <el-upload
            ref="upload"
            accept=".mp4,.avi,.mkv"
            action="#"
            :auto-upload="true"
            :before-upload="beforeAvatarUpload"
            class="mirror-upload"
            :http-request="putinMirror"
            :limit="1"
            :show-file-list="false"
          >
            <el-button type="primary">上传视频</el-button>
          </el-upload>
          <div class="fileType">仅支持上传视频文件</div>
        </div>
        <div style="width: 75%; margin: 20px auto">
          <el-progress :indeterminate="true" :percentage="progress" />
        </div>
        <div class="dialog-footer">
          <el-button @click="closeInput">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import {
    checkUploadState,
    uploadFile,
    getUrl,
    cloudDown,
  } from '@/api/uploadFile'
  import axios from 'axios'

  const CancelToken = axios.CancelToken

  export default {
    name: 'UploadMV',
    props: {
      uid:{
        type: Number,
        default: 0,
      },
      visible: {
        type: Boolean,
        default: false,
      },
      dvid: {
        type: [String, Number],
        default: '',
      },
      type: {
        type: String,
        default: 'mv',
      },
    },
    data() {

      return {
        activeName: 'first',
        num: 10, // 一次最多上传10片
        progress: 0, //进度条
        sliceSize: 10, //切片大小
        isClose: true,
        source: [],
        source1: null,
        tmp: [],
        loading: false,
        timer: 0,
        md5Hash: '',
        sha1Hash: '',
        fileSize: 0,
        totalSlice: 0, // 切片总数
        chunkSize: 5 * 1024 * 1024, // 切片默认大小
        fileName: '',
        loadSizeMap: [],
        uploadIndex: 0, // 当前正在上传的文件
        uploadedChunkMap: [], // 已上传的分片
        url: '',
        chunkUploadURL: '',
        getUploadStatusURL: '',
        fileDuration: 0,
        token: '',
        isUp: true,// 是否允许上传
        form: {
          url: '',
        },
        rules: {
          // url: [{ validator: validateUrl, trigger: 'blur' }],
        },
        vId: 0,
        uploadRule:null,//上传规则
      }
    },
    watch: {
      dvid: {
        handler(val) {
          if (val) {
            this.getUploadUrl()
          }
        },
        immediate: true,
      },
    },
    methods: {
      // 获取分片大小
      closeInput() {
        this.progress = 0
        // this.visible = false
        if (this.loading) {
          this.$alert('关闭后将终止上传，确认终止吗?', '提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              if (action === 'confirm') {
                this.isClose = true
                this.loading = false
                if (this.source) {
                  // console.log('this.source is', this.source)
                  this.source.forEach((item, index) => {
                    console.log('取消请求', index)
                    item.cancel('取消请求')
                  })
                }
                if (this.source1) {
                  console.log('取消请求')
                  this.source1.cancel('取消请求')
                }
                console.log('清楚定时请求', this.timer)
                clearTimeout(this.timer)
                this.$emit('close')
              }
            },
          })
        } else {
          this.$emit('close')
        }
      },
      //获取视频时长
      handleGetSize(file){
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const media = new Audio();
            media.src = event.target.result;
            media.onloadedmetadata = () => {
              const time = media.duration.toFixed(2);
              console.log("视频时长：", time)
              resolve(time);
            };
            media.onerror = (error) => {
              reject(error);
            };
          };
          reader.readAsDataURL(file);
        })
      },
      async beforeAvatarUpload(file) {
        console.log('uploadRule', this.uploadRule);
        //验证发布数量
        /*if(this.uploadRule.video_publish && (this.uploadRule.video_publish <= this.uploadRule.release_video_count)){
          this.$refs.upload.clearFiles();
          this.isUp = false;
          this.$message.error('发布受限，当前用户等级最多发布' + this.uploadRule.video_publish + '个视频');
          return false;
        }*/

        //验证时长
        const video_time = await this.handleGetSize(file)
        if(video_time > this.uploadRule.video_duration){
          this.$refs.upload.clearFiles();
          this.isUp = false;
          this.$message.error('发布受限，当前用户上传时长不能超过：'+this.uploadRule.video_duration+'秒');
          return false;
        }

        try {
          const data = {
          video_id: this.dvid,
        }
        const res = await getUrl(data)
        console.log('上传地址', res)
        // debugger
        if (res && res.code === 0) {
          this.token = res.data.token
          this.chunkUploadURL = res.data.chunk_upload
          this.getUploadStatusURL = res.data.getUploadStatus
          this.vId = res.data.cut_video_id
        }
        } catch (err) {
          console.error(err)
        }
      },
      async putinMirror(file) {
        if(this.isUp !== true) return false
        try {
          this.loading = true
          this.fileSize = file.file.size
          this.fileName = file.file.name
          window.md5File(file.file, (md5Hash) => {
            this.md5Hash = md5Hash
            window.sha1File(file.file, (sha1Hash) => {
              this.sha1Hash = sha1Hash
              // 将文件切片准备上传参数
              this.handleFileChunk(file.file)
              this.monitor(() => {
                this.startUploadFile()
              })
            })
          })
        } catch (err) {
          console.error(err)
        }
      },
      // 文件切片
      handleFileChunk(file) {
        this.tmp = []
        const sliceSize = this.chunkSize // 切片大小
        const fileSize = this.fileSize
        const fileName = this.fileName
        this.totalSlice = Math.ceil(fileSize / sliceSize)
        for (let i = 0; i < this.totalSlice; i++) {
          const start = i * sliceSize
          const chunk = file.slice(start, Math.min(fileSize, start + sliceSize))
          this.tmp.push({
            data: chunk,
            name: fileName,
            total: this.totalSlice,
            size: fileSize,
            index: i + 1,
            md5Hash: this.md5Hash,
            sha1Hash: this.sha1Hash,
            shardSize: sliceSize, // 切片大小
            // video_id: this.dvid,
          })
        }
        // console.log('切片结果', this.tmp)
      },

      async startUploadFile() {
        let len = this.num // 最多上传几片
        //
        if (!this.loading) {
          console.log('上传已终止')
          return
        }
        for (let i = this.uploadIndex; i < this.uploadIndex + len; i++) {
          // this.isClose = false

          if (i >= this.totalSlice) {
            console.log('遍历完全部的块了')
            return
          }
          // 当前分片已上传跳过该分片
          if (
            this.uploadedChunkMap.length &&
            this.uploadedChunkMap.indexOf(i + 1) > -1
          ) {
            len--
            if (len <= 0) {
              // 上传下一组分片
              this.uploadIndex = this.uploadIndex + this.num
              this.startUploadFile()
            }
            continue // 跳出当前循环
          }
          const row = this.tmp[i]

          const form = new FormData()
          const totalSize = row.size
          const nowChunk = row.index - 1
          Object.keys(row).forEach((key) => {
            form.append(key, row[key])
          })
          //当前是第几片
          const c = CancelToken.source()
          this.source.push(c)
          // console.log('token::::', this.token)
          // debugger
          uploadFile(form, {
            url: this.chunkUploadURL,
            cancelToken: c.token,
            onUploadProgress: (e) => {
              // 计算上传进度
              // 已上传的文件大小加上当前上传的文件大小比上文件总大小获得当前文件上传进度
              this.loadSizeMap[nowChunk] = e.loaded * 1
              const loaded = this.loadSizeMap.reduce((p, c) => {
                return (p + c) * 1
              }, 0)
              const p = parseInt((loaded / totalSize) * 100)
              this.progress = p
            },
            headers: {
              authorization: this.token,
            },
          })
            .then((res) => {
              len--
              console.log('分片上传成功：', res)
              if (res) {
                if (res.status === 0) {
                  console.log('上传失败')
                } else if (res.status === -1) {
                  alert('上传失败，系统磁盘空间不足')
                }
              }
              if (len <= 0 && this.loading) {
                // 继续上传下一组
                this.uploadIndex = this.uploadIndex + this.num
                this.startUploadFile()
              }
            })
            .catch((err) => {
              console.log('分片上传出错了', err)
              console.log('该分片上传失败' + (i + 1))
              len--
              if (len <= 0 && this.loading) {
                // 继续上传下一组
                this.uploadIndex = this.uploadIndex + this.num
                this.startUploadFile()
              }
            })
        }
      },
      async monitor(cb) {
        try {
          const form = new FormData()
          form.append('md5Hash', this.md5Hash)
          form.append('sha1Hash', this.sha1Hash)
          form.append('total', this.totalSlice)
          form.append('size', this.fileSize)
          form.append('shardSize', this.chunkSize)
          form.append('video_id', this.vId)
          form.append('name', this.fileName)

          this.source1 = CancelToken.source()
          const res = await checkUploadState(form, {
            url: this.getUploadStatusURL,
            cancelToken: this.source1.token,
            headers: {
              authorization: this.token,
            },
          })
          console.log('文件检查结果：', res)
          if (res) {
            // 更新已上传的分片数据
            if (res.data && res.data.list && res.data.list.length) {
              this.uploadedChunkMap = res.data.list
              console.log('已上传的分片', res.data.list)
            }

            if (res.status === 1) {
              console.log('上传成功或已上传')
              clearTimeout(this.timer) // 重置计时器
              this.loading = false
              this.isClose = true
              // this.$baseMessage(res.msg, 'success', 'vab-hey-message-success')
              this.$message.success(res.msg, 'success', 'vab-hey-message-success')
              this.$emit('close')
              return
            }
            // 开始上传文件
            if (cb && typeof cb == 'function') {
              cb()
            }
            // 轮训检查上传结果
            this.timer = setTimeout(() => {
              this.monitor()
              clearTimeout(this.timer)
            }, 2000)
          }
        } catch (err) {
          debugger
          console.error(err)
          // 文件上传失败尝试上传缺失分片
          this.timer = setTimeout(() => {
            this.monitor()
            clearTimeout(this.timer)
          }, 2000)
        }
      },
      // 上传文件
      async uploadFiles(row) {
        //构造一个表单，FormData是HTML5新增的
        console.log('参数对象', row)
        const form = new FormData()
        const totalSize = row.size
        const nowChunk = row.index - 1
        console.log('nowChunk index:::', nowChunk)
        const sliceSize = row.shardSize
        console.log('sliceSize is:::', sliceSize)
        Object.keys(row).forEach((key) => {
          form.append(key, row[key])
        })
        console.log('待上传的参数', form)
        const url = this.chunkUploadURL
        console.log('url is', url)
        //当前是第几片
        const res = await uploadFile(form, {
          url: url,
          onUploadProgress: (e) => {
            // 计算上传进度
            // that.progress = parseInt((e.loaded / e.total) * 100)
            // 已上传的文件大小加上当前上传的文件大小比上文件总大小获得当前文件上传进度
            // const loaded = nowChunk * sliceSize + e.loaded * 1
            this.loadSizeMap[nowChunk] = e.loaded * 1
            const loaded = this.loadSizeMap.reduce((p, c) => {
              return (p + c) * 1
            }, 0)
            console.log('切片编号', nowChunk)
            console.log('已上传文件大小', loaded)
            console.log('待上传文件大小', totalSize)
            const p = parseInt((loaded / totalSize) * 100)
            console.log('p is %%%', p)
            this.progress = p
          },
        })
        console.log('上传文件：：', res)
        if (res) {
          if (res.status === 0) {
            console.log('上传失败')
          } else if (res.status === -1) {
            alert('上传失败，系统磁盘空间不足')
          }
        }
      },
      // 获取上传地址
      async getUploadUrl() {
        //根据用户获取可上传视频时长
        this.$http.post('/video/getUploadRule', {uid:this.uid}).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.uploadRule = res.data.data;
          } else {
            this.$message.error(res.data.msg);
            return false;
          }
        })
      },
      // 云下载
      async cloudDownMV() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              const params = {
                video_id: this.dvid,
                type: this.type,
                down_url: this.form.url,
              }
              const res = await cloudDown(params)
              if (res && res.code == 0) {
                this.closeInput()
              }
            } catch (err) {
              console.error(err)
            }
          }
        })
      },
    },
  }
</script>
<style scoped lang="scss">
  .fileType {
    margin-top: 10px;
    font-size: 12px;
    color: #8590a6;
  }
  .input-w {
    margin-top: 20px;
    .input {
      box-sizing: border-box;
      margin: 0 0 20px 0;
    }
  }
  .uploadBox {
    box-sizing: border-box;
    margin-top: 20px;
  }
  .dialog-footer {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
</style>
