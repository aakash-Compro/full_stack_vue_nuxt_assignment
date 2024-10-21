import { ddbDocClient } from '../utils/dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export default defineEventHandler(async (event)=>{
    try{
        const body=await readBody(event);
        const { user_id,task_name,task_desc,due_date,priority,taskState,tags }=body;
        if( !user_id || !task_name || !task_desc || !due_date || !priority || !taskState || !tags ){
            return{
                status:400,
                body:{
                    error:'Some of the deatils were missing!!!!',
                }
            }
        }
        if (isNaN(Date.parse(due_date))) {
            return {
              status: 400,
              body:{ 
                error: 'Invalid due_date and Must be in ISO-Format!!!!'
              },
            };
          }
        const Priority_arr=['P1','P2','P3','P4'];
        if(!Priority_arr.includes(priority)){
            return {
                status:400,
                body:{
                    error:'There is an missing of the Priority among P1,P2,P3,P4!!!!',
                }
            }
        }
        const id = Date.now();

        const timestamp = new Date().toISOString();

        const todoItem = {
            user_id,
            task_id: id.toString(),
            task_name,
            task_desc,
            due_date,
            priority,
            taskState,
            tags,
            created_at: timestamp,
            updated_at: timestamp,
        };

        const params={
            TableName: process.env.DYNAMODB_TABLE_NAME2,
            Item: todoItem,
        };

        await ddbDocClient.send(new PutCommand(params));

        return {
            status: 201,
            body:{
                message: 'Todo created successfully',
                todo: todoItem,
            },
        };
    }
    catch(err){
        console.error('Error creating todo:',err);
        return {
            status: 500,
            body:{
                error: 'Internal Server Error',
            },
        };
    }
});