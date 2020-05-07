<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
html,body{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
*{
  margin: 0;
  padding: 0;
}
body{
  background: linear-gradient(45deg, #270c086b, transparent);
}
</style>
