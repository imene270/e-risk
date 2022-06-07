import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { DS_DECLARATION } from "./DS_DECLARATION";
import { SUGGESTION } from "./SUGGESTION";  //foreign key from table suggestion 
import { USER } from "./USER";   //foreign key from table user 

@Entity("T_COMMENT_SUGG", { database: "DB_ERISK" })
export class COMMENT_SUGG extends BaseEntity {

    @PrimaryGeneratedColumn()
    ACTION_ID: number;

    @Column()
    VALIDATION_DESC: string;

    @Column()
    REALIZATION_DESC: string;

    @ManyToOne(type => SUGGESTION, SUGGESTION => SUGGESTION.COMMENT_SUGG)
    @JoinColumn({ name: 'SUGG_ID' })
    SUGGESTION: SUGGESTION;

    @ManyToOne(type => USER, USER => USER.COMMENT_SUGG)
    @JoinColumn({ name: 'USER_ID' })
    ACT_PRODUCER: USER;


    @Column()
    ACTSUGG_DATE: Date;

}