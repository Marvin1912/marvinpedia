<template>
  <div class="wikiEntriesContent">
    <div class="headline-container">
      <h1 class="wikiEntryHeadline">{{ topicName }}</h1>
      <div class="headline-underline"></div>
    </div>
    <div class="wikiEntries">
      <ul class="wiki-list">
        <li v-for="names in namesRefs" :key="names.id" class="wiki-list-item">
          <router-link :to="`/wiki/${names.fileName}`" class="wiki-link">{{ names.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useRoute} from "vue-router";
import {getMetaData} from '@/functions/load_modules'

const topicName = useRoute().params.wikiTopic;

const namesRefs = getMetaData()
    .sort((a, b) => a.id - b.id)
    .filter(value => topicName === value.topic);

</script>

<style scoped>

.wikiEntriesContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 2rem 1rem;
}

.headline-container {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.wikiEntryHeadline {
  margin: 0;
  padding: 0;
  font-size: 3rem;
  font-weight: 800;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.2;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media only screen and (max-width: 768px) {
    font-size: 2.2rem;
    letter-spacing: 1.5px;
  }

  @media only screen and (max-width: 480px) {
    font-size: 1.8rem;
    letter-spacing: 1px;
  }
}

.headline-underline {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0.6;
    border-radius: 1px;
  }

  @media only screen and (max-width: 480px) {
    width: 100px;

    &::before {
      width: 60px;
    }
  }
}

.wikiEntries {
  width: 25%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;

  @media only screen and (max-width: 560px) {
    width: 75%;
  }

}

.wiki-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wiki-list-item {
  margin: 10px 0;

  @media only screen and (max-width: 560px) {
    text-align: center;
  }
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


