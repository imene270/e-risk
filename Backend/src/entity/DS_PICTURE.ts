import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DS_DECLARATION } from "./DS_DECLARATION";


@Entity("T_PICTURE")
export class T_PICTURE extends BaseEntity {
    @PrimaryGeneratedColumn()
    PICTURE_ID: number;
    @Column()
    PICTURE_NAME: string;

    @ManyToOne(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.PICTURE)
    @JoinColumn({ name: 'DS_ID' })
    DS_DECLARATION: DS_DECLARATION;
}