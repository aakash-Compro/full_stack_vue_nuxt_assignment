import { defineStore } from "pinia";
import { ref } from "vue";

export const filterlabel = defineStore("filterlabelstore", () => {
  const flag = ref(false);
  let usernamevalue = ref("");
  const arr_list = ref([]);
  const fetchTasks = async () => {
    if(!flag.value){
      try{
        const { data, error } = await useFetch(
          `https://ce8y6nz84h.execute-api.ap-south-1.amazonaws.com/Prod/get-user?user_id=${1}`,
          {
            method: "GET",
          }
        );
        console.log("Name:",data.value.user);
        
        if(error.value){
          console.error("Error Fetching tasks:", error.value);
        }
        else if (data.value && data.value.user) {
          arr_list.value = data.value.user;
          usernamevalue.value =
          data.value.user[0].first_name +
          " " +
          data.value.user[0].last_name;
          flag.value = true;
        }
      }
      catch (err) {
        console.error("Error:", err);
      }
    }
  };
  return { fetchTasks, flag, arr_list,usernamevalue };
});