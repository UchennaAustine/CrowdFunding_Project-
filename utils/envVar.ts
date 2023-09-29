import env from "dotenv";
env.config();

export const envVars = {
  cloud_name: process.env.cloud_name as string,
  api_key: process.env.api_key as string,
  api_secret: process.env.api_secret as string,

  Port: parseInt(process.env.port!),
};
