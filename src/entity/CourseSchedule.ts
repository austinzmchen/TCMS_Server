
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Course } from "./Course";

@Entity()
export class CourseSchedule {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Course, course => course.courseSchedules)
    @JoinColumn()
    course: Course;

    @Column()
    desc: string;
    
    @Column()
    startAt: string;
    
    @Column()
    duration: number;

    @Column()
    recurrentInterval: number;

    @Column({default: ""})
    notes: string;
}