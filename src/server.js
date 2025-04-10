import app from './app.js';
const PORT = process.env.PORT || 3000;
const API_PREFIX = "api";

import dbClient from "./config/dbClient.js"

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/${API_PREFIX}`);
});

export { server };
