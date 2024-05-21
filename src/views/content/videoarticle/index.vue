<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 状态分类 -->
      <el-tabs v-model="showType">
        <el-tab-pane
          v-for="item in typeOptions"
          :key="item.type"
          :label="item.name"
          :name="item.type"
        ></el-tab-pane>
      </el-tabs>

      <!-- 待审核 -->
      <auditPanel
        ref="table"
        v-if="showType == 2"
        :sectionStatusOptions="sectionStatusOptions"
      />

      <!-- 推荐 -->
      <recommendPanel
        ref="table"
        v-if="showType == 3"
        :sectionStatusOptions="sectionStatusOptions"
        @viewVideo="clickPlay"
      />

      <!-- 不推荐 -->
      <notRecommendedPanel
        ref="table"
        v-if="showType == 70"
        :sectionStatusOptions="sectionStatusOptions"
      />

      <!-- 驳回 -->
      <rejectPanel
        ref="table"
        v-if="showType == 5"
        :sectionStatusOptions="sectionStatusOptions"
      />

      <!-- 用户下架 -->
      <takeDownPanel
        ref="table"
        v-if="showType == 67"
        :sectionStatusOptions="sectionStatusOptions"
      />

      <!-- 回收站 -->
      <recyclePanel
        ref="table"
        v-if="showType == 68"
        :sectionStatusOptions="sectionStatusOptions"
      />

    </el-card>

  </div>
</template>
<script>
import { mapGetters } from "vuex";
import recommendPanel from './components/recommendPanel.vue'
import notRecommendedPanel from './components/notRecommendPanel.vue'
import auditPanel from './components/auditPanel.vue'
import rejectPanel from './components/rejectPanel.vue'
import takeDownPanel from './components/takeDownPanel.vue'
import recyclePanel from './components/recyclePanel.vue'
// 批量审核

export default {
  name: 'ExamVideo',
  components: {
    takeDownPanel,
    recyclePanel,
    auditPanel,
    recommendPanel,
    notRecommendedPanel,
    rejectPanel,
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      showType: '2',
      dialogVisible: false,
      toExamineId: 0,
      // 表格数据接口
      url: '/video/index',
      typeOptions: [
        {
          id: '3',
          type: '2',
          name: '待审核',
        },
        {
          id: '4',
          type: '3',
          name: '推荐',
        },
        {
          id: '5',
          type: '70',
          name: '不推荐',
        },
        {
          id: '6',
          type: '5',
          name: '审核未通过',
        },
        {
          id: '7',
          type: '67',
          name: '用户下架',
        },
        {
          id: '8',
          type: '68',
          name: '回收站',
        },
      ],
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: "left"
        },
        {
          prop: 'id',
          label: 'ID',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          columnKey: 'cover',
          label: '封面图片',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'cover'
        },
        {
          prop: 'uid',
          label: '用户ID',
          showOverflowTooltip: true,
          minWidth: 80,
          align: 'center',
        },
        {
          prop: 'title',
          label: '标题',
          showOverflowTooltip: true,
          minWidth: 200,
          align: 'left',
          slot: 'title'
        },
        {
          prop: 'is_coins',
          label: '限时免费',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'view_isrequires_vip',
        },
        {
          prop: 'status',
          label: '状态',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
          slot: 'status'
        },
        {
          prop: 'section_status',
          label: '切片状态',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
          slot: 'section_status'
        },
        {
          prop: 'likes',
          label: '点赞数',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
        },

        {
          prop: 'views',
          label: '浏览数',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
        },
        {
          prop: 'comments',
          label: '评论数',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
        },
        {
          prop: 'shares',
          label: '分享数量',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 250,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {'video_type':0},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      showRefuseEdit: false,
      infoData: null,
      playUrl: '', // TODO: 替换为状态书获取
      isPlayDialog: false, //播放弹窗
      upVideo: {},
      isGvDialog: false,
      videoStatusOptions: null,
      isLowerOptions: null, //视频上下架状态
      sectionStatusOptions: null, //切片系统视频状态
      dvid: 0,
      uid: 0,
      uploadType: 'minio'
    };
  },
  created() {
    this.where.show_type = this.show_type;
    /* this.getDicts("video_status").then(response => {
       this.videoStatusOptions = response.data;
     });*/
    /*this.getDicts("user_video_is_lower").then(response => {
      this.isLowerOptions = response.data;
    });*/
    this.getDicts("section_video_status").then(response => {
      this.sectionStatusOptions = response.data;
    });
    // this.getUploadType()
  },
  methods: {
    // 编辑视频
    editVideo(row) {
      this.row = row
      this.pageType = 'edit'
      this.isAddDialog = true
    },
    openDialog(id) {
      this.toExamineId = id;
      this.dialogVisible = true;
    },/* 更改状态 */
    view_isrequires_vip(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "view_isrequires_vip": row.is_coins      })
      this.$http.post('/video/viewIsrequiresVip', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          // this.reload();
        } else {
          row.status = !row.status ? 2 : 0;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    openBatchReviewDialog() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      // const loading = this.$loading({ lock: true });
      this.batchReviewVisible = true;
      this.batchReviewIds = this.selection.map(d => d.id);
    },
    closeBatchReviewDialog() {
      // loading.close();
      this.reload();
      this.batchReviewVisible = false;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    confirmDialog(data) {
      const loading = this.$loading({ lock: true });
      this.$http.post('/video/toExamine', { id: data.id,quality:data.type,refuse_reason:data.refuse_reason }).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    // 视频状态字典翻译
    videoStatusFormat(row) {
      return this.selectDictLabel(this.videoStatusOptions, row.status);
    },
    // 视频上架状态字典翻译
    isLowerFormat(row) {
      return this.selectDictLabel(this.isLowerOptions, row.is_lower);
    },
    // 切片系统视频状态字典翻译
    sectionStatusFormat(row) {
      return this.selectDictLabel(this.sectionStatusOptions, row.section_status);
    },
    // 点击上传Gv
    clickUpload(row) {
      console.log(row)
      this.dvid = row.id
      this.uid = row.uid
      this.isGvDialog = true
    },
    redirectToExternalLink() {
      var url = process.env.VUE_APP_USERADMIN_BASE_URL + '#/content/paid_video';
      window.open(url, '_blank');
      // 新窗口中打开外链
      // window.openEditn('http://www.example.com', '_blank');
    },
    closeGv() {
      this.isGvDialog = false
      this.reload()
    },
    // 点击播放
    clickPlay(url) {
      this.playUrl = url
      this.isPlayDialog = true
    },
    closePlay() {
      this.isPlayDialog = false
    },
    /* 刷新表格 */
    reload() {
      this.where.show_type = this.show_type;
      this.$refs.table.reload({ where: this.where });
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 显示编辑 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 拒绝 */
    refuse(row) {
      this.$prompt('请输入拒绝原因', '拒绝操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[^ \x22]+/,
        inputErrorMessage: '原因不能为空'
      }).then(({ value }) => {
        const loading = this.$loading({ lock: true });
        this.$http.post('/video/refuse', { ids: row.id, refuse_reason: value }).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
        // this.$message({
        //   type: 'success',
        //   message: '拒绝原因是: ' + value
        // });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });

    },

    /* 审核 */
    /* agree(row) {
       this.$confirm('确定要通过此用户视频吗？', '提示', {
         type: 'warning'
       }).then(() => {
         const loading = this.$loading({ lock: true });
         this.$http.post('/video/agree', { ids: row.id }).then(res => {
           loading.close();
           if (res.data.code === 0) {
             this.$message.success(res.data.msg);
             this.reload();
           } else {
             this.$message.error(res.data.msg);
           }
         }).catch(e => {
           loading.close();
           this.$message.error(e.message);
         });
       }).catch(() => {});
     },*/
    /* 上架 */
    set_lower_1(row) {
      this.$confirm('确定要上架此用户视频吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({ lock: true });
        this.$http.post('/video/setLower', { id: row.id,is_lower:0  }).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {});
    },
    /* 下架 */
    set_lower_2(row) {
      this.$prompt('请输入下架原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '请输入下架原因'
      }).then(({ value }) => {
        const loading = this.$loading({ lock: true });
        this.$http.post('/video/setLower', { id: row.id,lower_reason:value,is_lower:2 }).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      });
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      this.$http.post('/video/delete', { id: row.id }).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 视频推荐、取消推荐 */
    recomd(row, quality) {
      const loading = this.$loading({ lock: true });
      this.$http.post('/video/toExamine', { id: row.id, quality:quality }).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm('确定要删除选中的视频吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({ lock: true });
        this.$http.post('/video/delete', { id: this.selection.map(d => d.id) }).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {});
    },

    /* 更改是否催更状态 */
    setIsUrge(row) {
      const loading = this.$loading({ lock: true });
      let params = Object.assign({
        "id": row.id,
        "is_urge": row.is_urge
      })
      this.$http.post('/video/setIsUrge', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
        } else {
          row.is_urge = !row.is_urge ? 1 : 2;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    // 获取配置信息；确认上传方式
    getUploadType() {
      this.$http.get('/index/getConfig').then(res => {
        console.log('res is', res)
        console.log(res.data.data.upload.video_up_type)
        if (res && res.data && res.data.data.code === 0) {
          this.uploadType = res.data.data.upload.video_up_type || 'minio'
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
  }
}

</script>
<style scoped>
.price{color: #29cd29;}
</style>
