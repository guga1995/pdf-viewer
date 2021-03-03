<template>
  <div class="example-container">
    <pdf-viewer
      src="test.pdf"
      shareLink="test"
      @share-button-click="shareButtonClick"
    ></pdf-viewer>
  </div>
</template>

<script>
import PdfViewer from "@/components/PdfViewer.vue";

import '@/assets/styles/index.scss';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronLeft, faPlus, faMinus, faExpand, faCompress, faShare, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faLinkedinIn, faPinterestP, faTwitter } from '@fortawesome/free-brands-svg-icons'

library.add(
    faChevronRight,
    faChevronLeft,
    faPlus, faMinus,
    faExpand,
    faCompress,
    faShare,
    faFacebookF,
    faLinkedinIn,
    faPinterestP,
    faTwitter,
    faEnvelope
)

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
</style>