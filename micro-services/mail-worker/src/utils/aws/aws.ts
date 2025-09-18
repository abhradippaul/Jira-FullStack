import dotenv from "dotenv";
dotenv.config();

import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID!,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY!,
  },
});

export { AWS };
