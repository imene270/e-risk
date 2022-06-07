import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { COMMENT_SUGG } from "./COMMENT_SUGG";
import { CONTRIBUTION_TYPE } from "./CONTRIBUTION_TYPE";
import { USER } from "./USER";


@Entity("T_SUGGESTION", { database: "DB_ERISK" })
export class SUGGESTION extends BaseEntity {

    @PrimaryGeneratedColumn()
    SUGG_ID: number;

    @Column()
    PROB_DESC: string;

    @Column()
    PROB_REASON: string;

    @Column()
    PROB_SOLUTION: string;

    @Column()
    NOTE: number;

    @Column()
    ISVALID: boolean;

    @Column()
    ISREALIZED: boolean;

    @OneToMany(type => COMMENT_SUGG, COMMENT_SUGG => COMMENT_SUGG.SUGGESTION)
    COMMENT_SUGG: COMMENT_SUGG[];

    @ManyToOne(type => USER, USER => USER.SUGGESTIONS)
    @JoinColumn({ name: 'USER_ID' })
    USER: USER;


    @ManyToMany(type => CONTRIBUTION_TYPE, CONTRIBUTION_TYPE => CONTRIBUTION_TYPE.SUGGESTIONS)
    CONTRIBUTION_TYPE: CONTRIBUTION_TYPE;

    @Column()
    SUGG_DATE_TIME: Date;
}