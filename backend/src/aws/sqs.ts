import { AWS } from "./aws.js";

const s3UploadNotificationSQS = new AWS.SQS();
const queueUrl = process.env.AWS_S3_UPLOAD_SQS!;

export async function sendMessage(messageBody: string, senderName: string) {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: messageBody,
    MessageAttributes: {
      welcome_mail: {
        DataType: "String",
        StringValue: "welcome_mail",
      },
    },
  };

  try {
    const data = await s3UploadNotificationSQS.sendMessage(params).promise();
    console.log("Message sent successfully, MessageId:", data.MessageId);
    return data;
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
}
