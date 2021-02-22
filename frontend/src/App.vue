<template>
  <div id="app">
    <Header />
    <div id="body">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    Header,
  },
};
</script>

<style>
#app {
  font-family: Hiragino Mincho Pro, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h3 {
  font-weight: bold;
}

#body {
  text-align: center;
  width: 1000px;
  margin: 60px auto;
}

.error {
  color: #ff0000;
}
</style>
