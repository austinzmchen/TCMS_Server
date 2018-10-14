
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Course } from "./Course";
import { Image } from "./Image";

@Entity()
export class CourseSchedule {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Course, course => course.courseSchedules)
    @JoinColumn()
    course: Course;

    @Column("text")
    title: string;
    
    @Column("text")
    desc: string;
    
    @Column()
    startAt: string;
    
    @Column()
    duration: number;

    @Column()
    recurrentInterval: number;

    @Column({default: ""})
    notes: string;

    @Column("simple-json")
    images: Image[];
}