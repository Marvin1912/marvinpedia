<template>
  <div class="wikiEntriesContent">
    <h1 class="wikiEntryHeadline">{{ topicName }}</h1>
    <div class="wikiEntries">
      <ul class="wiki-list">
        <li v-for="component in namesRef" :key="component.routeName" class="wiki-list-item">
          <router-link :to="`${component.routeName}`" class="wiki-link">{{ component.displayName }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

import {markDownBasedComponents} from '@/functions/create_markdown_routes'
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const namesRef = ref([]);
const topicName = useRoute().params.wikiTopic;

onMounted(async () => {

  const names = [];

  (await markDownBasedComponents(topicName))
      .filter(value => value.metaAttributes.topic == topicName)
      .forEach(mdComponent => {
        names.push({
          routeName: mdComponent.path,
          displayName: mdComponent.displayName
        });
      })

  namesRef.value = names;
})

</script>

<style scoped>

.wikiEntryHeadline {
  margin: 0;
  padding: 0;
}

.wikiEntriesContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.wikiEntries {
  width: 25%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.wiki-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wiki-list-item {
  margin: 10px 0;
}

.wiki-link {
  display: block;
  padding: 12px 20px;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  background-color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.wiki-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  background-color: #e9f5ff;
  color: #1a73e8;
}

</style>


