<template>
    <div class="pdf-ui-page-input">
        <input v-model="model" @focus="onFocus" @focusout="onFocusout" type="number">
        <span style="margin-bottom: 5px" >of {{ total }}</span>
    </div>
</template>

<script>
export default {
    props: {
        value: Number,
        total: Number
    },
    data() {
        return {
            tempValue: 1
        }
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(value) {
                let inputValue = 1
                if (value < 1) {
                    inputValue = 1
                } else if (value > this.total) {
                    inputValue = this.total
                } else {
                    inputValue = value
                }
                this.tempValue = parseInt(inputValue)
            }
        }
    },
    methods: {
        onFocusout() {
            this.$emit('input', this.tempValue)
        },
        onFocus() {
            this.tempValue = this.value
        }
    }
}
</script>