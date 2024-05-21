<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    title="上传视频"
    top="15vh"
    :visible="visible"
    width="600px"
    @close="closeInput"
  >
    <div class="w">
      <el-tabs v-model="activeName">
        <el-tab-pane label="本地上传" name="first"></el-tab-pane>
        <!-- <el-tab-pane label="网盘上传" name="second"></el-tab-pane> -->
      </el-tabs>
      <!-- <div class="input-w" v-if="activeName == 'second'">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          :rules="rules"
          class="demo-form-inline"
        >
          <el-form-item label="网盘地址：" prop="url">
            <el-input
              v-model="form.url"
              placeholder="请输入网盘地址"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="closeInput">取消</el-button>
          <el-button type="primary" @click="cloudDownMV">确定</el-button>
        </div>
      </div> -->

      <div v-if="activeName == 'first'" class="uploadBox">
        <div v-loading="loading" element-loading-text="文件上传中请勿关闭弹窗">
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
  import { cloudDown } from '@/api/uploadFile'
  import axios from 'axios'
  import qs from 'qs'
  import { isUrl } from '../utils/validate'
  import uploadRequest from '@/utils/uploadRequest'
  import SparkMD5 from 'spark-md5'
  // import {
  //   updateVideoStatus,
  //   updateMvStatus,
  //   updateTvStatus,
  // } from '@/api/video'

  // const CancelToken = axios.CancelToken

  export default {
    props: {
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
      video_type: {
        type: String,
        default: 'video',
      },
    },
    data() {
      const validateUrl = (rule, val, cb) => {
        if (!val) {
          return cb(new Error('地址不能为空'))
        } else if (isUrl(val)) {
          cb()
        } else {
          return cb(new Error('请输入合法的下载地址'))
        }
      }
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
        token: '',
        form: {
          url: '',
        },
        rules: {
          url: [{ validator: validateUrl, trigger: 'blur' }],
        },
        vId: 0,
        file: '',
        // url: '',
        pre: 0,
        showForm: false,
        files: [],
        donwUrl: '',
        uploadId: '',
        chunkNum: 0,
        currentFile: {
          filename: '',
          size: 0,
          progress: 0,
          stats: 1,
          chunkList: [],
        },
        maxConcurrentUploads: 6,
        md5: '',
        stop: false,
        oss_type:'',
      }
    },
    methods: {
      // 获取待上传文件的 MD5 值
      getMD5(file) {
        return new Promise((resolve, reject) => {
          const blobSlice =
              File.prototype.slice ||
              File.prototype.mozSlice ||
              File.prototype.webkitSlice,
            chunkSize = 2097152, // Read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader()

          let currentChunk = 0

          fileReader.onload = (e) => {
            spark.append(e.target.result) // Append array buffer
            currentChunk++

            if (currentChunk < chunks) {
              loadNext()
            } else {
              const md5 = spark.end()
              resolve(md5)
            }
          }

          fileReader.onerror = () => {
            console.warn('oops, something went wrong.')
            reject()
          }

          function loadNext() {
            const start = currentChunk * chunkSize,
              end =
                start + chunkSize >= file.size ? file.size : start + chunkSize

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
          }

          loadNext()
        })
      },

      // 获取分片大小

      closeInput() {
        // this.visible = false
        if (this.loading) {
          this.$alert('关闭后将终止上传，确认终止吗?', '提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              if (action === 'confirm') {
                this.isClose = true
                this.loading = false
                if (this.source) {
                  this.source.forEach((item) => {
                    item.cancel('取消请求')
                  })
                }
                if (this.source1) {
                  this.source1.cancel('取消请求')
                }
                clearTimeout(this.timer)
                this.$emit('close')
                this.progress = 0
              } else {
                this.isClose = false
              }
            },
          })
        } else {
          this.$emit('close')
        }
      },
      async beforeAvatarUpload(file) {
        // 获取文件名称
        this.fileName = file.name
        // 获取文件 MD5 值；检查当前文件是否已经上传过
        try {
          this.md5 = await this.getMD5(file)
          // const res = await this.$http.post('/Video/checkVideoByMd5', {
          //   md5: this.md5,
          // })
          // if (res.data.code === 0 && !res.data.data) {
          //   this.$message({
          //     message: '文件已存在;请更换视频上传',
          //     type: 'success',
          //   })
          //   this.stop = true
          //   this.$emit('close')
          //   return false
          // }
        } catch (error) {
          console.log(error)
          return false
        }

        // 获取文件大小
        this.fileSize = file.size
        return true
      },
      async putinMirror(files) {
        // const md5 = await this.getMD5(files.file)
        if (this.stop) {
          this.stop = false
          return false
        }
        const md5 = this.md5 || 'text'
        // 获取文件后缀
        const ext = files.file.name.split('.').pop()
        // 获取文件名称
        const name = `${md5.substring(0, 2)}/${md5}.${ext}`;
        const file = files.file
        this.currentFile.filename = file.name
        this.currentFile.size = file.size
        const chunkSize = 1024*1024*10*2 // 30MB
        this.loading = true
        // 文件大于默认分片大小
        if (file.size > chunkSize) {
          // 获取文件分片
          const tmp = this.createFileChunk(file, chunkSize)
          this.currentFile.chunkList = tmp
          this.showForm = true // 显示上传进度条
          this.chunkNum = tmp.length // 获取分片数量
          // 获取文件上传地址参数
          const list = tmp.map((item) => {
            return {
              part_no: item.part_no * 1 + 1,
            }
          })

          // 获取文件上传的 url
          const res = await this.getUrls(list, name)
          const urls = res.url
          const len = urls.length
          // 根据 part_no 文件块编号将上传 id 和文件块 一一对应
          if (tmp.length === len) {
            try {
              await this.uploadChunk({ len, urls, tmp })
              const p = {
                filename: res.filename,
                UploadId: tmp[0].uploadId,
                contentType: 'video',
                parts: [],
                oss_type:this.oss_type
              }
              // 合并文件
              await this.mergerChunk(p)
              this.loading = false
            } catch (error) {
              console.log('取消请求', error)
              this.loading = false
            }
          } else {
            throw new Error('获取上传地址出错')
          }
        } else {
          // 文件小于分片
          this.file = file
          this.showForm = true // 显示上传进度条
          await this.getUrl(name)
          await this.handleUpload(file)
          this.loading = false
        }
      },

      // 获取单文件上传地址
      async getUrl(name) {
        const params = {
          filename: name,
        }
        const res = await this.$http.post('/index/getR2Url', params)
        console.log('获取单文件上传地址', res)
        if (res && res.data.code === 0) {
          this.url = res.data.data.url
          this.oss_type = res.data.data.oss_type
        }
      },
      // 获取文件块上传的地址集合
      async getUrls(list, filename) {
        const params = {
          filename,
          blocks: list,
          contentType: 'video'
        }
        const res = await this.$http.post('/index/getBlockR2Urls', params)
        console.log('获取文件块上传的地址集合', res)
        if (res && res.data.code === 0) {
          this.oss_type = res.data.data.oss_type
          return res.data.data
        }
      },
      // 整体文件上传
      async handleUpload(file) {
        try {
          const that = this
          const res = await uploadRequest({
            url: this.url,
            method: 'put',
            data: file,
            onUploadProgress(pe) {
              const loaded = pe.loaded
              const total = pe.total
              const tmp = Math.round(loaded / total).toFixed(4) * 100
              that.progress = tmp.toString().substring(0, 4) * 1
            },
          })
          console.log('单文件上传成功111', res)
          // debugger
          if (res.status === 200) {
            const index = this.url.indexOf('?')
            this.donwUrl = this.url.substring(0, index)
            this.form.url = this.donwUrl
            this.cloudDownMV()
            this.$message.success('文件上传成功')
          } else {
            this.$message.error('文件上传失败')
          }
        } catch (error) {
          console.log(error)
          this.$message.error('文件上传失败')
        }
      },
      // 分片上传
      uploadChunk({ len, urls, tmp }) {
        return new Promise((resolve, reject) => {
          // 处理待上传的参数
          for (let i = 0; i < len; i++) {
            const url = urls[i]
            const idx = url.indexOf('?')
            const str = url.substring(idx + 1)
            const obj = qs.parse(str)
            const num = obj.partNumber * 1 - 1
            const index = tmp.findIndex((item) => item.part_no * 1 == num)
            if (index > -1) {
              tmp[index].uploadId = obj.uploadId
              tmp[index].url = url
            } else {
              throw new Error('获取地址出错了')
            }
          }
          // 创建一个 uploadPromises 数组用于存储上传分片的 Promise
          // const uploadPromises = []

          const processChunks = async (chunks) => {
            for (let i = 0; i < chunks.length; i += this.maxConcurrentUploads) {
              const chunk = chunks.slice(i, i + this.maxConcurrentUploads)

              const currentPromises = chunk.map((item) => {
                const url = item.url
                const file = item.file
                const c = axios.CancelToken.source()
                this.source.push(c)
                return uploadRequest({
                  url,
                  method: 'put',
                  data: file,
                  cancelToken: c.token,
                  onUploadProgress: this.handleUploadProgress(item),
                })
                  .then((res) => {
                    this.chunkNum--
                    if (this.chunkNum === 0) {
                      this.currentFile.stats = 2
                    }
                    return res
                  })
                  .catch((err) => {
                    return err
                  })
              })

              await Promise.all(currentPromises)
            }
          }
          processChunks(tmp)
            .then(() => {
              resolve(true)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 更新文件块的上传进度字段 progress
      handleUploadProgress(item) {
        return (p) => {
          item.progress = parseInt(String((p.loaded / p.total) * 100))
          this.updateChunkUploadStatus(item)
        }
      },
      updateChunkUploadStatus(item) {
        let status = 1 // '文件上传中'
        if (item.progress >= 100) {
          status = 2
        }
        const chunkIndex = item.part_no

        // 修改状态
        this.currentFile.chunkList[chunkIndex].status = status
        this.currentFile.chunkList[chunkIndex].progress = item.progress || 0
        this.currentFile.chunkList = this.currentFile.chunkList.map((item) => ({
          ...item,
        }))
        // 更新分片状态

        const tmp = this.currentFile.chunkList.map((f) => {
          if (f.file && f.file.size) {
            return f.file.size * (f.progress / 100)
          }
          return 0
        })
        const uploadedSize = tmp.reduce((acc, cur) => acc + cur) || 0
        // debugger
        const pro = parseInt(
          ((uploadedSize / this.currentFile.size) * 100).toFixed(2)
        )
        this.progress = pro
        // 更新文件状态
        // TODO
      },
      // 文件分片
      createFileChunk(file, size) {
        const fileChunkList = []
        let count = 0
        let i = 0
        while (count < file.size) {
          fileChunkList.push({
            upload_id: '',
            filename: file.name,
            part_no: i,
            progress: 0,
            file: file.slice(count, count + size),
            url: '',
            status: 0, // 0 等待上传 1 上传中 2 已完成
          })
          count += size
          i++
        }
        return fileChunkList
      },
      // 合并已上传分片
      async mergerChunk(params) {
        try {
          const res = await this.$http.post(
            '/index/mergeMultiPartUpload',
            params
          )
          // console.log('合并结果', res)
          if (res && res.data.code * 1 === 0) {
            this.donwUrl = res.data.data
            this.form.url = res.data.data.url
            this.cloudDownMV()
            this.$message.success('文件上传成功')
          } else {
            this.$message.error('文件上传失败')
          }
        } catch (err) {
          this.$message.error('文件上传失败')
          console.log('err is', err)
        }
      },

      // 云下载
      async cloudDownMV() {
        try {
          // const url = encodeURIComponent(this.form.url)
          const params = {
            video_id: this.dvid,
            type: this.type,
            oss_type: this.oss_type,
            // down_url: this.form.url,
            down_url: this.filename,
            video_type: this.video_type,
          }
          // 上传后的系统回调
          const res = await cloudDown(params)
          if (res && res.code == 0) {
            // this.$baseMessage(res.msg, 'success', 'vab-hey-message-success')
            // TODO: 同步数据
            // const postData = {
            //   ids: this.dvid,
            // }
            // let res1 = null
            // if (this.type == 'gv') {
            //   res1 = await updateVideoStatus(postData)
            // } else if (this.type == 'mv') {
            //   res1 = await updateMvStatus(postData)
            // } else if (this.type == 'tv_video') {
            //   res1 = await updateTvStatus(postData)
            // }
            // this.$message.success('success')
            this.closeInput()
          }
        } catch (err) {
          console.error(err)
        }
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
