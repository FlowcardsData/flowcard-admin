<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        label-width="77px"
        class="ele-form-search"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="所属站点:">
              <el-input
                clearable
                v-model="where.item_id"
                placeholder="请输入所属站点"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button
                type="primary"
                icon="el-icon-search"
                class="ele-btn-icon"
                @click="reload">查询
              </el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :where="where"
        :datasource="url"
        :columns="columns"
        :selection.sync="selection"
        height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="openEdit(null)"
            v-if="permission.includes('sys:layout:add')">添加
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            class="ele-btn-icon"
            @click="removeBatch"
            v-if="permission.includes('sys:layout:dall')">删除
          </el-button>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            @click="openEdit(row)"
            v-if="permission.includes('sys:layout:edit')">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此布局吗？"
            @confirm="remove(row)">
            <el-link
              type="danger"
              slot="reference"
              :underline="false"
              icon="el-icon-delete"
              v-if="permission.includes('sys:layout:delete')">删除
            </el-link>
          </el-popconfirm>
        </template>
        <!-- 布局图片列 -->
        <template slot="image" slot-scope="{row}">
          <el-avatar shape="square" :size="25" :src="row.image"/>
        </template>
        <!-- 布局类型列 -->
        <template slot="type" slot-scope="{row}">
          <el-tag v-if="row.type === 1" type="success" size="small">普通文章</el-tag>
          <el-tag v-if="row.type === 2" type="warning" size="small">图文文章</el-tag>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <layout-edit
      v-if="showEdit"
      @close="showEdit=false"
      :data="current"
      :item-list="itemList"
      :layout-desc-list="layoutDescList"
      :visible="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LayoutEdit from './layout-edit';

export default {
  name: 'OptLayout',
  components: {LayoutEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/layout/index',
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
          prop: 'item_name',
          label: '所属站点',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
        },
        {
          prop: 'loc_desc',
          label: '布局位置',
          showOverflowTooltip: true,
          minWidth: 300,
          align: 'center',
        },
        {
          columnKey: 'image',
          label: '布局图片',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'image'
        },
        {
          prop: 'type',
          label: '推荐类型',
          align: 'center',
          width: 150,
          resizable: false,
          slot: 'type',
        },
        {
          prop: 'type_desc',
          label: '推荐内容',
          showOverflowTooltip: true,
          minWidth: 250,
          align: 'center',
        },
        {
          prop: 'sort',
          label: '排序号',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
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
          prop: 'update_time',
          label: '更新时间',
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
          width: 150,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 站点列表
      itemList: [],
      // 布局描述列表
      layoutDescList: [],
    };
  },
  mounted() {
    // 查询站点列表
    this.getItemList();
    // 查询推荐布局描述
    this.getLayoutDescList();
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.showEdit = false;
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 显示编辑 */
    openEdit(row) {
      this.current = row == null ? {status: 1} : row;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.post('/layout/delete', {id: row.id}).then(res => {
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
      this.$confirm('确定要删除选中的布局吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/layout/delete', {id: this.selection.map(d => d.id)}).then(res => {
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
      }).catch(() => {
      });
    },
    /**
     * 查询站点列表
     */
    getItemList() {
      this.$http.get('/item/getItemList').then(res => {
        if (res.data.code === 0) {
          this.itemList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 查询站点列表
     */
    getLayoutDescList() {
      this.$http.get('/layoutdesc/getLayoutDescList').then(res => {
        if (res.data.code === 0) {
          this.layoutDescList = res.data.data;
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
</style>
