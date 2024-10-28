<template>
   <div>
    <h1>Filters and Labels</h1>
   </div>
</template>

<script setup>
 import { ref, onMounted } from "vue";
 const arr=ref({});
 const user_id=1;

   const fetchTasks = async () => {
      try {
         const { data, error } = await useFetch(`http://localhost:3000/api/get-user?user_id=${user_id}`, {
            method: "GET",
         });
         if (error.value) {
            console.error("Error Fetching tasks:", error.value);
         }
         else if (data.value && data.value.body.user) {
            console.log("User Deatils:",data.value.body.user[0].priority_tag);
            arr.value = data.value.body;
         }
      }
      catch (err) {
         console.error("Error:", err);
      }
   };

 onMounted(()=>{
   fetchTasks();
 })
</script>

<style scoped>

</style>