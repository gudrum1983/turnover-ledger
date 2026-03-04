```text
<template>
  <VueDatePicker v-model="date" :flow="{ steps: flow }"  />
</template>

<script setup>
  import { VueDatePicker } from "@vuepic/vue-datepicker"
  import { ref } from 'vue';

  const date = ref();
  const flow = ['month', 'year', 'calendar'];
</script>
```

https://vue3datepicker.com/props/modes/#flow

только год
https://vue3datepicker.com/props/modes/#year-picker