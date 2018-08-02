"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Course_1 = require("./entity/Course");
const CourseSchedule_1 = require("./entity/CourseSchedule");
// create typeorm connection
typeorm_1.createConnection().then(connection => {
    // create and setup express app
    const app = express();
    app.use(bodyParser.json());
    // register routes
    app.get("/", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).send({
                meg: "Hello World!"
            });
        });
    });
    const userRepository = connection.getRepository(User_1.User);
    app.get("/users", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userRepository.find();
            console.log("users: ", users);
            res.status(200).send(users);
        });
    });
    app.post("/users", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = userRepository.create(req.body);
            userRepository.save(user);
            res.status(200).send(user);
        });
    });
    app.get("/users/:id", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findOne(req.params.id);
            res.status(200).send(user);
        });
    });
    app.put("/users/:id", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            userRepository.update(req.params.id, req.body)
                .then(result => {
                res.status(200).send(result.raw);
            });
        });
    });
    app.delete("/users/:id", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield userRepository.findOne(req.params.id);
            if (user === undefined) {
                res.status(200).send(false);
            }
            else {
                yield userRepository.remove(user);
                res.status(200).send(true);
            }
        });
    });
    // Courses 
    const courseRepository = connection.getRepository(Course_1.Course);
    app.post("/courses", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = courseRepository.create(req.body);
            yield courseRepository.save(course);
            res.status(200).send(course);
        });
    });
    app.get("/courses", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield courseRepository.find();
            res.status(200).send(courses);
        });
    });
    app.get("/courses/:id", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseRepository.find(req.params.id);
            res.status(200).send(course);
        });
    });
    app.put("/courses/:id", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            courseRepository.update(req.params.id, req.body)
                .then(result => {
                res.status(200).send(result.raw);
            });
        });
    });
    // Course schedules 
    const courseSchRepository = connection.getRepository(CourseSchedule_1.CourseSchedule);
    app.post("/courseSchedules", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = req.body["courseId"];
            const course = yield courseRepository.findOne(courseId);
            if (course === undefined) {
                res.status(200).send(false);
            }
            const courseSch = new CourseSchedule_1.CourseSchedule();
            courseSch.desc = req.body["desc"];
            courseSch.startAt = req.body["startAt"];
            courseSch.recurrentInterval = req.body["recurrentInterval"];
            courseSch.duration = req.body["duration"];
            courseSch.course = course;
            yield courseSchRepository.save(courseSch);
            res.status(200).send(true);
        });
    });
    app.get("/courseSchedules", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const items = await courseSchRepository.find({ relations: ["course"] });
            // res.status(200).send(items)
            var startTime = req.query["startTime"];
            if (startTime === undefined) {
                startTime = "0000-01-01T00:00:00Z";
            }
            var endTime = req.query["endTime"];
            if (endTime === undefined) {
                endTime = "3000-01-01T00:00:00Z";
            }
            var pageSize = req.query["pageSize"];
            if (pageSize === undefined) {
                pageSize = 20;
            }
            var cursorAfter = req.query["after"];
            const qb = courseSchRepository
                .createQueryBuilder("sch")
                .where("sch.startAt >= :st AND sch.startAt <= :et")
                .setParameters({ st: startTime, et: endTime })
                .orderBy("sch.startAt")
                .addOrderBy("sch.id");
            const its = yield qb
                .getMany();
            var index = its.findIndex(i => i.id == cursorAfter);
            if (index === -1) {
                index = 0;
            }
            else {
                index++;
            }
            const items = yield qb
                .skip(index)
                .take(pageSize)
                .getMany();
            const last = items[items.length - 1];
            const r = {
                "paging": {
                    "next": "after=" + last.id
                },
                "data": items
            };
            res.status(200).send(r);
        });
    });
    app.get("/courseSchedules/:id", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = req.body["courseId"];
            const course = yield courseRepository.findOne(courseId);
            const item = yield courseSchRepository.findOne(req.params.id);
            item.course = course;
            res.status(200).send(item);
        });
    });
    app.put("/courseSchedules/:id", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            courseSchRepository.update(req.params.id, req.body)
                .then(result => {
                res.status(200).send(result.raw);
            });
        });
    });
    app.post("/courseSchedules/populate", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schs = [];
            for (let i = 0; i < 100; i++) {
                let sch = new CourseSchedule_1.CourseSchedule();
                sch.desc = i.toString();
                sch.startAt = "2018-07-29T15:00:00Z";
                sch.duration = 0;
                sch.recurrentInterval = 0;
                schs.push(sch);
            }
            courseSchRepository.save(schs);
            res.status(200).send(true);
        });
    });
    // start express server
    app.listen(3000);
});
//# sourceMappingURL=app.js.map