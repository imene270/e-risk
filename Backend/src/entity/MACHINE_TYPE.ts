import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { DS_DECLARATION } from "./DS_DECLARATION";
import { ILOT } from "./ILOT";

@Entity("T_MACHINE_TYPE", { database: "DB_ERISK" })
export class MACHINE_TYPE extends BaseEntity {

    @PrimaryGeneratedColumn()
    MACHINE_TYPE_ID: number;

    @Column()
    MACHINE_TYPE_NAME: string;

    @Column()
    MACHINE_TYPE_STATUT: boolean;

    @OneToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.MACHINES)
    DS_DECLARATIONS: DS_DECLARATION;

    @ManyToMany(type => ILOT, ILOT => ILOT.MACHINE_TYPE)
    ILOT: ILOT[];

}