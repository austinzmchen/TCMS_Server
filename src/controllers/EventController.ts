// Import only what we need from express
import { Router, Request, Response } from 'express';

import { getConnection } from '../../node_modules/typeorm';
import { Event } from '../entity/Event';

export class EventController {
    router = Router()

    constructor() {
        var router = this.router

        const eventRepository = getConnection().getRepository(Event)
        router.get("/", async function(req: Request, res: Response) {
            var isFeatured = req.query["isFeatured"] === "true" // param expect "true"
            
            var pageSize = req.query["pageSize"]
            if (pageSize === undefined) { pageSize = 20 }
            var cursorAfter = req.query["after"]
            
            var qb = eventRepository
                .createQueryBuilder("ev")
                .orderBy("ev.createdAt", "DESC")
                .addOrderBy("ev.id")

            if (isFeatured) {
                qb = qb
                    .where("notes = 'isFeatured'")
            }
            
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

        router.post("/", async function(req: Request, res: Response) {
            const items = eventRepository.create(req.body);
            let r = await eventRepository.save(items);
            res.status(200).send(r)
        });

        router.get("/:id", async function(req: Request, res: Response) {
            const item = await eventRepository.findOne(req.params.id);
            res.status(200).send(item)
        });

        router.put("/:id", async function(req: Request, res: Response) {
            eventRepository.update(req.params.id, req.body)
                .then(result => { 
                    res.status(200).send(result.raw)
                })        
        });

        router.delete("/:id", async function(req: Request, res: Response) {
            let item = await eventRepository.findOne(req.params.id);
            if (item === undefined) {
                res.status(200).send(false)
            } else {
                await eventRepository.remove(item);
                res.status(200).send(true)
            }
        });

    }
}
