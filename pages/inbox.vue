<template>
  <div class="main-div">
    <h1>Inbox</h1>
    <div
      v-if="taskStore.tasks_list && taskStore.tasks_list.length > 0"
      class="tasks-container"
    >
      <div
        v-for="task in taskStore.tasks_list"
        :key="task.task_id"
        class="task-item"
      >
        <div class="task-header">
          <div>
            <h2>{{ task.task_name }}</h2>
            <span
              :class="priorityColor(task.priority)"
              class="priority-label"
              >{{ task.priority }}</span
            >
          </div>
          <span
            class="status"
            :class="{
              'status-completed': task.taskState === 'Completed',
              'status-pending': task.taskState !== 'Completed',
            }"
          >
            {{ task.taskState }}
          </span>
        </div>
        <p class="task-desc">{{ task.task_desc }}</p>
        <p class="task-info">
          <span>Due: {{ task.due_date }}</span>
          <span>Tags: {{ task.tags }}</span>
        </p>
        <div class="icon-buttons">
          <font-awesome-icon
            :icon="['fas', 'edit']"
            class="edit-icon"
            @click="openEditModal(task)"
          />
          <font-awesome-icon
            :icon="['fas', 'trash']"
            class="delete-icon"
            @click="showMessage(task.task_id)"
          />
        </div>
      </div>
    </div>
    <div v-else class="not-found">
      <p>No tasks found.</p>
    </div>
    <div
      v-if="isEditModalOpen"
      class="modal-overlay"
      @click.self="closeEditModal"
    >
      <div class="modal-content">
        <h2>Edit Task</h2>
        <input v-model="editTask.task_name" placeholder="Task Name"/>
        <textarea
          v-model="editTask.task_desc"
          placeholder="Task Description"
        ></textarea>
        <input
          v-model="editTask.due_date"
          placeholder="Due Date"
          @change="formatDate"
        />
        <input v-model="editTask.priority" placeholder="Priority" />
        <input v-model="editTask.taskState" />
        <input v-model="editTask.due_date" type="date" id="due_date" />
        <input v-model="editTask.tags" />
        <button @click="updateTask">Save Changes</button>
        <button @click="closeEditModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTask } from "@/stores/inboxtaskstore";

const taskStore = useTask();
const tasks_list = ref([]);
const isEditModalOpen = ref(false);
const editTask = ref({});
const currentId=1;
import { todayTask } from '@/stores/todaytaskstore';
import { filterlabel } from '@/stores/filterlabelstore';
const store=todayTask();
const store1=filterlabel();

const showMessage = async (action) => {
  try{
    const { data, error } = await useFetch(
      `http://localhost:3000/api/delete-task?user_id=${1}&task_id=${action}`,
      {
        method: "DELETE",
      }
    );
    if(error.value) {
      Toastify({
        text: "Getting Some Issue!!",
        duration: 3000,
        backgroundColor: "red",
        close: true,
        position: "center",
      }).showToast();
    }
    else {
      Toastify({
        text: "Task Deleted successfully!!",
        duration: 3000,
        backgroundColor: "green",
        close: true,
        position: "center",
      }).showToast();
      const index=taskStore.tasks_list.findIndex((task)=>
         task.task_id===action
      );
      if(index!==-1){
         taskStore.tasks_list.splice(index,1);
      }
      store.flag=false;
      console.log("Delete",index);
    }
  }
  catch (err) {
    console.error("Error:", err);
  }
};

const priorityColor = (priority) => {
  return (
    {
      P1: "priority-high",
      P2: "priority-medium",
      P3: "priority-low",
      P4: "priority-none",
    }[priority] || "priority-default"
  );
};

const formatDate = () => {
  if (editTask.dueDate.value) {
    editTask.due_date.value = format(
      new Date(editTask.due_date.value),
      "yyyy-MM-dd"
    );
  }
};

const openEditModal = (task) => {
  editTask.value = { ...task };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const updateTask = async () => {
  try {
    const updateResponse = await $fetch(
      "http://localhost:3000/api/update-user",
      {
        method: "PUT",
        body: {
          user_id: "1",
          tags: editTask.value.tags,
        },
      }
    );

    if (updateResponse.error) {
      Toastify({
        text: "Failed to update user!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
        position: "center",
        close: true,
      }).showToast();
      return;
    } else {
      Toastify({
        text: "Successfull Update user",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
        position: "center",
        close: true,
      }).showToast();
      store.flag=false;
      store1.flag=false;
    }
    const { data, error } = await useFetch(
      `http://localhost:3000/api/update-task`,
      {
        method: "PUT",
        body: JSON.stringify(editTask.value),
      }
    );
    if (error.value) {
      Toastify({
        text: "Error updating task!",
        duration: 3000,
        backgroundColor: "red",
        position: "center",
        close: true,
      }).showToast();
    } else {
      const index = taskStore.tasks_list.findIndex(
        (task) => task.task_id === editTask.value.task_id
      );
      if (index !== -1) {
        taskStore.tasks_list[index] = {
          ...taskStore.tasks_list[index],
          ...editTask.value,
        };
      }
      Toastify({
        text: "Task updated successfully!",
        duration: 3000,
        backgroundColor: "green",
        close: true,
        position: "center",
      }).showToast();
      taskStore.isDataFetched = false;
      store.flag=false;
      taskStore.fetchTasks();
      closeEditModal();
      return;
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

taskStore.fetchTasks();
</script>
<style scoped>
h1 {
  color: #2d2d2d;
  font-size: 2em;
  margin-left: 70px;
  margin-bottom: 20px;
}

.tasks-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.icon-buttons {
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.not-found > p {
  margin-left: 75px;
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

.edit-icon,
.delete-icon {
  font-size: 16px;
  color: #888;
  cursor: pointer;
}

.edit-icon:hover {
  color: #007bff;
}

.delete-icon:hover {
  color: #dc3545;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-content button {
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:first-of-type {
  background-color: #28a745;
  color: white;
}

.modal-content button:last-of-type {
  background-color: #dc3545;
  color: white;
}
</style>
