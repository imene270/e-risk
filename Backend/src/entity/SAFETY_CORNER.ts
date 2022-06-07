import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { AREA } from "./DS_AREA";


@Entity("T_SAFETYCORNER")
export class SAFETYCORNER extends BaseEntity {

    @PrimaryGeneratedColumn()
    SAFETYCORNER_ID: number;

    @Column()
    SAFETYCORNER_NAME: string;

    @Column()
    SAFETYCORNER_STATUT: boolean;

    @OneToMany(type => AREA, AREA => AREA.SAFETYCORNER)
    AREA: AREA[];


    ZONE_ID;
    listzonee;
    AREA_ID;
}