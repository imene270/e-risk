import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DS_DECLARATION } from "./DS_DECLARATION";

@Entity("T_DS_STATUS")
export class T_DS_STATUS extends BaseEntity {
    @PrimaryGeneratedColumn()
    DS_STATUS_ID: number;

    @Column()
    DS_STATUS_NAME: string;

    @Column({ nullable: true })
    DS_STATUS_VALUE: number;

    @OneToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.DS_STATUS)
    DS: DS_DECLARATION[]
}