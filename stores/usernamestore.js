import { defineStore } from 'pinia';
import { ref } from 'vue';

export const username=defineStore('usernamestore',()=>{
    let usernamevalue = ref("");
    let current_id=1;
    let flag=ref(false);
    
    const fetchdata=async()=>{
        try{
          const { data,error }=await useFetch(`http://localhost:3000/api/get-user?user_id=${current_id}`,{
            method:'GET',
          });
          if(error.value) {
            console.error("Error Fetching tasks:", error.value);
          }
          else if(data.value && data.value.body.user){
            console.log("Name",data.value.body.user[0].first_name);
            usernamevalue.value=data.value.body.user[0].first_name+" "+data.value.body.user[0].last_name;
            flag.value=true;
          }
        }
        catch(err){
          console.error("Err wile fetching:",err);
        }
    }
    return { fetchdata,usernamevalue,flag };
});