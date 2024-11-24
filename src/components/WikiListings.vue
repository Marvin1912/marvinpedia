<template>
  <div class="wiki-listings">
    <WikiListing
        v-for="wikiListing in wikiListings"
        :key="wikiListing.id"
        :title="wikiListing.title"
        :image="wikiListing.image"
        :description="wikiListing.description"
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
  {
    id: 1,
    title: 'Java SE',
    image: img_java_se,
    toPage: '/wiki/java_se',
    description: 'Java SE (Java Platform, Standard Edition) is the core platform for developing and running Java applications. It includes the Java Development Kit (JDK), runtime environment (JRE), and essential libraries for building desktop, server, and embedded software.'
  },
  {
    id: 2,
    title: 'Hibernate',
    image: img_hibernate,
    toPage: '/wiki/hibernate',
    description: 'Hibernate is a powerful Java framework for object-relational mapping (ORM) and data management. It simplifies database interactions by mapping Java objects to database tables, eliminating boilerplate SQL code. Hibernate supports features like lazy loading, caching, and transaction management, making it a popular choice for building efficient and scalable applications.'
  },
  {
    id: 3, title: 'Kafka', image: img_kafka, toPage: '/wiki/kafka', description: '\n' +
        'Kafka is a distributed event streaming platform designed for high-throughput data pipelines and real-time processing. It allows applications to publish, subscribe to, and process streams of records efficiently. Widely used for building scalable systems, Kafka supports use cases like log aggregation, real-time analytics, and event-driven architectures.'
  },
  {
    id: 4,
    title: 'Spring',
    image: img_spring,
    toPage: '/wiki/spring',
    description: 'Java Spring is a popular framework for building enterprise-level Java applications. It provides tools and features like dependency injection, aspect-oriented programming, and a modular architecture to simplify development. Spring supports building web applications, microservices, and APIs, making it versatile and widely adopted in modern software development.'
  },
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