import express, {json} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/user";
import mongoose from "mongoose";
import "dotenv/config"
import errorMiddleware from "./middleware/error.middleware";
import rolesRoutes from "./routes/user/roles";

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.Promise = global.Promise;

// @ts-ignore
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('Mongoose connected')
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use("/api/", userRoutes);
app.use("/api/", rolesRoutes);
app.use(errorMiddleware);
app.use('*', (request: express.Request, response: express.Response) => {
    response.json({message: 'Not Found'}).status(404);
});

app.listen(PORT, () => {
    console.log('Server Started')
});

