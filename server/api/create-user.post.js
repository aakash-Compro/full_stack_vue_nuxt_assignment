import { ddbDocClient } from '../utils/dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { user_id, first_name, last_name, email,tags} = body;

        if (!user_id || !first_name || !last_name || !email || !tags) {
            return {
                status: 400,
                body: {
                    error: 'Some required fields are missing',
                },
            };
        }

        const priority_tag = ['P1', 'P2', 'P3', 'P4'];

        const timestamp = new Date().toISOString();

        const userItem = {
            user_id,
            first_name,
            last_name,
            email,
            priority_tag,
            tags,
            created_at: timestamp,
        };

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME1,
            Item: userItem,
        };

        await ddbDocClient.send(new PutCommand(params));

        return {
            status: 201,
            body: {
                message: 'User created successfully',
                user: userItem,
            },
        };
    }
    catch (err) {
        console.error('Error creating user:', err);
        return {
            status: 500,
            body: {
                error: 'Internal Server Error',
            },
        };
    }
});
