import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { DIVISION } from "./DIVISION";
import { USER } from "./USER";

@Entity("T_SERVICE", { database: "DB_ERISK" })
export class SERVICE extends BaseEntity {

    @PrimaryGeneratedColumn()
    SERVICE_ID: number;

    @Column()
    SERVICE_NAME: string;

    @OneToMany(type => USER, USER => USER.SERVICE)
    USER: USER[];

    @ManyToOne(type => DIVISION, DIVISION => DIVISION.SERVICE)
    @JoinColumn({ name: 'DIV_ID' })
    DIVISION: DIVISION;

}