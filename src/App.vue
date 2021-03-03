<template>
  <div id="app">
    <div class="example-container">
      <pdf-viewer
        src="test.pdf"
        shareLink="test"
        @share-button-click="shareButtonClick"
      ></pdf-viewer>
    </div>
  </div>
</template>

<script>
import PdfViewer from "@/components/PdfViewer.vue";

export default {
  methods: {
    shareButtonClick(e) {
      console.log(e);
    },
  },
  components: {
    PdfViewer,
  },
};
</script>

<style scoped>
.example-container {
  width: 600px;
  height: 400px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
