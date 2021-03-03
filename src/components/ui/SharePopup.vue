<template>
  <transition name="pdf-transition-fade">
    <div
      v-if="value"
      class="pdf-viewer-share-popup"
      @click.self="onContainerClick"
    >
      <div class="pdf-viewer-share-popup-content">
        <div class="pdf-viewer-share-popup-icons-container">
          <div
            v-for="item in shareButtons"
            :key="item.name"
            :class="`pdf-ui-share-button pdf-ui-share-button-${item.name}`"
            @click="$emit('share-button-click', { name: item.name })"
          >
            <font-awesome-icon :icon="item.icon" />
          </div>
        </div>
        <div class="pdf-ui-share-link">
          <input ref="linkInputRef" :value="shareLink" readonly />
          <div class="pdf-ui-share-link-copy-button" @click="onCopyClick">
            {{ this.copied ? "COPIED" : "COPY" }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const shareButtonsMap = [
  {
    name: "facebook",
    icon: ["fab", "facebook-f"],
  },
  {
    name: "linkedin",
    icon: ["fab", "linkedin-in"],
  },
  {
    name: "pinterest",
    icon: ["fab", "pinterest-p"],
  },
  {
    name: "twitter",
    icon: ["fab", "twitter"],
  },
  {
    name: "mail",
    icon: ["fas", "envelope"],
  },
];

export default {
  props: {
    value: Boolean,
    shareLink: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      copied: false,
      copyTimeout: null,
    };
  },
  computed: {
    shareButtons() {
      return shareButtonsMap;
    },
  },
  methods: {
    onContainerClick() {
      this.$emit("input", false);
    },
    onCopyClick() {
      this.copied = true;
      let elem = this.$refs.linkInputRef;

      elem.select();
      elem.setSelectionRange(0, 99999);

      document.execCommand("copy");

      if (this.copyTimeout) {
        window.clearTimeout(this.copyTimeout);
      }
      this.copyTimeout = window.setTimeout(() => {
        this.copied = false;
      }, 1500);
    },
  },
  components: {
    FontAwesomeIcon,
  },
};
</script>