import { ddbDocClient } from '../utils/dynamodb';
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export default defineEventHandler(async (event) => {
    try {
        const { user_id, task_id } = getQuery(event);
        if (!user_id || !task_id) {
            return {
                status: 400,
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
            status: 200,
            body: {
                message: `Task with task_id ${task_id} deleted successfully for user ${user_id}`,
            },
        };
    } catch (err) {
        console.error('Error deleting task:', err);
        return {
            status: 500,
            body: {
                error: 'Internal Server Error',
            },
        };
    }
});
