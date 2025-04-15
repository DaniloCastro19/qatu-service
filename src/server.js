import app from './app.js';
import { API_PREFIX } from './utils/constants.js';
import { envs } from './config/environments/environments.js';
const PORT = envs.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/${API_PREFIX}`);
});

export default server;
