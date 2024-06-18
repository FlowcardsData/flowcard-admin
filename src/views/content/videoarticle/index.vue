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

      <!-- 推荐 -->
      <recommendPanel
        ref="table"
        v-if="showType == 3"
      />


    </el-card>

  </div>
</template>
<script>
import { mapGetters } from "vuex";
import recommendPanel from './components/recommendPanel.vue'
// 批量审核

export default {
  name: 'ExamVideo',
  components: {
    recommendPanel,
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      showType: '3',
      dialogVisible: false,
      toExamineId: 0,
      // 表格数据接口
      url: '/video/index',
      typeOptions: [
        {
          id: '4',
          type: '3',
          name: '产品管理',
        }
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
      isLowerOptions: null, //视频上下架状态
      dvid: 0,
      uid: 0,
      uploadType: 'minio'
    };
  },
  created() {
    this.where.show_type = this.show_type;
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
    redirectToExternalLink() {
      var url = process.env.VUE_APP_USERADMIN_BASE_URL + '#/content/paid_video';
      window.open(url, '_blank');
      // 新窗口中打开外链
      // window.openEditn('http://www.example.com', '_blank');
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
  }
}

</script>
<style scoped>
.price{color: #29cd29;}
</style>
