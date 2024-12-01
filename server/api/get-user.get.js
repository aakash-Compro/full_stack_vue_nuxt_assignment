import { ddbDocClient } from '../utils/dynamodb';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export default defineEventHandler(async (event) => {
    try{
        const {user_id}=getQuery(event);
        if(!user_id){
            return{
                statuscode:400,
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
            status: 200,
            body: {
                message: 'User Details Retrieved successfully',
                user:data.Items || []
            },
        };
    }
    catch(err){
        console.err("Error for fetch user details",err);
        return{
            statuscode:500,
            body:{
                error:'Internal server error'
            }
        }
    }
});