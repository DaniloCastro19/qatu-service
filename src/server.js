import app from './app.js';
import { API_PREFIX } from './utils/constants.js';

const PORT = process.env.PORT || 3000;
import dbClient from "./config/dbClient.js"

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/${API_PREFIX}`);
});

export { server };
