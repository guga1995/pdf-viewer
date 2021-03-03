<template>
  <div
    class="pdf-viewer-container"
    ref="containerRef"
    @mouseleave="onContainerMouseLeave"
    @mouseenter="onContainerMouseEnter"
    @click="onContainerClick"
  >
    <div
      class="pdf-viewer-container-wrapper"
      v-if="pdfData"
      ref="containerWrapperRef"
      :style="containerWrapperStyle"
      @mousedown="onContainerWrapperMouseDown"
      @mouseup="onContainerWrapperMouseUp"
      @mousemove="onContainerWrapperMouseMove"
      @mouseleave="onContainerWrapperMouseLeave"
    >
      <pdf
        v-for="item in pages"
        :key="item.page"
        :src="pdfData"
        :page="item.page"
        :scale="computedScale"
        :text="false"
        :style="pdfStyle"
      >
        <template slot="loading"> loading... </template>
      </pdf>
    </div>
    <transition name="pdf-transition-fade">
      <arrow-button
        class="pdf-viewer-arrow-right"
        v-if="showNext"
        @click="nextPage"
      />
    </transition>
    <transition name="pdf-transition-fade">
      <arrow-button
        class="pdf-viewer-arrow-left"
        v-if="showPrevious"
        :right="false"
        @click="previousPage"
      />
    </transition>
    <transition name="pdf-transition-fade">
      <div class="pdf-viewer-control-panel-container" v-if="showUi">
        <page-input v-model="pageInputModel" :total="totalPages" />
        <span title="Zoom In">
          <icon-button :icon="['fas', 'plus']" @click="zoomIn" />
        </span>
        <span title="Zoom Out">
          <icon-button :icon="['fas', 'minus']" @click="zoomOut" />
        </span>
        <span title="Fullscreen">
          <icon-button
            :icon="['fas', this.fullscreen ? 'compress' : 'expand']"
            @click="toggleFullscreen"
          />
        </span>
        <span title="Share">
          <icon-button :icon="['fas', 'share']" @click="showSharePopup" />
        </span>
      </div>
    </transition>
    <share-popup
      v-model="sharePopup"
      :share-link="shareLink"
      @share-button-click="$emit('share-button-click', $event)"
    />
  </div>
</template>

<script>
import pdfvuer from "pdfvuer";
import ArrowButton from "@/components/ui/ArrowButton.vue";
import IconButton from "@/components/ui/IconButton.vue";
import SharePopup from "@/components/ui/SharePopup.vue";
import PageInput from "@/components/ui/PageInput.vue";

const SCALE_INCREMENT = 0.5;
const PDF_DEFAULT_SCALE = 0.75;
const MAX_SCALE = 5;

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    shareLink: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      pdfData: undefined,
      totalPages: 0,
      currentPage: 1,
      scale: 1,
      pdfScale: 1,
      pageContainer: {
        width: 0,
        height: 0,
      },
      pageBox: {
        width: 0,
        height: 0,
      },
      pdfTransformTranslate: {
        x: 0,
        y: 0,
      },
      pdfInitialTransformTranslate: {
        x: 0,
        y: 0,
      },
      initialDragPosition: {
        x: 0,
        y: 0,
      },
      isDragging: false,
      showUi: false,
      uiHidingTimeout: null,
      fullscreen: false,
      sharePopup: false,
    };
  },
  computed: {
    pageInputModel: {
      get() {
        return this.currentPage;
      },
      set(value) {
        if (value === 1) {
          this.currentPage = value;
        } else {
          this.currentPage = value - (value % 2);
        }
        this.resetScaleAndTranslate();
      },
    },
    pdfStyle() {
      return `
        transform: translate(${this.pdfTransformTranslate.x}px, ${this.pdfTransformTranslate.y}px)
      `;
    },
    containerWrapperStyle() {
      return `
        top: ${50}px;
        bottom: ${50}px;
        left: ${5}px;
        right: ${5}px;
      `;
    },
    pages() {
      if (this.currentPage === 1) {
        return [
          {
            page: this.currentPage,
          },
        ];
      } else if (this.showPrevious && this.showNext) {
        return [
          {
            page: this.currentPage,
          },
          {
            page: this.currentPage + 1,
          },
        ];
      }
      return [
        {
          page: this.totalPages,
        },
      ];
    },
    showNext() {
      return this.currentPage < this.totalPages - 1;
    },
    showPrevious() {
      return this.currentPage > 1;
    },
    computedScale() {
      return this.scale * this.pdfScale * PDF_DEFAULT_SCALE;
    },
    gdMinScale() {
      return this.scale > 1;
    },
    ldMaxScale() {
      return this.scale <= MAX_SCALE - SCALE_INCREMENT;
    },
    containerClass() {
      return this.fullscreen ? "pdf-viewer-fullscreen" : "";
    },
  },
  methods: {
    async getPdf() {
      this.pdfData = pdfvuer.createLoadingTask(this.src);
      let pdf = await this.pdfData;
      let page = await pdf.getPage(1);

      this.totalPages = pdf.numPages;

      this.pageBox = {
        width: page.view[2],
        height: page.view[3],
      };

      await this.updatePageContainer();
    },
    async updatePageContainer() {
      await this.$nextTick;
      let rect = this.$refs.containerWrapperRef.getBoundingClientRect();

      let containerBox = {
        width: rect.width,
        height: rect.height,
      };

      let pageBoxAspectRation = (this.pageBox.width * 2) / this.pageBox.height;

      let containerBoxAspectRation = containerBox.width / containerBox.height;

      if (containerBoxAspectRation > pageBoxAspectRation) {
        this.pdfScale = containerBox.height / this.pageBox.height;
      } else {
        this.pdfScale = containerBox.width / this.pageBox.width / 2;
      }
    },
    nextPage() {
      if (this.showNext) {
        let increment = this.currentPage === 1 ? 1 : 2;
        this.currentPage += increment;
        this.resetScaleAndTranslate();
      }
    },
    previousPage() {
      if (this.showPrevious) {
        let increment = this.currentPage === 2 ? 1 : 2;
        this.currentPage -= increment;
        this.resetScaleAndTranslate();
      }
    },
    zoomIn() {
      if (this.ldMaxScale) {
        this.scale += SCALE_INCREMENT;
      }
    },
    zoomOut() {
      if (this.gdMinScale) {
        this.pdfTransformTranslate = {
          x: 0,
          y: 0,
        };
        this.scale -= SCALE_INCREMENT;
      }
    },
    onContainerWrapperMouseDown(e) {
      this.isDragging = true;
      this.initialDragPosition = {
        x: e.clientX,
        y: e.clientY,
      };
      this.pdfInitialTransformTranslate = {
        x: this.pdfTransformTranslate.x,
        y: this.pdfTransformTranslate.y,
      };
    },
    onContainerWrapperMouseUp() {
      this.isDragging = false;
    },
    onContainerWrapperMouseMove(e) {
      if (this.isDragging && this.gdMinScale) {
        this.pdfTransformTranslate.x =
          e.clientX -
          this.initialDragPosition.x +
          this.pdfInitialTransformTranslate.x;
        this.pdfTransformTranslate.y =
          e.clientY -
          this.initialDragPosition.y +
          this.pdfInitialTransformTranslate.y;
      }
    },
    onContainerWrapperMouseLeave() {
      this.isDragging = false;
    },
    resetScaleAndTranslate() {
      this.scale = 1;
      this.pdfTransformTranslate = {
        x: 0,
        y: 0,
      };
    },
    onContainerClick() {
      this.showUi = true;
    },
    onContainerMouseEnter() {
      if (this.uiHidingTimeout) {
        window.clearTimeout(this.uiHidingTimeout);
        this.uiHidingTimeout = null;
      }
    },
    onContainerMouseLeave() {
      if (!this.uiHidingTimeout) {
        this.uiHidingTimeout = window.setTimeout(() => {
          this.showUi = false;
        }, 3000);
      }
    },
    toggleFullscreen() {
      if (!this.fullscreen) {
        let elem = this.$refs.containerRef;
        this.openFullscreen(elem);
      } else {
        this.closeFullscreen();
      }
      this.fullscreen = !this.fullscreen;
    },
    openFullscreen(elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    },

    /* Close fullscreen */
    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
    },
    onFullscreenChange() {
      if (!document.fullscreenElement) {
        this.fullscreen = false;
      }
    },
    showSharePopup() {
      this.sharePopup = true;
    },
  },
  async mounted() {
    await this.getPdf();
    let containerElement = this.$refs.containerRef;
    containerElement.addEventListener(
      "fullscreenchange",
      this.onFullscreenChange.bind(this)
    );
    window.addEventListener("resize", this.updatePageContainer.bind(this));
  },
  beforeDestroy() {
    let containerElement = this.$refs.containerRef;
    containerElement.removeEventListener(
      "fullscreenchange",
      this.onFullscreenChange
    );
  },
  destroyed() {
    window.removeEventListener("resize", this.updatePageContainer);
  },
  components: {
    pdf: pdfvuer,
    ArrowButton,
    IconButton,
    SharePopup,
    PageInput,
  },
};
</script>