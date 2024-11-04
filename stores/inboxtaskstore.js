import { defineStore } from "pinia";
import { ref } from "vue";

export const useTask = defineStore("inboxtaskstore", () => {
  const tasks_list = ref([]);
  const isDataFetched = ref(false);
  const currentuser = 1;

  const fetchTasks = async () =>{
    if (!isDataFetched.value) {
      try {
        const { data, error } = await useFetch(
          `/api/get-task?user_id=${currentuser}`,
          {
            method: "GET",
          }
        );
        if (error.value) {
          console.error("Error Fetching tasks:", error.value);
        } else if (data.value && data.value.body.tasks) {
          tasks_list.value = data.value.body.tasks;
          console.log("Inside");
          isDataFetched.value = true;
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };
  return { tasks_list, fetchTasks,isDataFetched};
});
