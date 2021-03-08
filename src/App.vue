<template>
  <div class="example-container">
    <pdf-viewer
      src="test.pdf"
      share-url="https://news.vuejs.org/issues/180"
      share-title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
      share-description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
    ></pdf-viewer>
  </div>
</template>

<script>
import "@/assets/styles/index.scss";

export default {
  methods: {
    shareButtonClick(e) {
      console.log(e);
    },
  },
};
</script>

<style scoped>
.example-container {
  width: 600px;
  height: 400px;
}
</style>