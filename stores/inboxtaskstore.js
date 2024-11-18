import { defineStore } from "pinia";
import { ref } from "vue";

export const useTask = defineStore("inboxtaskstore", () => {
  const tasks_list = ref([]);
  const isDataFetched = ref(false);
  const currentuser = 1;

  const fetchTasks = async () => {
    if(!isDataFetched.value){
      try{
        const { data, error } = await useFetch(
          `https://ce8y6nz84h.execute-api.ap-south-1.amazonaws.com/Prod/get-task?user_id=${currentuser}`,
          {
            method: "GET",
            referrerPolicy: "no-referrer"
          }
        );
        console.log("Aakash:", data);
        if(error.value) {
          console.error("Error Fetching tasks:", error.value);
        }
        else if(data.value && data.value.tasks){
          console.log("Tasks loaded successfully.");
          tasks_list.value = data.value.tasks;
          isDataFetched.value = true;
        }
      }
      catch(err){
        console.error("Error:", err);
      }
    }
  };

  return { tasks_list, fetchTasks, isDataFetched };
});
