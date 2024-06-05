<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        label-width="100px"
        class="ele-form-search"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="25">
          <el-col :lg="5" :md="12">
            <el-form-item label="会员ID:">
              <el-input
                clearable
                v-model="where.member_id"
                placeholder="请输入会员ID"/>
            </el-form-item>
          </el-col>
          <el-col :lg="5" :md="12">
            <el-form-item label="会员账号:">
              <el-input
                clearable
                v-model="where.username"
                placeholder="请输入会员账号"/>
            </el-form-item>
          </el-col>
          <el-col :lg="5" :md="12">
            <el-form-item label="代理等级:">
              <el-select clearable v-model="where.agent_level" placeholder="请选择代理等级" class="ele-fluid">
                <el-option v-for="item in agentLevelOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="5" :md="12">
            <el-form-item label="状态:">
              <el-select
                clearable
                v-model="where.status"
                placeholder="请选择状态"
                class="ele-fluid">
                <el-option label="正常" value="1"/>
                <el-option label="冻结" value="2"/>
                <el-option label="撤销" value="3"/>
              </el-select>
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
        <!-- 头像 -->
        <template slot="avatar" slot-scope="{row}">
          <el-image :src="row.avatar"  style="width: 35px;" :preview-src-list="[row.avatar]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size: 35px;"></i>
            </div>
          </el-image>
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-tag
            :type="['success', 'primary', 'warning'][row.status-1]"
            size="mini">
            {{ ['待审核', '正常', '冻结', '撤销'][row.status] }}
          </el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-popconfirm class="ele-action" title="确定冻结该代理商吗？" @confirm="editStatus(row, 2)"
                v-if="permission.includes('sys:agent:status') && row.status == 1">
            <el-link type="danger" slot="reference" :underline="false" icon="el-icon-warning-outline">冻结
            </el-link>
          </el-popconfirm>

          <el-popconfirm class="ele-action" title="确定解冻该代理商吗？" @confirm="editStatus(row, 1)"
                         v-if="permission.includes('sys:agent:status') && row.status == 2">
            <el-link type="success" slot="reference" :underline="false" icon="el-icon-success">解冻
            </el-link>
          </el-popconfirm>

        </template>

        <template slot="cat_coin" slot-scope="{row}">
          <el-button type="text" size="mini" @click.native.prevent="showRecharge(row.member_id, 'cat_coin')">{{ row.cat_coin }} </el-button>
        </template>
      </ele-pro-table>
    </el-card>

  </div>

</template>

<script>
import { mapGetters } from "vuex";
import agetAdd from './aget-add';

export default {
  name: 'Agent',
  components: {agetAdd},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      rechargeType:'',
      userId:0,
      // 表格数据接口
      url: '/agent/index',
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
          prop: 'member_id',
          label: '用户ID',
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'username',
          label: '用户账号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        {
          prop: 'nickname',
          label: '用户昵称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          columnKey: 'avatar',
          label: '头像',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60,
          slot: 'avatar'
        },
        {
          prop: 'agent_level',
          label: '等级标识',
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'sale_vip',
          label: '已售数量(张)',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
        },
        {
          prop: 'cat_coin',
          label: '余额',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          slot: 'cat_coin',
        },
        {
          prop: 'create_time',
          label: '加入代理商时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          minWidth: 80,
          resizable: false,
          slot: 'status',
        },
        {
          columnKey: 'action',
          label: '操作',
          minWidth: 130,
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
      rechargevisible:false,
      // 是否显示导入弹窗
      showImport: false,
      agentLevelOptions:null, // 创作者等级
    };
  },
  created() {
    // 获取等级
    this.$http.post('/Agentlevel/getAll', {}).then(res => {
      this.agentLevelOptions = res.data.list;
    }).catch(e => {
      this.$message.error(e.message);
    });
  },
  methods: {
    showRecharge(user_id, type) {
      this.rechargeType = type;
      this.userId = user_id;
      this.rechargevisible = true;
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },

    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.post('/agent/delete', {id: row.id}).then(res => {
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
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要删除选中的会员吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/agent/delete', {id: this.selection.map(d => d.id)}).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
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
    /* 更改状态 */
    editStatus(row, status=0) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "status": status
      })
      this.$http.post('/agent/status', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    }
  }
}
</script>

<style scoped>
</style>
