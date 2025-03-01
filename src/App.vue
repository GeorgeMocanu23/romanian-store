<script setup>
import { RouterView } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
</script>

<template>
  <div id="app">
    <NavigationBar />
    <RouterView />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  margin: 0 auto;
  padding: 0 2rem;
}

body {
  padding-top: 70px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
