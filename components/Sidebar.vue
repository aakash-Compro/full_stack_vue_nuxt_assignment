<template>
  <div class="sidebar">
    <div class="user-info">
      <p>{{ username }}</p>
    </div>
    <nav class="menu">
      <ul>
        <li @click="openTaskModal">
          <font-awesome-icon
            :icon="['fas', 'plus-circle']"
            style="
              color: red;
              margin-left: 2px;
              margin-right: 2px;
              font-size: 25px;
            "
          />
          Add Task
        </li>
        <li
          :class="{ active: activesection === 'inbox' }"
        >
          <nuxt-link to="/inbox"
            ><font-awesome-icon
              :icon="['fas', 'inbox']"
              :style="iconstyles('inbox')"
            />
            Inbox</nuxt-link
          >
        </li>
        <li
          :class="{ active: activesection === 'today' }"
        >
          <nuxt-link to="/today"
            ><font-awesome-icon
              :icon="['fas', 'calendar-day']"
              :style="iconstyles('today')"
            />
            Today</nuxt-link
          >
        </li>
        <li
          :class="{ active: activesection === 'filter' }"
        >
          <nuxt-link to="/filter"
            ><font-awesome-icon
              :icon="['fas', 'filter']"
              :style="iconstyles('filter')"
            />
            Filter & Label</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <TaskModal
      v-if="showTaskModal"
      @close="closeTaskModal"
    />
  </div>
</template>

<script setup>
    import { ref,onMounted, watch } from "vue";
    import TaskModal from "@/components/TaskModal.vue";
    import { useRoute, useRouter } from 'vue-router';

    let username = ref("Aakash Raturi");
    let showTaskModal = ref(false);

    const route=useRoute();

    let activesection=ref(route.path.split('/')[1] || "inbox");

    const openTaskModal = () => {
        showTaskModal.value = true;
    };

    const closeTaskModal = () => {
        showTaskModal.value = false;
    };

    const setActiveSection = (section) => {
        activesection.value = section;
    };

    watch(
      ()=>route.path,
      (newPath,oldPath)=>{
        activesection.value=newPath.split("/")[1] || "inbox";
      }
    )

    const iconstyles = (section) => ({
        color: activesection.value === section ? "red" : "black",
        marginRight: "4px",
        marginLeft: "5px",
    });
</script>

<style>
    .sidebar {
        width: 15%;
        position: fixed;
        height: 100%;
        background-color: #fcfaf9;
        padding: 20px;
    }

    .user-info {
        margin: 0px;
        font-size: 25px;
        margin-left:11px;
    }

    .menu ul {
        padding: 0;
    }

    .menu ul li a {
        text-decoration: none;
    }

    .menu ul li {
        font-size: 17px;
        list-style-type: none;
        margin: 15px 0px;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
    }

    .menu ul li.active {
        background-color: #ffe6e6;
    }

    .menu ul li a.active {
        color: red;
    }
</style>
