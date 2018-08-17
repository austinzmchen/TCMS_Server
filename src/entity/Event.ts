
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Course } from "./Course";
import { Image } from "./Image";

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    title: string;

    @Column("text")
    desc: string;
    
    @Column()
    createdAt: string;
    
    @Column({default: ""})
    notes: string;

    @Column("simple-json")
    images: Image[];
}