<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="task-modal">
      <div class="modal-content">
        <h3>Add New Task</h3>
        <form @submit.prevent="submitTask">
          <div class="form-group">
            <label for="task_name">Task Name:</label>
            <input type="text" id="task_name" v-model="taskName" required />
          </div>

          <div class="form-group">
            <label for="task_desc">Task Description:</label>
            <textarea id="task_desc" v-model="taskDesc" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label for="priority">Priority:</label>
            <select v-model="priority" id="priority">
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tag">Tag:</label>
            <input type="text" id="tag" v-model="tag" />
          </div>
          <div class="form-group">
            <label for="due_date">Due Date:</label>
            <input type="date" id="due_date" v-model="dueDate" @change="formatDate" />
          </div>

          <div class="modal-buttons">
            <button type="button" @click="closeModal">Cancel</button>
            <button type="submit">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, defineEmits } from 'vue';
  import { format } from 'date-fns';
  import Toastify from 'toastify-js';
  import 'toastify-js/src/toastify.css';

  const emit = defineEmits(['close', 'add']);

  let taskName = ref('');
  let taskDesc = ref('');
  let priority = ref('P1');
  let tag = ref('');
  let dueDate = ref('');
  let isOpen = ref(true);

  const closeModal = () => {
    emit('close');
  };

  const formatDate = () => {
    if (dueDate.value) {
      dueDate.value = format(new Date(dueDate.value), 'yyyy-MM-dd');
    }
  };

  const submitTask = async () => {
    const taskData = {
      user_id: '1',
      task_name: taskName.value,
      task_desc: taskDesc.value,
      priority: priority.value,
      tags: tag.value,
      due_date: dueDate.value
    };
    try {
      const response = await $fetch('http://localhost:3000/api/create-todo', {
        method: 'POST',
        body: taskData,
      });
      if (response.status === 201) {
        Toastify({
          text: "Task created successfully!",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          close: true
        }).showToast();
      } else {
        Toastify({
          text: "Failed to create task!",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
          close: true
        }).showToast();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
</script>

<style scoped>

  h3{
    font-size:30px;
    text-align: center;
    color: red;
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
    z-index: 1000;
  }

  .task-modal {
    background-color: #fff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 20px;
    width: 80%;
    max-width: 500px;
  }

  .modal-content {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    margin-top: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    transition: border-color 0.3s;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    border-color: #007bff;
    outline: none;
  }

  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .modal-buttons button {
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
  }

  .modal-buttons button[type='button'] {
    background-color: #f5f5f5;
  }

  .modal-buttons button[type='submit'] {
    background-color: red;
    color: white;
  }
</style>