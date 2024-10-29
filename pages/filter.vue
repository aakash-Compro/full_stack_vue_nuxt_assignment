<template>
   <div>
      <h1>Filters and Labels</h1>
      <div class="filters">
         <h3>Filters</h3>
         <div v-if="arr_list && arr_list.length > 0">
            <div v-for="curr in arr_list" :key="curr.created_at">
               <div v-for="p_tag in curr.priority_tag" :key="p_tag">
                  <span>{{ p_tag }}</span>
               </div>
            </div>
         </div>
      </div>
      <div class="label">
         <h3>Labels</h3>
         <div v-if="arr_list && arr_list.length > 0">
            <div v-for="curr in arr_list" :key="curr.created_at">
               <div v-for="tags in curr.tags" :key="tags">
                  <span>{{tags}}</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
 import { ref, onMounted } from "vue";
 const arr_list=ref({});
 const user_id=1;

   const fetchTasks = async () => {
      try{
         const { data, error } = await useFetch(`http://localhost:3000/api/get-user?user_id=${user_id}`, {
            method: "GET",
         });
         if (error.value) {
            console.error("Error Fetching tasks:", error.value);
         }
         else if (data.value && data.value.body.user) {
            console.log("User Deatils:",data.value.body.user);
            arr_list.value = data.value.body.user;
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