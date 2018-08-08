import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";

import "reflect-metadata";
import {createConnection} from "typeorm";

import { Course } from "./entity/Course"
import { CourseSchedule } from "./entity/CourseSchedule";
import { Event } from "./entity/Event";

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
    
    // Courses 
    const courseRepository = connection.getRepository(Course);
    app.post("/courses", async function(req: Request, res: Response) {
        const course = courseRepository.create(req.body)
        let r = await courseRepository.save(course)
        res.status(200).send(r)
    })

    app.get("/courses", async function(req: Request, res: Response) {
        const courses = await courseRepository.find();
        res.status(200).send(courses)
    });

    app.get("/courses/:id", async function(req: Request, res: Response) {
        const course = await courseRepository.find(req.params.id);
        res.status(200).send(course)
    });

    app.put("/courses/:id", async function(req: Request, res: Response) {
        courseRepository.update(req.params.id, req.body)
            .then(result => { 
                res.status(200).send(result.raw)
            })             
    })

    app.delete("/courses/:id", async function(req: Request, res: Response) {
        let item = await courseRepository.findOne(req.params.id);
        if (item === undefined) {
            res.status(200).send(false)
        } else {
            await courseRepository.remove(item);
            res.status(200).send(true)
        }
    });

    // Course schedules 
    const courseSchRepository = connection.getRepository(CourseSchedule);
    app.post("/courseSchedules", async function(req: Request, res: Response) {
        const courseId = req.body["courseId"]
        const course = await courseRepository.findOne(courseId)

        if (course === undefined) {
            res.status(200).send(false)
        }

        const courseSch = new CourseSchedule()
        courseSch.desc = req.body["desc"]
        courseSch.startAt = req.body["startAt"]
        courseSch.recurrentInterval = req.body["recurrentInterval"]
        courseSch.duration = req.body["duration"]
        courseSch.images = req.body["images"]
        courseSch.course = course

        let r = await courseSchRepository.save(courseSch)
        res.status(200).send(r)
    })

    app.get("/courseSchedules", async function(req: Request, res: Response) {
        var startTime = req.query["startTime"]
        if (startTime === undefined) { startTime = "0000-01-01T00:00:00Z"}
        var endTime = req.query["endTime"]
        if (endTime === undefined) { endTime = "3000-01-01T00:00:00Z"}
        var pageSize = req.query["pageSize"]
        if (pageSize === undefined) { pageSize = 20 }
        var cursorAfter = req.query["after"]
        
        const qb = courseSchRepository
            .createQueryBuilder("sch")
            .where("sch.startAt >= :st AND sch.startAt <= :et")
            .setParameters({ st: startTime, et: endTime })
            .orderBy("sch.startAt")
            .addOrderBy("sch.id")
        
        const its = await qb
            .getMany()

        var index = its.findIndex(i => i.id == cursorAfter)
        if (index === -1) { 
            index = 0 
        } else {
            index++
        }

        const items = await qb
            .skip(index)
            .take(pageSize)
            .getMany()

        const last = items[items.length-1]
        const next = last === undefined ? null : "after=" + last.id

        const r = {
            "paging": {
                "next": next
            },
            "data": items
        }
        res.status(200).send(r)
    });

    app.get("/courseSchedules/:id", async function(req: Request, res: Response) {
        const courseId = req.body["courseId"]
        const course = await courseRepository.findOne(courseId)
        
        const item = await courseSchRepository.findOne(req.params.id);
        item.course = course
        res.status(200).send(item)
    });

    app.put("/courseSchedules/:id", async function(req: Request, res: Response) {
        courseSchRepository.update(req.params.id, req.body)
            .then(result => { 
                res.status(200).send(result.raw)
            })             
    })

    app.delete("/courseSchedules/:id", async function(req: Request, res: Response) {
        let item = await courseSchRepository.findOne(req.params.id);
        if (item === undefined) {
            res.status(200).send(false)
        } else {
            await courseSchRepository.remove(item);
            res.status(200).send(true)
        }
    });

    app.post("/courseSchedules/populate", async function(req: Request, res: Response) {
        const schs: CourseSchedule[] = [];
    
        for (let i = 0; i < 100; i++) {
            let sch = new CourseSchedule();
            sch.desc = i.toString()
            sch.startAt = "2018-07-29T15:00:00Z";
            sch.duration = 0
            sch.recurrentInterval = 0
            schs.push(sch);
        }

        await courseSchRepository.save(schs)
        res.status(200).send(true)
    })

    const eventRepository = connection.getRepository(Event);
    app.get("/events", async function(req: Request, res: Response) {
        var pageSize = req.query["pageSize"]
        if (pageSize === undefined) { pageSize = 20 }
        var cursorAfter = req.query["after"]
        
        const qb = eventRepository
            .createQueryBuilder("ev")
            .orderBy("ev.createdAt", "DESC")
            .addOrderBy("ev.id")
        
        const its = await qb
            .getMany()

        var index = its.findIndex(i => i.id == cursorAfter)
        if (index === -1) { 
            index = 0 
        } else {
            index++
        }

        const items = await qb
            .skip(index)
            .take(pageSize)
            .getMany()

        const last = items[items.length-1]
        const next = last === undefined ? null : "after=" + last.id

        const r = {
            "paging": {
                "next": next
            },
            "data": items
        }
        res.status(200).send(r)
    });
    
    app.post("/events", async function(req: Request, res: Response) {
        const items = eventRepository.create(req.body);
        let r = await eventRepository.save(items);
        res.status(200).send(r)
    });
    
    app.get("/events/:id", async function(req: Request, res: Response) {
        const item = await eventRepository.findOne(req.params.id);
        res.status(200).send(item)
    });

    app.put("/events/:id", async function(req: Request, res: Response) {
        eventRepository.update(req.params.id, req.body)
            .then(result => { 
                res.status(200).send(result.raw)
            })        
    });

    app.delete("/events/:id", async function(req: Request, res: Response) {
        let item = await eventRepository.findOne(req.params.id);
        if (item === undefined) {
            res.status(200).send(false)
        } else {
            await eventRepository.remove(item);
            res.status(200).send(true)
        }
    });

    // start express server
    app.listen(3000);
});