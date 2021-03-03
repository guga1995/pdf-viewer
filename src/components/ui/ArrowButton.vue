<template>
    <button class="pdf-ui-button pdf-ui-arrow-button" v-on="$listeners">
        <font-awesome-icon :icon="['fas', right ? 'chevron-right' : 'chevron-left']"/>
    </button>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
    props: {
        right: {
            type: Boolean,
            default: true
        }
    },
    components: {
        FontAwesomeIcon
    }
}
</script>