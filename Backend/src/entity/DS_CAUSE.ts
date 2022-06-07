import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm";
import { DS_DECLARATION } from "./DS_DECLARATION";
import { DS_TYPE } from "./DS_TYPE";

@Entity("T_DS_CAUSE", { database: "DB_ERISK" })
export class DS_CAUSE extends BaseEntity {

    @PrimaryGeneratedColumn()
    CAUSE_ID: number;

    @Column()
    CAUSE_NAME: string;

    @Column()
    CAUSE_STATUT: boolean; // 0 if its created by user else 1

    @ManyToOne(type => DS_TYPE, DS_TYPE => DS_TYPE.DS_CAUSES)
    @JoinColumn({name: 'TYPE_ID'})
    DS_TYPE: DS_TYPE;

    @ManyToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.CAUSES) // with many to many,we use JoinTable ==> will create a separate table that will have two columns 
    @JoinTable({ name: 'TJ_DS_CAUSES' })
    DS: DS_DECLARATION[];

}