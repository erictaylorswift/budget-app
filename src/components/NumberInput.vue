<template>
    <input type="number" v-focus="focused" @focus="focused = true" @blur="focused = false">
</template>

<script>
import { focus } from 'vue-focus'

export default {
    directives: { focus: focus },
    data() {
        return {
            focused: false
        }
    }
}
</script>
