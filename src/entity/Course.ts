
import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";
import { CourseSchedule } from "./CourseSchedule";
import { Image } from "./Image";

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    title: string;

    @Column("text")
    desc: string;
    
    @Column()
    level: string;
    
    @Column()
    teacher: string;

    @Column()
    active: boolean;

    @Column()
    createdAt: string;

    @Column("simple-json")
    images: Image[];

    @OneToMany(type => CourseSchedule, courseSchedule => courseSchedule.course)
    @JoinColumn()
    courseSchedules: CourseSchedule[];
}