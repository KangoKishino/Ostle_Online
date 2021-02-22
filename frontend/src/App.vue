<template>
  <div id="app">
    <h3 class="mt-3">Ostle Online</h3>
    <div id="body">
      <router-view />
    </div>
  </div>
</template>

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
  width: 800px;
  margin: 60px auto;
}

.error {
  color: #ff0000;
}
</style>
