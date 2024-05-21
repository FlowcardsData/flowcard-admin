<template>
  <div class="panel">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="where" label-width="77px" class="ele-form-search" @keyup.enter.native="reload"
               @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="标题:">
              <el-input clearable v-model="where.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="用户账号:">
              <el-input clearable v-model="where.username" placeholder="请输入用户账号" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="reload">查询
              </el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :where="where" :datasource="url" :columns="columns" :selection.sync="selection"
                     height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
<!--          <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon"-->
<!--                     @click="redirectToExternalLink(null)">添加-->
<!--          </el-button>-->
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-view"
            @click="openDetail(row.id)"
            v-if="permission.includes('sys:operlog:detail')">查看详情
          </el-link>
          <el-popconfirm class="ele-action" title="确定取消此视频推荐吗？" @confirm="recomd(row, 2)"
                         v-if="permission.includes('sys:video:agree') && row.status == 3">
            <el-link type="danger" slot="reference" :underline="false" icon="el-icon-_dis">取消推荐
            </el-link>
          </el-popconfirm>
          <el-link type="primary" slot="reference"  @click="set_lower_2(row)" :underline="false" icon="el-icon-circle-close">下架
          </el-link>
        </template>

        <template slot="cover" slot-scope="{row}">
          <el-popover placement="right" width="220" trigger="hover">
            <img :src="row.cover" width="220" />
            <div slot="reference" style="cursor: pointer;">
              <el-avatar shape="square" :size="25" :src="row.cover" />
            </div>
          </el-popover>
        </template>

        <template slot="tag_arr" slot-scope="{row}">
          <el-tag size="small" v-for="(tag, index) in row.tag_arr" :key="index" :class="getTagClass()">
            {{ tag }}
          </el-tag>
        </template>

        <template slot="status">
          <el-tag type="success" size="small">上架中</el-tag>
        </template>

      </ele-pro-table>
      <!-- 详情弹窗 -->
      <detail :visible.sync="showInfo" :videoid="videoid" @done="reload"/>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import detail from "../detail.vue";

export default {
  name: 'TranscodingPanel',
  components: {detail},
  props: {
    sectionStatusOptions: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      // 是否显示查看弹窗
      showInfo: false,
      videoid: 0,
      showType: '3',
      // 表格搜索条件
      where: {'video_type':2, 'show_type':3},
      dialogVisible: false,
      batchReviewVisible: false,
      batchReviewIds: '',
      toExamineId: 0,
      // 表格数据接口
      url: '/video/index',
      activeTab: '2',
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
          prop: 'title',
          label: '标题',
          showOverflowTooltip: true,
          minWidth: 200,
          align: 'center'
        },
        {
          prop: 'tag_arr',
          label: '图文标签',
          minWidth: 150,
          align: 'center',
          slot: 'tag_arr'
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
          prop: 'uid',
          label: '创建者ID',
          showOverflowTooltip: true,
          minWidth: 80,
          align: 'center',
        },
        {
          prop: 'username',
          label: '发布用户账号',
          showOverflowTooltip: true,
          minWidth: 120,
          align: 'center',
        },
        {
          prop: 'likes',
          label: '点赞数',
          showOverflowTooltip: true,
          minWidth: 100,
          sortable: 'custom',
          align: 'center',
        },

        {
          prop: 'views',
          label: '浏览数',
          showOverflowTooltip: true,
          minWidth: 100,
          sortable: 'custom',
          align: 'center',
        },
        {
          prop: 'comments',
          label: '评论数',
          showOverflowTooltip: true,
          minWidth: 100,
          sortable: 'custom',
          align: 'center',
        },
        {
          prop: 'shares',
          label: '分享数',
          showOverflowTooltip: true,
          minWidth: 100,
          sortable: 'custom',
          align: 'center',
        },
        {
          prop: 'create_time',
          label: '创建时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
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
      dvid: 0,
      uid: 0,
      uploadType: 'minio'
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    tagColors() {
      return ['success', 'primary', 'warning', 'info'];
    },

  },
  methods: {
    /* 详情 */
    openDetail(videoid) {
      this.videoid = videoid;
      this.showInfo = true;
    },
    getTagClass() {
      const randomIndex = Math.floor(Math.random() * this.tagColors.length);
      return `el-tag--${this.tagColors[randomIndex]}`;
    },
    openDialog(id) {
      this.toExamineId = id;
      this.dialogVisible = true;
    },/* 更改状态 */
    view_isrequires_vip(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "video_type": row.video_type,
        "is_coins": row.is_coins      })
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
      this.where.show_type = this.showType;
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

<style lang="scss" scoped>
.panel {
  box-sizing: border-box;
}
</style>
