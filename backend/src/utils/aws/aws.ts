import dotenv from "dotenv";
dotenv.config();
import { S3Client } from "@aws-sdk/client-s3";

import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID!,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY!,
  },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID!,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY!,
  },
});

export { AWS, s3Client };
