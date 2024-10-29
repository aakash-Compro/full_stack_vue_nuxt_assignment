import { ddbDocClient } from "../utils/dynamodb";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { user_id,tags } = body;

    if (!tags || !user_id) {
      return {
        statusCode: 400,
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
      statusCode: 200,
      body: {
        message: "User tags updated successfully",
        updatedUser: updatedUser.Attributes,
      },
    };
  } catch (err) {
    console.error("Error updating user tags:", err);
    return {
      statusCode: 500,
      body: {
        error: "Internal Server Error",
      },
    };
  }
});
