import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { DS_CAUSE } from "./DS_CAUSE";
import { DS_DECLARATION } from "./DS_DECLARATION";
import { INCIDENT_TYPE } from "./DS_INCIDENT_TYPE";
import { DS_RULES_QNN } from "./DS_RULES_QNN";

@Entity("T_DS_TYPE", { database: "DB_ERISK" })
export class DS_TYPE extends BaseEntity {

    @PrimaryGeneratedColumn()
    TYPE_ID: number;

    @Column()
    TYPE_NAME: string;

    @OneToMany(type => DS_CAUSE, DS_CAUSE => DS_CAUSE.DS_TYPE)
    DS_CAUSES: DS_CAUSE[];


    @OneToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.DS_TYPE)
    DS_DECLARATION: DS_DECLARATION;

    @OneToMany(type => DS_RULES_QNN, DS_RULES_QNN => DS_RULES_QNN.DS_TYPE)
    DS_RULES: DS_RULES_QNN[];
}