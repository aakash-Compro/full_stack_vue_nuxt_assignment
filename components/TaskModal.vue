<template>
  <div class="task-modal" v-if="isOpen">
    <div class="modal-content">
      <h3>Add New Task</h3>
      <form @submit.prevent="submitTask">
        <div class="form-group">
          <label for="task_name">Task Name:</label>
          <input type="text" id="task_name" v-model="taskName" required />
        </div>

        <div class="form-group">
          <label for="task_desc">Task Description:</label>
          <textarea id="task_desc" v-model="taskDesc"></textarea>
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
</template>

<script setup>
    import { ref, defineEmits } from 'vue';
    import { format } from 'date-fns';

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

    const submitTask = () => {
    emit('add', {
        taskName: taskName.value,
        taskDesc: taskDesc.value,
        priority: priority.value,
        tag: tag.value,
        dueDate: dueDate.value
    });
    closeModal();
    };
</script>

<style scoped>
    .task-modal {
        position: fixed;
        right: 0;
        top: 0;
        width: 30%;
        height: 100%;
        background-color: #fff;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
        padding: 20px;
        z-index: 1000;
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
        padding: 8px;
        margin-top: 4px;
        box-sizing: border-box;
    }

    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .modal-buttons button {
        padding: 8px 12px;
        border: none;
        cursor: pointer;
        border-radius: 3px;
    }

    .modal-buttons button[type='button'] {
        background-color: #f5f5f5;
    }

    .modal-buttons button[type='submit'] {
        background-color: red;
        color: white;
    }
</style>