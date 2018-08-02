
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Course } from "./Course";

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    desc: string;
    
    @Column()
    createdAt: string;
    
    @Column({default: ""})
    notes: string;
}