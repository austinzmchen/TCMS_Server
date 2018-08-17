// Import only what we need from express
import { Router, Request, Response } from 'express';

import { getConnection } from '../../node_modules/typeorm';
import { Course } from '../entity/Course';
import { CourseSchedule } from '../entity/CourseSchedule';

export class CourseScheduleController {
    router = Router()

    constructor() {
        var router = this.router

        // Course schedules 
        const courseRepository = getConnection().getRepository(Course);
        const courseSchRepository = getConnection().getRepository(CourseSchedule);

        router.post("/", async function(req: Request, res: Response) {
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

        router.get("/", async function(req: Request, res: Response) {
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

        router.get("/:id", async function(req: Request, res: Response) {
            const courseId = req.body["courseId"]
            const course = await courseRepository.findOne(courseId)
            
            const item = await courseSchRepository.findOne(req.params.id);
            item.course = course
            res.status(200).send(item)
        });

        router.put("/:id", async function(req: Request, res: Response) {
            courseSchRepository.update(req.params.id, req.body)
                .then(result => { 
                    res.status(200).send(result.raw)
                })             
        })

        router.delete("/:id", async function(req: Request, res: Response) {
            let item = await courseSchRepository.findOne(req.params.id);
            if (item === undefined) {
                res.status(200).send(false)
            } else {
                await courseSchRepository.remove(item);
                res.status(200).send(true)
            }
        });

        router.post("/populate", async function(req: Request, res: Response) {
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

    }
}
