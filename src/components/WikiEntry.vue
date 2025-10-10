<template>
  <component :is="currentComponent"/>
</template>

<script setup lang="ts">

import {useRoute} from 'vue-router';
import {getComponent} from '@/functions/load_modules'

const route = useRoute();
const fileName = `${route.params.wikiTopic}/${route.params.wikiEntryName}`;
const currentComponent = getComponent(fileName);

</script>
