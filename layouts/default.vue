<template>
  <div class="layout">
    <Sidebar />
    <div class="content">
      <NuxtPage />
    </div>
  </div>
</template>

<script>
import Sidebar from "~/components/Sidebar.vue";
</script>

<style scoped>
.layout {
  display: flex;
}
.content {
  margin-left: 20%;
  width: 70%;
  padding: 20px;
}
</style>