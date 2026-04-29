type Config = {
  apiUrl: string;
};
const configDev: Config = {
  apiUrl: "http://localhost:5248/api/",
};

const configProd: Config = {
  apiUrl: "https://api.trash2cash.us/api/",
};
const env = process.env.NODE_ENV || "production";

const configMap: any = {
  development: configDev,
  production: configProd,
};

const config: Config = configMap[env];

export default config;
