<template>
  <el-dialog title="请选择用户" :visible="!!showGift" width="800px" top="20px" :destroy-on-close="true" :lock-scroll="false"
    append-to-body @update:visible="close">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="where" label-width="77px" class="ele-form-search" @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="8" :md="12">
            <el-form-item label="会员ID:">
              <el-input
                clearable
                v-model="where.member_id"
                placeholder="请输入会员ID"/>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12">
            <el-form-item label="会员账号:">
              <el-input
                clearable
                v-model="where.username"
                placeholder="请输入会员账号"/>
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
      <ele-pro-table ref="tableOne" :where="where" :datasource="url" :columns="columns" :selection.sync="selection">
        <template slot="action" slot-scope="{row}">
          <el-button size="small" type="primary" class="ele-btn-icon" @click="selectBth(row)">选择
          </el-button>
        </template>
        <!-- 封面图片列 -->
        <template slot="avatar" slot-scope="{row}">
          <el-image :src="row.avatar"  style="width: 35px;" :preview-src-list="[row.avatar]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size: 35px;"></i>
            </div>
          </el-image>
        </template>
      </ele-pro-table>
    </el-card>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="selectBth">保存
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: 'ExamStoreGoodVideo',
  props: {
    // 弹窗是否打开
    showGift: String,
    // 修改回显的数据
    form_info: Object,
  },

  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/Member/index',
      // 表格列配置
      columns: [
        {
          prop: 'id',
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
          columnKey: 'action',
          label: '操作',
          width: 100,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格选中数据
      current: null,
      selection: [],
      // 表格搜索条件
      where: { status: 1 },
    };
  },

  mounted() {

  },
  methods: {
    /* 保存 */
    selectBth(row) {
      this.$emit('update:gift_info', {user_id: row.id, nickname:row.nickname });
      this.close();
    },
    /* 更新visible */
    close() {
      this.$emit('update:showGift', '');
    },
    /* 下拉树格式化 */
    normalizer(d) {
      return {
        id: d.id,
        label: d.name,
        children: d.children || undefined
      };
    },
    /* 刷新表格 */
    reload() {
      this.$refs.tableOne.reload({ where: this.where });
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
  }
}

</script>
<style scoped>
</style>
