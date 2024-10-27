<template>
  <div id="main-page">
    <div id="header">
      <Header/>
    </div>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <footer id="main-footer">
      <Footer/>
    </footer>
  </div>
</template>

<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
</script>

<style scoped>

#main-page {
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  height: 100vh;
}

#header {
  grid-row: 1;
  background-color: #333333;
  color: #FFFFFF;
  display: flex;
  justify-content: space-between;
}

.main-content {
  display: flex;
  max-height: 100%;
  overflow-y: hidden;
}

#main-footer {
  grid-row: 3;
  background-color: #333333;
  color: #FFFFFF;
  display: flex;
  justify-content: space-between;
}

</style>