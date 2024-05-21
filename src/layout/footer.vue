<!-- 页脚 -->
<template>
  <div class="ele-text-center" style="padding: 16px 0;">
    <div>
      <a
        target="_blank"
        class="ele-text-secondary"
        href="http://www.rxthink.cn">
        {{ $t('layout.footer.website') }}
      </a>
      <em/>
      <a
        target="_blank"
        class="ele-text-secondary"
        href="http://docs.evtp6.pro.rxthink.cn">
        {{ $t('layout.footer.document') }}
      </a>
      <em/>
      <a
        target="_blank"
        class="ele-text-secondary"
        href="http://www.rxthink.cn/goods/detail/7">
        {{ $t('layout.footer.authorization') }}
      </a>
    </div>
    <div class="ele-text-secondary" style="margin-top: 8px;">
      {{ $t('layout.footer.copyright') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'EleFooter'
}
</script>
