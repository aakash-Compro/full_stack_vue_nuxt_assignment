<template>
   <div>
    <h1>Today Task</h1>
    <div v-if="store.taskslist_date && store.taskslist_date.length > 0" class="tasks-container">
      <div v-for="task in store.taskslist_date" :key="task.task_id" class="task-item">
        <div class="task-header">
          <div>
            <h2>{{ task.task_name }}</h2>
            <span :class="priorityColor(task.priority)" class="priority-label">{{ task.priority }}</span>
          </div>
          <span class="status" :class="{'status-completed': task.taskState === 'Completed', 'status-pending': task.taskState !== 'Completed'}">
            {{ task.taskState }}
          </span>
        </div>
        <p class="task-desc">{{ task.task_desc }}</p>
        <p class="task-info">
          <span>Due: {{ task.due_date }}</span>
          <span>Tags: {{ task.tags }}</span>
        </p>
      </div>
    </div>
    <div v-else class="not-found">
      <p>No tasks found.</p>
    </div>
   </div>
</template>

<script setup>
   import { ref, onMounted } from "vue";
   import Toastify from 'toastify-js';
   import 'toastify-js/src/toastify.css';
   const user_id = "1";
   const taskslist_date=ref([]);
   import { format } from 'date-fns';
   import { todayTask } from '@/stores/todaytaskstore';
   const store=todayTask();

   const priorityColor=(priority)=>{
   return { 
      P1:"priority-high",
      P2:"priority-medium", 
      P3:"priority-low", 
      P4:"priority-none"
      }[priority] || "priority-default";
   };
   if(store.flag===false){
    store.fetchTasks();
   }
</script>

<style scoped>
h1 {
  color: #2d2d2d;
  font-size: 2em;
  margin-left: 68px;
  margin-bottom: 20px;
}

.tasks-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.not-found > p{
   margin-left:75px;
}

.task-item {
  background: #f9f9f9;
  border-radius: 8px;
  width: 40%;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  font-size: 1.5em;
  display: inline;
}

.priority-label {
  font-size: 0.9em;
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.status {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
}

.status-completed {
  background-color: green;
}

.status-pending {
  background-color: red;
}

.task-desc {
  font-size: 1em;
  color: #555;
  margin: 10px 0;
}

.task-info {
  font-size: 0.9em;
  color: #888;
  display: flex;
  flex-direction: column;
}

.priority-high {
  color: #d9534f;
  background-color: #f8d7da;
}

.priority-medium {
  color: #f0ad4e;
  background-color: #fff3cd;
}

.priority-low {
  color: #5bc0de;
  background-color: #d1ecf1;
}

.priority-none {
  color: #5cb85c;
  background-color: #d4edda;
}
</style>