import { ddbDocClient } from '../utils/dynamodb';
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
       
export default defineEventHandler(async (event)=>{
    try{
        const body = await readBody(event);
        const { user_id, task_id, task_name,taskState,task_desc, due_date, priority, tags } = body;
        
        if (!user_id || !task_id){
            return{
                statusCode: 400,
                body: {
                    error: 'user_id and task_id are required',
                },
            };
        }
       
        if (due_date && isNaN(Date.parse(due_date))) {
            return {
                statusCode: 400,
                body: {
                    error: 'Invalid due_date format, must be ISO-8601 format',
                },
            };
        }

        const Priority_arr = ['P1', 'P2', 'P3', 'P4'];

        if (priority && !Priority_arr.includes(priority)){
            return {
                statusCode: 400,
                body: {
                    error: 'Invalid priority value, must be one of P1, P2, P3, P4',
                },
            };
        }

        const updateExpressionParts = [];
        const expressionAttributeValues = {};
        
        if (task_name) {
            updateExpressionParts.push('task_name = :task_name');
            expressionAttributeValues[':task_name'] = task_name;
        }

        if(taskState){
            updateExpressionParts.push('taskState=:taskState');
            expressionAttributeValues[':taskState']=taskState;
        }

        if (task_desc) {
            updateExpressionParts.push('task_desc = :task_desc');
            expressionAttributeValues[':task_desc'] = task_desc;
        }

        if (due_date) {
            updateExpressionParts.push('due_date = :due_date');
            expressionAttributeValues[':due_date'] = due_date;
        }

        if(priority){
            updateExpressionParts.push('priority = :priority');
            expressionAttributeValues[':priority'] = priority;
        }

        if (tags && tags.length > 0) {
            updateExpressionParts.push('tags = :tags');
            expressionAttributeValues[':tags']=tags;
        }

        const timestamp = new Date().toISOString();
        updateExpressionParts.push('updated_at = :updated_at');
        expressionAttributeValues[':updated_at'] = timestamp;

        if(updateExpressionParts.length === 1) {
            return {
                statusCode: 400,
                body: {
                    error: 'No fields to update',
                },
            };
        }

        const updateExpression = 'set ' + updateExpressionParts.join(', ');
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME2,
            Key: {
                user_id: user_id,
                task_id: task_id,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        };

        const updatedTask = await ddbDocClient.send(new UpdateCommand(params));
        return {
            statusCode: 200,
            body: {
                message: 'Task updated successfully',
                updatedTask: updatedTask.Attributes,
            },
        };
    } 
    catch (err) {
        console.error('Error updating task:', err);
        return {
            statusCode: 500,
            body: {
                error: 'Internal Server Error',
            },
        };
    }
});