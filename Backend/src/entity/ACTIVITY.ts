import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { DIVISION } from "./DIVISION"; // foreign key from table division 


@Entity("T_ACTIVITY", { database: "DB_ERISK" })
export class ACTIVITY extends BaseEntity {

    @PrimaryGeneratedColumn()
    ACT_ID: number;

    @Column()
    ACT_NAME: string;

    @OneToMany(type => DIVISION, DIVISION => DIVISION.ACT_ID)
    DIV_ID: DIVISION[];
}