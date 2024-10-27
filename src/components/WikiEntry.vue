<template>
  <component :is="currentComponent"/>
</template>

<script setup lang="ts">

import {markRaw, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {markDownBasedComponents} from '@/functions/create_markdown_routes.ts'

const fileName = useRoute().params.wikiEntryName;
const currentComponent = ref();
const metaAttributes = ref({});

onMounted(async () => {

  let mdComponent = (await markDownBasedComponents())
      .find(mdComponent => mdComponent.path.includes(`/${fileName}`));

  if (mdComponent) {
    currentComponent.value = markRaw((await mdComponent.component()).default);
    metaAttributes.value = mdComponent.metaAttributes;
  }
});
</script>
