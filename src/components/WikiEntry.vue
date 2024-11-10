<template>
  <component :is="currentComponent"/>
</template>

<script setup lang="ts">

import {ref} from 'vue';
import {useRoute} from 'vue-router';
import TheDepthsOfTheHibernateCode from "@/assets/markdown/the-depths-of-the-hibernate-code.md";
import TheThingWithThePersistenceContext from "@/assets/markdown/the-thing-with-the-persistence-context.md";

const fileName = useRoute().params.wikiEntryName;
const metaAttributes = ref({});

const currentComponent = [
  TheDepthsOfTheHibernateCode,
  TheThingWithThePersistenceContext
]
    .find(component => fileName === component.__name);

</script>
