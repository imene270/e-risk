import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ACTIVITY } from "./ACTIVITY";
import { AREA } from "./DS_AREA";
import { SERVICE } from "./SERVICE";



@Entity("T_DIVISION", { database: "DB_ERISK" })
export class DIVISION extends BaseEntity {

    @PrimaryGeneratedColumn()
    DIV_ID: number;

    @Column()
    DIV_NAME: string;

    @ManyToOne(type => ACTIVITY, ACTIVITY => ACTIVITY.DIV_ID)
    @JoinColumn({ name: 'ACT_ID' })
    ACT_ID: ACTIVITY;

    @OneToMany(type => AREA, AREA => AREA.DIVISION)
    AREA: AREA[];

    @OneToMany(type => SERVICE, SERVICE => SERVICE.DIVISION)
    SERVICE: SERVICE[];


    /*@OneToMany(type => ILOT, ILOT => ILOT.DIVISION)
    ILOT: ILOT[];*/
}