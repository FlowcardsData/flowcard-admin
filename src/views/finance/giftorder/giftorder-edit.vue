<!-- 金币充值订单编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate?'修改卡密购买订单':'添加卡密购买订单'"
    :visible="visible"
    width="550px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px">

      <el-form-item
        label="订单标识:"
        prop="order_sn">
        {{form.order_sn}}
      </el-form-item>

      <el-form-item
        label="总金额:"
        prop="total_amount">
        {{form.total_amount}}
      </el-form-item>

      <el-form-item
        label="实际支付:"
        prop="price">
        {{form.price}}
      </el-form-item>

      <el-form-item label="订单状态：" prop="status">
        <el-select :disabled="form.pay_time!==null" clearable v-model="form.status" placeholder="请选择订单状态" class="ele-fluid">
          <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="parseInt(item.code)" />
        </el-select>
      </el-form-item>

      <el-form-item label="支付类型:" prop="pay_type">
        <el-select
          clearable
          disabled
          v-model="form.pay_type"
          class="ele-fluid">
          <el-option label="官方通道" value="self"/>
        </el-select>
      </el-form-item>

      <el-form-item
        label="支付时间:"
        prop="pay_time">
        {{this.$util.toDateString(form.pay_time)}}
      </el-form-item>

                </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button
        type="primary"
        @click="save"
        :loading="loading">保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>


export default {
  name: 'CatCoinOrderEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    statusOptions:Array,
    // 修改回显的数据
    data: Object
  },

  data() {
    return {
      // 表单数据
      form: Object.assign({status:1}, this.data),
      // 表单验证规则
      rules: {

        },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    }
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/GiftOrder/setStatus', this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              if (!this.isUpdate) {
                this.form = {};
              }
              this.updateVisible(false);
              this.$emit('done');
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            this.loading = false;
            this.$message.error(e.message);
          });
        } else {
          return false;
        }
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
