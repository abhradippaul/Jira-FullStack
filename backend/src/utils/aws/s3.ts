import dotenv from "dotenv";
dotenv.config();
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "./aws.js";

export async function putS3SignedUrl(key: string) {
  const putObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  const command = new PutObjectCommand(putObjectParams);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function getS3SignedUrl(key: string) {
  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  const command = new GetObjectCommand(getObjectParams);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function deleteS3Image(key: string) {
  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  const command = new DeleteObjectCommand(getObjectParams);
  return await s3Client.send(command);
}
