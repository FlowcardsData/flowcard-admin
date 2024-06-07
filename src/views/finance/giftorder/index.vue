<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="where" label-width="77px" class="ele-form-search" @keyup.enter.native="reload" @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="4" :md="12">
            <el-form-item label="用户ID:">
              <el-input clearable v-model="where.member_id" placeholder="请输入用户ID" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="订单号:">
              <el-input clearable v-model="where.order_sn" placeholder="请输入订单标识" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="订单状态:">
              <el-select clearable v-model="where.status" placeholder="请选择订单状态" class="ele-fluid">
                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.code" />
              </el-select>
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
      <ele-pro-table ref="table" :where="where" :datasource="url" :columns="columns" :selection.sync="selection" height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removeBatch" v-if="permission.includes('sys:giftorder:delete')">删除
          </el-button>
        </template>

        <!-- 状态 -->
        <template slot="status" slot-scope="{row}">
          <el-tag :type="['warning', 'success', 'success', 'info'][row.status-1]" size="mini">
            {{ statusFormat(row) }}
          </el-tag>
        </template>


        <template slot="discount" slot-scope="{row}" v-if="row.discount">
          {{row.discount}}折
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)" v-if="permission.includes('sys:giftorder:status')">修改
          </el-link>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <giftorder-edit :data="current" :statusOptions="statusOptions" :visible.sync="showEdit" @done="reload" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import giftorderEdit from './giftorder-edit';

export default {
  name: 'Examequityorder',
  components: { giftorderEdit },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/GiftOrder/index',
      // 表格列配置
      columns: [{
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
          prop: 'member_id',
          label: '用户ID',
          width: 100,
          align: 'center',
        },
        {
          prop: 'order_sn',
          label: '订单号',
          minWidth: 200,
          align: 'center',
        },
        {
          prop: 'price',
          label: '佣金',
          showOverflowTooltip: true,
          minWidth: 120,
          align: 'center',
        },
        {
          prop: 'total_amount',
          label: '总金额',
          minWidth: 120,
          showOverflowTooltip: true,
          align: 'center',
        },
        {
          prop: 'status',
          label: '订单状态',
          minWidth: 120,
          align: 'center',
          slot:'status',
        },
        {
          prop: 'pay_time',
          label: '下单时间',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
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
      //订单状态
      statusOptions: null,
    };
  },
  created() {
    //订单状态
    this.getDicts("equity_order_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 订单状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /* 刷新表格 */
    reload() {
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
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      this.$http.post('/giftorder/delete', { id: row.id }).then(res => {
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
      this.$confirm('确定要删除选中的金币充值订单吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({ lock: true });
        this.$http.post('/giftorder/delete', { id: this.selection.map(d => d.id) }).then(res => {
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
</style>
