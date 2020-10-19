<template>
  <div id="app">
    <FormDesigner></FormDesigner>
    <CrudTable tableName='dept'
               :visibleList='{
           tableTitle:false,
         }'
               fullHeight>
    </CrudTable>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
