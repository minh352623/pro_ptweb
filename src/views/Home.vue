<template>
  <div>
    home asdas

    <h1>{{ "xin chao " + user.firstName + " " + user.lastName }}</h1>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    console.log(store.state.auth.user);
    const user = computed(() => store.state.auth.user);
    return { user };
  },
};
</script>
