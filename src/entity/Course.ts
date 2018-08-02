
import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";
import { CourseSchedule } from "./CourseSchedule";

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    desc: string;
    
    @Column()
    level: string;
    
    @Column()
    teacher: string;

    @Column()
    active: boolean;

    @Column()
    createdAt: string;

    @OneToMany(type => CourseSchedule, courseSchedule => courseSchedule.course)
    @JoinColumn()
    courseSchedules: CourseSchedule[];
}