<template>
  <button class="pdf-ui-button pdf-ui-icon-button" v-on="$listeners">
    <font-awesome-icon :icon="icon" />
  </button>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  props: {
    icon: [Array, String],
  },
  components: {
      FontAwesomeIcon
  }
};
</script>