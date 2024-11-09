<template>
  <div class="wiki-listings">
    <WikiListing
        v-for="wikiListing in wikiListings"
        :key="wikiListing.id"
        :title="wikiListing.title"
        :image="wikiListing.image"
        @click="navigateToPage(wikiListing.toPage)"
    />
  </div>
</template>

<script setup>

import WikiListing from "@/components/WikiListing.vue";
import img_hibernate from '@/components/icons/Hibernate.png'
import img_java_se from '@/components/icons/JavaSE.png'
import img_kafka from '@/components/icons/Kafka.png'
import img_spring from '@/components/icons/Spring.png'
import {useRouter} from "vue-router";

const router = useRouter()

const wikiListings = [
  {id: 1, title: 'Java SE', image: img_java_se, toPage: '/wiki/java_se'},
  {id: 2, title: 'Hibernate', image: img_hibernate, toPage: '/wiki/hibernate'},
  {id: 3, title: 'Kafka', image: img_kafka, toPage: '/wiki/kafka'},
  {id: 4, title: 'Spring', image: img_spring, toPage: '/wiki/spring'},
];

function navigateToPage(page) {
  router.push(page);
}

</script>

<style scoped>

.wiki-listings {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: auto;
  scrollbar-width: none;
}

</style>