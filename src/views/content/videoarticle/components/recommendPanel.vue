<template>
  <div class="ele-body">
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
          <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openEdit(null)"
            v-if="permission.includes('sys:ad:add')">添加
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removeBatch"
            v-if="permission.includes('sys:ad:dall')">删除
          </el-button>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)"
            v-if="permission.includes('sys:ad:edit')">修改
          </el-link>
          <el-link type="primary" :underline="false" icon="el-icon-view" @click="openDetail(row.id)"
            v-if="permission.includes('sys:operlog:detail')">查看详情
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

        <template slot="status" slot-scope="{row}">
          <el-switch v-model="row.status" @change="set_lower_2(row)" :active-value="1" :inactive-value="0" />
        </template>

      </ele-pro-table>
      <!-- 详情弹窗 -->
      <detail :visible.sync="showInfo" :videoid="videoid" @done="reload" />
      <add :visible.sync="showAdd" @done="reload" :rowdata="current" />
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import detail from "../detail.vue";
import add from "./add.vue";

export default {
  name: 'TranscodingPanel',
  components: { detail, add },
  props: {
    sectionStatusOptions: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      // 是否显示查看弹窗
      showInfo: false,
      showAdd: false,
      videoid: 0,
      showType: '3',
      // 表格搜索条件
      where: { 'video_type': 2, 'show_type': 3 },
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
          columnKey: 'cover',
          label: '封面',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
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
          prop: 'content',
          label: '简介',
          showOverflowTooltip: true,
          minWidth: 200,
          align: 'center'
        },
        {
          prop: 'price',
          label: '佣金金额',
          minWidth: 100,
          align: 'center',
        },
        {
          prop: 'status',
          label: '是否上架',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
          slot: 'status'
        },
        {
          prop: 'id',
          label: 'ID',
          align: 'center',
          showOverflowTooltip: true,
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
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    tagColors() {
      return ['success', 'primary', 'warning', 'info'];
    },

  },
  methods: {
    openAdd() {
      this.showAdd = true;
    },
    openEdit(row) {
      this.current = row;
      this.showAdd = true;
    },
    /* 详情 */
    openDetail(videoid) {
      this.videoid = videoid;
      this.showInfo = true;
    },
    getTagClass() {
      const randomIndex = Math.floor(Math.random() * this.tagColors.length);
      return `el-tag--${this.tagColors[randomIndex]}`;
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
    /* 上下架 */
    set_lower_2(row) {
      this.$prompt('请输入下架原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '请输入下架原因'
      }).then(({ value }) => {
        const loading = this.$loading({ lock: true });
        this.$http.post('/video/setLower', { id: row.id, lower_reason: value, is_lower: 2 }).then(res => {
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
        // const loading = this.$loading({ lock: true });
        // this.$http.post('/video/delete', { id: this.selection.map(d => d.id) }).then(res => {
        //   loading.close();
        //   if (res.data.code === 0) {
        //     this.$message.success(res.data.msg);
        //     this.reload();
        //   } else {
        //     this.$message.error(res.data.msg);
        //   }
        // }).catch(e => {
        //   loading.close();
        //   this.$message.error(e.message);
        // });
      }).catch(() => { });
    },
  }
}
</script>

<style lang="scss" scoped>
.panel {
  box-sizing: border-box;
}
</style>
