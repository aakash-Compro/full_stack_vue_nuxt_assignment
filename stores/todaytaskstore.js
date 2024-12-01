import { defineStore } from "pinia";
import { ref } from "vue";
import { format } from "date-fns";

export const todayTask = defineStore("todaytaskstore", () => {
  let taskslist_date = ref([]);
  let user_id = 1;
  let flag = ref(false);

  const fetchTasks = async () => {
    if (!flag.value) {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      try {
        const { data, error } = await useFetch(
          `https://ce8y6nz84h.execute-api.ap-south-1.amazonaws.com/Prod/filter-task?user_id=${user_id}&due_date=${currentDate}`,
          {
            method: "GET",
            referrerPolicy: "no-referrer"
          }
        );
        console.log('Today Aakash:',data.value.tasks);
        if(error.value){
          console.error("Error Fetching tasks:", error.value);
        }
        else if(data) {
          console.log("Data Fetch on Date:", data.value.tasks);
          taskslist_date.value = data.value.tasks;
          flag.value = true;
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  return { fetchTasks, taskslist_date, flag };
});
