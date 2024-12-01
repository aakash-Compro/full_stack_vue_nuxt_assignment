import { ddbDocClient } from '../utils/dynamodb';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export default defineEventHandler(async (event) => {
    try{
        const { user_id } = getQuery(event);
        if (!user_id) {
            return {
                status: 400,
                body: {
                    error: 'Missing user_id parameter',
                },
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
            status: 200,
            body: {
                message: 'Tasks retrieved successfully',
                tasks: data.Items || [],
            },
        };
    }
    catch (err) {
        console.error('Error fetching tasks:', err);
        return {
            status: 500,
            body: {
                error: 'Internal Server Error',
            },
        };
    }
});
