<template>
  <div class="header">
    <div class="header-name">
      <router-link to="/">
        <img class="main-icon" src="@/components/icons/main-icon.png" alt="" height="75" width="75"/>
      </router-link>
      <h1 id="head-line">Marvinpedia</h1>
    </div>
  </div>
</template>

<style scoped>

.main-icon {
  padding: .25rem;
  border-radius: 25%;
}

.header {
  display: flex;
  width: 100%;
}

.header-name {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

#head-line {
  color: #333;
}

</style>
