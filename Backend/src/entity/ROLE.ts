import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { USER } from "./USER";

@Entity("T_ROLE", { database: "DB_ERISK" })
export class ROLE extends BaseEntity {

    @PrimaryGeneratedColumn()
    ROLE_ID: number;

    @Column()
    ROLE_NAME: string;

    @Column({ nullable: true })
    ROLE_DESC: string;

    @ManyToMany(type => USER, USER => USER.ROLE)
    @JoinTable({ name: 'TJ_USER_ROLE' })
    USER: USER[];

}