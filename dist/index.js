"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./app/database");
// dotenv config
database_1.AppDataSource.initialize().then(() => {
    console.log('Database connected');
    const app = require('./app/app').default;
    app.listen(3000, () => {
        console.log(`Server is running on http://localhost:3000`);
    });
}).catch((err) => {
    console.log(err);
    //Shut down the server
    process.exit(1);
});
