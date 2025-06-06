import app from './app.js';
import dbClient from "./config/dbClient.js"
import { envs } from './config/environments/environments.js';
import { API_PREFIX } from './app.js';
const PORT = envs.PORT || 3000;
const HOST = envs.HOST || 'localhost';

const server = app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}${API_PREFIX}`);
});

export default server;
