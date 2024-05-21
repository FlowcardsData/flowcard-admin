<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <el-input :value="urlValue" @input="handleInput">
      <el-button slot="append" @click="openFile" >选择文件</el-button>
    </el-input>
    <input type="file" @change="handleFileUpload"  :accept="accept" ref="fileInput" style="display: none" />
    <!-- <button >Upload File</button> -->
    <!-- <span>{{ filename }}</span> -->
    <!-- 使用 element-ui 展示进度条 -->
    <el-progress v-if="showProgress" :percentage="uploadProgress" />
    <span v-if="showProgress">{{ uploadProgress }}%</span>
    <span >文件时长: {{ fileDuration }} s</span>
    <span v-if="errorMsg">{{ errorMsg }}</span>
  </div>
</template>

<script>
// import setting from "@/config/setting";
export default {

  name: "FileUploader",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
    duration: {
      type: [Number, String],
      default: 0,
    },
    accept: {
      type: String,
      default: "mp3,mp4,flv,zip,apk",
    },
  },
  data() {
    return {
      file: null,
      filename: "",
      urlValue: '',
      showProgress: false,
      uploadProgress: 0,
      fileDuration: 0,
      errorMsg: "",
    };
  },
  watch: {
    fileDuration: {
      immediate: true,
      handler(val) {
        this.$emit("update:duration", val);
      },
    },
    value: {
      immediate: true,
      handler(val) {
        this.urlValue = val;
      },
    },
    duration: {
      immediate: true,
      handler(val) {
        this.fileDuration = val;
      },
    },
  },
  methods: {
    handleInput(val) {
      this.urlValue = val;
      this.$emit("change", val);
    },
    // 打开文件选择对话框
    openFile() {
      this.$refs.fileInput.click();
    },
    handleFileUpload() {
      this.file = this.$refs.fileInput.files[0];
      this.filename = this.file ? this.file.name : "";

      if (this.file) {

        const fileType = this.filename.split(".").pop().toLowerCase();

        const accept = this.accept.split(",").map((item) => item.trim());
        if (!accept.includes(fileType)) {
          this.errorMsg = `Please select a ${this.accept} file.`;
          this.file = null;
          this.filename = "";
          return;
        }

        this.filename = this.file.name;

        // Get file duration for audio and video files
        if (fileType === "mp3" || fileType === "mp4" || fileType === "flv" || fileType === "zip" || fileType === "apk") {
          const reader = new FileReader();
          reader.onload = (event) => {
            const media = new Audio();
            media.src = event.target.result;
            media.onloadedmetadata = () => {
              this.fileDuration = media.duration.toFixed(2);
              this.$emit("update:duration", this.fileDuration);
            };
          };
          reader.readAsDataURL(this.file);
        } else {
          this.fileDuration = 0;
        }
      }

      this.uploadFile();
    },
    uploadFile() {
      if (this.file) {
        const formData = new FormData();
        formData.append("file", this.file);

        this.showProgress = true;
        // var token = setting.takeToken()
        const config = {
          headers: { "Content-Type": "multipart/form-data"},
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
        };

        this.$http
          .post(this.url, formData, config)
          .then((response) => {
            if (response.data.code === 0) {
              this.urlValue = response.data.data;
              this.$emit("input", response.data.data);
              this.showProgress = false;
              this.uploadProgress = 0;
            } else {
              this.errorMsg = response.data.msg;
              this.showProgress = false;
              this.uploadProgress = 0;
            }
            console.log(response);
            // alert("File uploaded successfully!");
            this.file = null;
            this.filename = "";
          })
          .catch((error) => {
            console.log(error);
            alert("File upload failed.");
          });
      } else {
        alert("Please select a file to upload.");
      }
    },
  },
};
</script>
