import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { SUGGESTION } from "./SUGGESTION";

@Entity("T_CONTRIBUTION_TYPE", { database: "DB_ERISK" })
export class CONTRIBUTION_TYPE extends BaseEntity {

    @PrimaryGeneratedColumn()
    CONT_ID: number;

    @Column()
    NAME: string;
    
    @ManyToMany(type => SUGGESTION, SUGGESTION => SUGGESTION.CONTRIBUTION_TYPE)
    @JoinTable({ name: 'TJ_SUGG_TYPE' })
    SUGGESTIONS: SUGGESTION[];
}