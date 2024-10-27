<template>
  <div class="header">
    <div class="header-name">
      <img class="main-icon" src="@/components/icons/main-icon.png" alt="" height="75" width="75" /> />
      <h1 id="head-line">Marvinpedia</h1>
    </div>
    <div class="header-content">
      <h1>Test1</h1>
      <h1>Test2</h1>
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
  padding-left: 1rem;
  padding-right: 1rem;
  width: max-content;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

#head-line {
  color: #333;
}

.header-content {
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

</style>
