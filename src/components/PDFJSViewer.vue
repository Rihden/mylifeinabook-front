<template>
  <div class="pdf-container">
    <iframe
      frameborder="0"
      style="margin: 0 auto; height: 100%; width: 100%"
      :src="pdfFile"
      ref="test"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "PDFJSViewer",
  computed: {
    pdfFile: function () {
      const filePath = "/lib/pdfjs-2.12.313-dist/web/viewer.html";
      return filePath + "?file=" + this.$store.getters.getPdfFile;
    },
  },
};
</script>
<style scoped>
.pdf-container {
  height: 100%;
  width: 90%;
}

@media screen and (max-width: 1024px) {
  .pdf-container {
    width: 100%;
  }
}
</style>