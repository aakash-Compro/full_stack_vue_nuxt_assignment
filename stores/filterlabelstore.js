import { defineStore } from "pinia";
import { ref } from 'vue';

export const filterlabel=defineStore('filterlabelstore',()=>{
    const flag=ref(false);
    const arr_list=ref([]);
    const fetchTasks=async()=>{
        try{
           const { data, error } = await useFetch(`http://localhost:3000/api/get-user?user_id=${1}`, {
              method: "GET",
           });
           if (error.value) {
              console.error("Error Fetching tasks:", error.value);
           }
           else if (data.value && data.value.body.user) {
              arr_list.value = data.value.body.user;
              flag.value=true;
           }
        }
        catch (err){
           console.error("Error:", err);
        }
    };
    return { fetchTasks, flag, arr_list };
});