import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { DS_DECLARATION } from "./DS_DECLARATION";



@Entity("T_INCIDENT_TYPE", { database: "DB_ERISK" })
export class INCIDENT_TYPE extends BaseEntity {

    @PrimaryGeneratedColumn()
    INCIDENT_ID: number;

    @Column()
    NAME: string;

    @OneToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.MACHINES)
    DS_DECLARATIONS: DS_DECLARATION;

}