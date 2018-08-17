// Import only what we need from express
import { Router, Request, Response } from 'express';
import { getConnection } from '../../node_modules/typeorm';
import { Course } from '../entity/Course';

export class CourseController {
    router = Router()

    constructor() {
        var router = this.router

        // Courses 
        const courseRepository = getConnection().getRepository(Course);
        router.post("/", async function(req: Request, res: Response) {
            const course = courseRepository.create(req.body)

            var courses
            if (course instanceof Array) {
                courses = course as Course[]
            } else {
                courses = [course]
            }

            courses.forEach(element => {
                if (element.images === undefined) {
                    element.images = []
                }
            });
            let r = await courseRepository.save(courses)
            res.status(200).send(r)
        })

        router.get("/", async function(req: Request, res: Response) {
            const courses = await courseRepository.find();
            res.status(200).send(courses)
        });

        router.get("/:id", async function(req: Request, res: Response) {
            const course = await courseRepository.find(req.params.id);
            res.status(200).send(course)
        });

        router.put("/:id", async function(req: Request, res: Response) {
            courseRepository.update(req.params.id, req.body)
                .then(result => { 
                    res.status(200).send(result.raw)
                })             
        })

        router.delete("/:id", async function(req: Request, res: Response) {
            let item = await courseRepository.findOne(req.params.id);
            if (item === undefined) {
                res.status(200).send(false)
            } else {
                await courseRepository.remove(item);
                res.status(200).send(true)
            }
        });
    }
}
