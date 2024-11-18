const { ddbDocClient } = require('../server/utils/dynamodb');
const { PutCommand,QueryCommand,DeleteCommand,UpdateCommand,GetCommand } = require("@aws-sdk/lib-dynamodb");

exports.handler = async (event) => {
    const { path, httpMethod } = event;

    if (httpMethod === 'GET' && path==='/get-task') {
        try {
            const { queryStringParameters } = event;
            const user_id = queryStringParameters?.user_id;
    
            if (!user_id) {
                return {
                    'statusCode': 400,
                    body: JSON.stringify({
                        error: 'Missing user_id parameter',
                    }),
                };
            }
            const params = {
                TableName: process.env.DYNAMODB_TABLE_NAME2,
                KeyConditionExpression: 'user_id = :user_id',
                ExpressionAttributeValues: {
                    ':user_id': user_id,
                },
            };
    
            const data = await ddbDocClient.send(new QueryCommand(params));
    
            return {
                'statusCode': 200,
                body: JSON.stringify({
                    message: 'Tasks retrieved successfully',
                    tasks: data.Items || [],
                }),
            };
        }
        catch (err) {
            console.error('Error fetching tasks:', err);
            return {
                'statusCode': 500,
                body: JSON.stringify({
                    error: 'Internal Server Error',
                }),
            };
        }
    }
    else if (httpMethod === 'POST' && path === '/create-todo') {
        try{
            const body = JSON.parse(event.body);
            const { user_id, task_name, task_desc, due_date, priority, tags } = body;
            if(
              !user_id ||
              !task_name ||
              !task_desc ||
              !due_date ||
              !priority ||
              !tags
            ){
              return {
                'statusCode': 400,
                body: JSON.stringify({
                  error: "Some of the deatils were missing!!!!",
                }),
              };
            }
            if (isNaN(Date.parse(due_date))) {
              return {
                'statusCode': 400,
                body: {
                  error: "Invalid due_date and Must be in ISO-Format!!!!",
                },
              };
            }
            const Priority_arr = ["P1", "P2", "P3", "P4"];
            if (!Priority_arr.includes(priority)) {
              return {
                'statusCode': 400,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "*",
                },
                body: {
                  error: "There is an missing of the Priority among P1,P2,P3,P4!!!!",
                },
              };
            }
        
            const id = Date.now();
        
            const timestamp = new Date().toISOString();
            const stage = "Not Completed";
        
            const todoItem = {
              user_id,
              task_id: id.toString(),
              task_name,
              task_desc,
              due_date,
              priority,
              taskState: stage,
              tags,
              created_at: timestamp,
              updated_at: timestamp,
            };
        
            const params = {
              TableName: process.env.DYNAMODB_TABLE_NAME2,
              Item: todoItem,
            };
        
            await ddbDocClient.send(new PutCommand(params));
            console.log("Aakash:");
            return {
              'statusCode': 200,
              body: JSON.stringify({
                message: "Todo created successfully",
                todo: todoItem,
              }),
            };
        }
        catch (err){
            console.log("Error creating todo:", err);
            return {
              'statusCode': 500,
              body: {
                error: "Internal Server Error1234", 
              },
            };
        }
    }
    else if(httpMethod === 'GET' && path === '/filter-task'){
        try{
            const { queryStringParameters } = event;
            const user_id=queryStringParameters?.user_id;
            const due_date=queryStringParameters?.due_date;

            if (!user_id || !due_date) {
                return {
                    'statusCode': 400,
                    body: {
                        error: 'Missing user_id or due_date parameter',
                    },
                };
            }

            const params = {
                TableName: process.env.DYNAMODB_TABLE_NAME2,
                KeyConditionExpression: 'user_id = :user_id',
                FilterExpression: 'due_date = :due_date',
                ExpressionAttributeValues: {
                    ':user_id': user_id,
                    ':due_date': due_date,
                },
            };

            const data = await ddbDocClient.send(new QueryCommand(params));
            
            return{
                'statusCode': 200,
                body: JSON.stringify({
                    message: 'Tasks retrieved successfully',
                    tasks: data.Items || [],
                }),
            };
        }
        catch(err){
            console.error("Error Fetching Today Tasks:",err);
            return {
                'statusCode':500,
                body:JSON.stringify({
                    error:'Internal server Error',
                })
            }
        }
    }
    else if(httpMethod === 'GET' && path === '/get-user'){
        try{
            const { queryStringParameters } = event;
            const user_id = queryStringParameters?.user_id;
            if(!user_id){
                return{
                    'statusCode':400,
                    body:{
                        error:'Missing user_id parameter',
                    }
                }
            }
            const params={
                TableName:process.env.DYNAMODB_TABLE_NAME1,
                KeyConditionExpression: 'user_id = :user_id',
                ExpressionAttributeValues: {
                    ':user_id': user_id,
                },
            }
            const data = await ddbDocClient.send(new QueryCommand(params));
            return {
                'statusCode': 200,
                body: JSON.stringify({
                    message: 'User Details Retrieved successfully',
                    user:data.Items || []
                }),
            };
        }
        catch(err){
            console.error("Error Fetching Users:",err);
            return {
                'statusCode':500,
                body:JSON.stringify({
                    error:'Internal server Error',
                })
            }
        }
    }
    else if(httpMethod === 'DELETE' && path === '/delete-task'){
        try{
            const { queryStringParameters } = event;
          const user_id = queryStringParameters?.user_id;
          const task_id=queryStringParameters?.task_id;
          if (!user_id || !task_id) {
              return {
                  'statusCode': 400,
                  body: {
                    error: 'Missing user_id or task_id parameter',
                  },
              };
          }
          const params = {
              TableName: process.env.DYNAMODB_TABLE_NAME2,
              Key: {
                  user_id: user_id,
                  task_id: task_id,   
              },
          };
          await ddbDocClient.send(new DeleteCommand(params));
          return {
              'statusCode': 200,
              body: JSON.stringify({
                message: `Task with task_id ${task_id} deleted successfully for user ${user_id}`,
              }),
          };
        }
        catch(err){
          console.error("Error Deleting Tasks:",err);
          return {
              'statusCode':500,
              body:JSON.stringify({
                  error:'Internal server Error',
              })
          }
        }
    }
    else if(httpMethod === 'PUT' && path === '/update-task'){
        try{
            const body = JSON.parse(event.body);
            const { user_id, task_id, task_name,taskState,task_desc, due_date, priority, tags } = body;
        
            if (!user_id || !task_id){
                return{
                    'statusCode': 400,
                    body: {
                        error: 'user_id and task_id are required',
                    },
                };
            }
        
            if (due_date && isNaN(Date.parse(due_date))) {
                return {
                    'statusCode': 400,
                    body: {
                        error: 'Invalid due_date format, must be ISO-8601 format',
                    },
                };
            }

            const Priority_arr = ['P1', 'P2', 'P3', 'P4'];

            if (priority && !Priority_arr.includes(priority)){
                return {
                    'statusCode': 400,
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
                    'statusCode': 400,
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
                'statusCode': 200,
                body: {
                    message: 'Task updated successfully',
                    updatedTask: updatedTask.Attributes,
                },
            };
        }
        catch(err){
            console.log('Error while update Task:',err);
            return {
                'statusCode': 500,
                body: {
                  error: "Internal Server Error!!!!", 
                },
            };
        }
    }
    else if(httpMethod === 'PUT' && path === '/update-user'){
        try{
            const body = JSON.parse(event.body);
            const { user_id,tags } = body;

            if (!tags || !user_id){
                return {
                    'statusCode': 400,
                    body: {
                     error: "Tags and user_id are required",
                    },
                };
            }

            const getUserParams = {
                TableName: process.env.DYNAMODB_TABLE_NAME1,
                Key: { user_id },
            };
            
            const existingUser = await ddbDocClient.send(new GetCommand(getUserParams));
            let updatedTags = tags;

            if (existingUser.Item && existingUser.Item.tags) {
                updatedTags = Array.from(new Set([...existingUser.Item.tags,tags]));
            }

            const timestamp = new Date().toISOString();

            const params = {
                TableName: process.env.DYNAMODB_TABLE_NAME1,
                Key: { user_id },
                UpdateExpression: "SET tags = :tags, updated_at = :updated_at",
                ExpressionAttributeValues: {
                    ":tags": updatedTags,
                    ":updated_at": timestamp,
                },
                ReturnValues: "ALL_NEW",
            };

            const updatedUser = await ddbDocClient.send(new UpdateCommand(params));

            return {
                'statusCode': 200,
                body: {
                    message: "User tags updated successfully",
                    updatedUser: updatedUser.Attributes,
                },
            };
        }
        catch(err){
            console.log('Error while updating User:',err);
            return {
                'statusCode': 500,
                body: {
                  error: "Internal Server Error!!!!", 
                },
            };
        }
    }
    else {
      return {
        'statusCode': 405,
        body:{
          message: 'Method Not Allowed' 
        },
      };
    }
}; 