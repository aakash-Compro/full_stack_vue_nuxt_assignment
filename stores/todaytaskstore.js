import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format } from "date-fns";

export const todayTask = defineStore('todaytaskstore', () => {
  let taskslist_date = ref([]);
  let user_id = 1;
  let flag = ref(false);

  const fetchTasks = async () => {
    if (!flag.value) {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      try {
        const { data,error } = await useFetch(
          `api/filter-task?user_id=${user_id}&due_date=${currentDate}`,
          {
            method: "GET",
          }
        );
        if (error.value) {
          console.error("Error Fetching tasks:",error.value);
        }
        else if (data.value && data.value.body.tasks){
          console.log("Data Fetch on Date:", data.value.body.tasks);
          taskslist_date.value = data.value.body.tasks;
          flag.value=true;
        }
      }
      catch (err) {
        console.error("Error:", err);
      }
    }
  };

  return { fetchTasks,taskslist_date,flag };
});
