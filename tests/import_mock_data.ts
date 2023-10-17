import { DataSource } from "typeorm";
const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "7554",
    database: "postgres",
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
});

AppDataSource.initialize().then(() => {
    console.log("Database connected");
}
).catch((err) => {
    console.log(err);
});