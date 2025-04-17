import app from './app.js';
import dbClient from "./config/dbClient.js"
import { envs } from './config/environments/environments.js';

const PORT = envs.PORT || 3000;
const API_PREFIX = "api";

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/${API_PREFIX}`);
});

export { server };
