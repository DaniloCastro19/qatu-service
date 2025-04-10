import app from './app.js';
import displayRoutes from 'express-routemap';


const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Server running on port ${PORT}`);
});

export { server };
