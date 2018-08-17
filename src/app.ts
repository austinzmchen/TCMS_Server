import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";

import "reflect-metadata";
import {createConnection} from "typeorm";

import { Course } from "./entity/Course"
import { CourseSchedule } from "./entity/CourseSchedule";
import { Event } from "./entity/Event";

import { CourseController } from "./controllers/CourseController";
import { CourseScheduleController } from "./controllers/CourseScheduleController";
import { EventController } from "./controllers/EventController";

// create typeorm connection
createConnection().then(connection => {
    // create and setup express app
    const app = express();
    app.use(bodyParser.json());
    
    // register routes
    app.get("/", async function(req: Request, res: Response) {
        res.status(200).send({
            meg: "Hello World!"
        })
    });
    
    app.use('/courses', new CourseController().router);
    app.use('/courseSchedules', new CourseScheduleController().router);
    app.use('/events', new EventController().router);

    // start express server
    app.listen(3000);
});