<template>
   <div class="container">
      <h1>Filters and Labels</h1>
      <div class="filters">
         <h3>Filters</h3>
         <div v-if="arr_list && arr_list.length > 0" class="filter-tag">
            <div v-for="curr in arr_list" :key="curr.created_at" class="filter-item">
               <div v-for="p_tag in curr.priority_tag" :key="p_tag" class="tag">
                  <span>{{ p_tag }}</span>
               </div>
            </div>
         </div>
      </div>
      <div class="labels">
         <h3>Labels</h3>
         <div v-if="arr_list && arr_list.length > 0" class="label-tags">
            <div v-for="curr in arr_list" :key="curr.created_at" class="label-item">
               <div v-for="tags in curr.tags" :key="tags" class="label">
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

   const fetchTasks=async()=>{
      try{
         const { data, error } = await useFetch(`http://localhost:3000/api/get-user?user_id=${user_id}`, {
            method: "GET",
         });
         if (error.value) {
            console.error("Error Fetching tasks:", error.value);
         }
         else if (data.value && data.value.body.user) {
            arr_list.value = data.value.body.user;
         }
      }
      catch (err){
         console.error("Error:", err);
      }
   };

 onMounted(()=>{
   fetchTasks();
 })
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
    text-align: center;
    color: #333;
    font-size: 2rem;
}

.section-title {
    margin-top: 20px;
    color: #666;
    font-size: 1.5rem;
    border-bottom: 2px solid #007bff;
    padding-bottom: 5px;
}

.filter-tag, .label-tags {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
}

.filter-item, .label-item {
    margin: 5px;
}

.tag,.label{
    background-color: #e7f3ff;
    color: #31708f;
    border-radius: 12px;
    padding: 8px 12px;
    margin: 5px;
    font-size: 0.9rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;
}

.tag:hover, .label:hover {
   cursor: pointer;
}
</style>