<template>
  <div id="wikiEntries">
    <ul>
      <li v-for="component in namesRef" :key="component.routeName">
        <router-link :to="`/wiki/${component.routeName}`">{{ component.displayName }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

import {markDownBasedComponents} from '@/functions/create_markdown_routes'
import {onMounted, ref} from "vue";

const namesRef = ref([]);

onMounted(async () => {

  const names = [];

  (await markDownBasedComponents())
      .forEach(mdComponent => {
        names.push({
          routeName: mdComponent.name,
          displayName: mdComponent.displayName
        });
      })

  namesRef.value = names;
})

</script>

