<script>
export default {
  name: "Header",
};
</script>

<template>
  <div class="container">
    <p id="bottom-line">© 2024 Marvinpedia - All Rights Reserved</p>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 0 auto;
  padding: 0 20px;
  background-color: #f5f5f5;
  width: 100%;
}

#bottom-line {
  color: #333;
}

</style>
