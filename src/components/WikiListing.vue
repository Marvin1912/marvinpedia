<template>
  <div
      v-on:mouseover="mouse_over"
      v-on:mouseleave="mouse_left"
      class="item-card">
    <div class="flipping-container" :class="{ flipped: showDescription }">
      <div class="front">
        <div class="header-content">
          <div class="title-wrapper">
            <h3>{{ title }}</h3>
            <div class="title-underline"></div>
          </div>
        </div>
        <img :src="image" alt="" class="item-image"/>
      </div>
      <div class="back">
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>


<script setup>

import { ref } from 'vue';

defineProps({
  title: String,
  image: String,
  description: String
})

let showDescription = ref(false);

function mouse_over() {
  showDescription.value = true;
}

function mouse_left() {
  showDescription.value = false;
}

</script>

<style scoped>

.item-card {
  width: 25%;
  height: calc(100% / 2 - 50px);
  margin: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  perspective: 1000px;

  @media only screen and (max-width: 1100px) {
    width: 250px;
  }

}

.flipping-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.flipping-container.flipped {
  transform: rotateY(180deg);
}

.front, .back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
}

.front {
  background-color: #ffffff;
}

.header-content {
  padding: 1.5rem 1rem 0.5rem;
  text-align: center;
  width: 100%;
}

.title-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.3;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  @media only screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
}

.title-underline {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.item-card:hover .title-underline {
  width: 80%;
}

.back {
  background-color: #f5f5f5;
  transform: rotateY(180deg);
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

  @media only screen and (max-width: 560px) {
    max-width: 125px;
    max-height: 125px;
  }

}

.item-cards:hover .item-image {
  transform: scale(1.05);
}

p {
  margin: .5em;
  font-size: 1rem;
  color: #333;
}

</style>