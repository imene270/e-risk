import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { DIVISION } from "./DIVISION";
import { AREA } from "./DS_AREA";
import { DS_DECLARATION } from "./DS_DECLARATION";
import { MACHINE_TYPE } from "./MACHINE_TYPE";



@Entity("T_ILOT")
export class ILOT extends BaseEntity {

    @PrimaryGeneratedColumn()
    ILOT_ID: number;

    @Column()
    ILOT_NAME: string;

    @Column({ nullable: true })
    ILOT_STATUT: boolean;

    @OneToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.ILOT)
    DS_DECLARATIONS: DS_DECLARATION;

    @ManyToOne(type => AREA, AREA => AREA.ILOT)
    @JoinColumn({ name: 'AREA_ID' })
    AREA: AREA[];

    @ManyToMany(type => MACHINE_TYPE, MACHINE_TYPE => MACHINE_TYPE.ILOT)
    @JoinTable({ name: 'TJ_ILOT_TYPEMACHINE' })
    MACHINE_TYPE: MACHINE_TYPE[];


    MACHINE_ID;
}