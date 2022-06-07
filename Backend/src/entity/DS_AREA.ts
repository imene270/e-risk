import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn, JoinTable, ManyToMany } from "typeorm";
import { DIVISION } from "./DIVISION";
import { DS_DECLARATION } from "./DS_DECLARATION";
import { ILOT } from "./ILOT";
import { SAFETYCORNER } from "./SAFETY_CORNER";
import { USER } from "./USER";

@Entity("T_AREA", { database: "DB_ERISK" })
export class AREA extends BaseEntity {

    @PrimaryGeneratedColumn()
    AREA_ID: number;

    @Column()
    AREA_NAME: string;

    @Column()
    AREA_STATUT: boolean;

    @OneToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.AREA)
    DS_DECLARATIONS: DS_DECLARATION;


    @OneToMany(type => ILOT, ILOT => ILOT.AREA)
    ILOT: ILOT[];

    @ManyToOne(type => DIVISION, DIVISION => DIVISION.AREA)
    @JoinColumn({ name: 'DIV_ID' })
    DIVISION: DIVISION;

    @ManyToOne(type => SAFETYCORNER, SAFETYCORNER => SAFETYCORNER.AREA)
    @JoinColumn({ name: 'SAFETYCORNER_ID' })
    SAFETYCORNER: SAFETYCORNER;

    @ManyToMany(type => USER, USER => USER.AREA)
    @JoinTable({ name: 'TJ_USER_AREA' })
    USER: USER[];
}