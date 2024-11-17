<template>
  <component :is="currentComponent"/>
</template>

<script setup lang="ts">

import {useRoute} from 'vue-router';
import {getComponent} from '@/functions/load_modules'

const fileName = useRoute().params.wikiEntryName;
const currentComponent = getComponent(fileName);

</script>
