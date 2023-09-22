import express, { Application, ErrorRequestHandler , Request, Response } from "express";
import { routerUser } from "../router/user.route";
import { config } from 'dotenv'; 
import cors from 'cors';
import { IServer } from "../interfaces/server.interfaces";
config();
export default class Server implements IServer{
  private app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  configureMiddleware(): void {
    this.app.use(express.json());

    this.app.use(cors({
      origin: process.env.DOMAIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true 
    }));

    this.app.use(this.errorHandler);
  }

  configureRoutes(): void {
    this.app.use("/users", routerUser);
  }

  errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: express.NextFunction) => {
    console.error("An error occurred:", err);
    res.status(500).send("Internal Server Error");
  }

   start(): void {
    const port = process.env.PORT; 
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}