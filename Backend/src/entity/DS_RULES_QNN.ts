import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DS_DECLARATION } from "./DS_DECLARATION";
import { DS_TYPE } from "./DS_TYPE";


@Entity("T_RULES_QNN", { database: "DB_ERISK" })
export class DS_RULES_QNN extends BaseEntity {
    @PrimaryGeneratedColumn()
    RULES_ID: number;

    @Column()
    RULES_DESC: string;

    @Column({ nullable: true })
    RULES_STATUT: boolean;

    @ManyToOne(type => DS_TYPE, DS_TYPE => DS_TYPE.DS_RULES)
    @JoinColumn({ name: 'DS_TYPE_ID' })
    DS_TYPE: DS_TYPE;

    @ManyToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.DS_RULES)
    @JoinTable({ name: 'TJ_DS_RULES' })
    DS: DS_DECLARATION[];
}