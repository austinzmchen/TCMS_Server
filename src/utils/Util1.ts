import "reflect-metadata";
import {createConnection} from "typeorm";
import { print } from "util";
import { CourseSchedule } from "../entity/CourseSchedule";

createConnection().then(connection => {

    let repo = connection.getRepository(CourseSchedule);
    const items: CourseSchedule[] = [];
    
    for (let i = 0; i < 100; i++) {
        let item = new CourseSchedule();
        item.desc = "desc" + i
        item.notes = "notes" + i
        item.startAt = "2018"
        item.duration = 0
        item.recurrentInterval = 0

        items.push(item);
    }
    
    const qb = repo
        .createQueryBuilder("p")
        // .leftJoinAndSelect("p.author", "author")
        // .leftJoinAndSelect("p.categories", "categories")
        .skip(5)
        .take(10);
    
    Promise.all(items.map(item => repo.save(item)))
        // .then(savedPosts => {
        //     console.log("Posts has been saved. Lets try to load some posts");
        //     return qb.getMany();
        // })
        // .then(loadedPost => {
        //     console.log("post loaded: ", loadedPost);
        //     console.log("now lets get total post count: ");
        //     return qb.getCount();
        // })
        // .then(totalCount => {
        //     console.log("total post count: ", totalCount);
        //     console.log("now lets try to load it with same repository method:");
            
        //     return postRepository.findAndCount();
        // })
        // .then(entitiesWithCount => {
        //     console.log("items: ", entitiesWithCount[0]);
        //     console.log("count: ", entitiesWithCount[1]);

        // })
        .catch(error => console.log("Cannot save. Error: ", error.stack ? error.stack : error));

}, error => console.log("Cannot connect: ", error.stack ? error.stack : error));
