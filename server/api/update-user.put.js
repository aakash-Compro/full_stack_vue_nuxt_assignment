import { ddbDocClient } from "../utils/dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { tags, user_id } = body;

    if (!tags) {
      return {
        statusCode: 400,
        body: {
          error: "tags are required",
        },
      };
    }

    const updateExpressionParts = [];
    const expressionAttributeValues = {};

    if (tags) {
      updateExpressionParts.push("tags = :tags");
      expressionAttributeValues[":tags"] = tags;
    }

    const timestamp = new Date().toISOString();
    updateExpressionParts.push("updated_at = :updated_at");
    expressionAttributeValues[":updated_at"] = timestamp;

    if (updateExpressionParts.length === 1) {
      return {
        statusCode: 400,
        body: {
          error: "No fields to update",
        },
      };
    }

    const updateExpression = "set " + updateExpressionParts.join(", ");
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME1,
      Key: {
        user_id: user_id,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    const updatedTask = await ddbDocClient.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: {
        message: "Task updated successfully",
        updatedTask: updatedTask.Attributes,
      },
    };
  } catch (err) {
    console.error("Error updating task:", err);
    return {
      statusCode: 500,
      body: {
        error: "Internal Server Error",
      },
    };
  }
});
