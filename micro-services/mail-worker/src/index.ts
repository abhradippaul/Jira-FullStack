import dotenv from "dotenv";
import { pollMessages } from "./utils/aws/sqs.js";
dotenv.config();

pollMessages().catch(console.error);
