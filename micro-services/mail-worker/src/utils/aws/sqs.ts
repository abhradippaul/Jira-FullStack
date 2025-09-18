import { sendMail } from "../mail/resend.js";
import { AWS } from "./aws.js";

const s3UploadNotificationSQS = new AWS.SQS();
const queueUrl = process.env.AWS_S3_UPLOAD_SQS!;

const paramsReceiveMessage = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10,
  VisibilityTimeout: 30,
  WaitTimeSeconds: 20,
  MessageAttributeNames: ["welcome_mail"],
};

export async function pollMessages() {
  while (true) {
    await reciveMessage();
  }
}

async function reciveMessage() {
  try {
    const { $response, Messages } = await s3UploadNotificationSQS
      .receiveMessage(paramsReceiveMessage)
      .promise();
    if ($response.error) {
      console.error("Error receiving messages:", $response.error);
    } else if (Messages?.length) {
      Messages?.forEach((message) => {
        console.log("Message Attributes:", message);
        if (message?.ReceiptHandle) {
          sendMail(
            "abhradipserampore@gmail.com",
            "Welcome mail",
            "Abhradip"
          ).then(({ data }) => {
            if (data?.id) deleteMessage(message?.ReceiptHandle || "");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function deleteMessage(receiptHandle: string) {
  try {
    const deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    s3UploadNotificationSQS.deleteMessage(deleteParams, (err, data) => {
      if (err) {
        console.error("Delete Error", err);
      } else {
        console.log("Message Deleted", data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
