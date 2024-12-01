import { ddbDocClient } from '../utils/dynamodb';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export default defineEventHandler(async (event) => {
    try{
        const { user_id, due_date } = getQuery(event);
        if (!user_id || !due_date) {
            return {
                status: 400,
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
            status: 200,
            body: {
                message: 'Tasks retrieved successfully',
                tasks: data.Items || [],
            },
        };
    }
    catch (err) {
        console.error('Error retrieving tasks:', err);
        return {
            status: 500,
            body: {
                error: 'Internal Server Error',
            },
        };
    }
});