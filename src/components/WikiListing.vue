<template>
  <div class="item-card">
    <h3>{{ title }}</h3>
    <img :src="image" alt="" class="item-image"/>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  image: String
})

</script>

<style scoped>

.item-card {
  width: 25%;
  height: calc(100% / 2 - 50px);
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-evenly;
  align-items: center;
  background-color: #ffffff;
  margin: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100%;
  max-width: 150px;
  height: 100%;
  max-height: 150px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.item-cards:hover .item-image {
  transform: scale(1.05);
}

</style>