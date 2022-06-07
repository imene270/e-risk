import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { COMMENT_SUGG } from "./COMMENT_SUGG";
import { DIVISION } from "./DIVISION";
import { AREA } from "./DS_AREA";
import { DS_DECLARATION } from "./DS_DECLARATION";
import { ROLE } from "./ROLE";
import { SERVICE } from "./SERVICE";
import { SUGGESTION } from "./SUGGESTION";


@Entity("T_USER")
export class USER extends BaseEntity {

    @PrimaryGeneratedColumn()
    USER_ID: number;

    @Column()
    MATRICULE: string;

    @Column()
    NAME: string;

    @Column({ nullable: true })
    MOx: string;

    @Column()
    USER_STATUT: boolean;

    @OneToMany(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.USER)
    DS_DECLARATION: DS_DECLARATION[];

    @OneToMany(type => SUGGESTION, SUGGESTION => SUGGESTION.USER)
    SUGGESTIONS: SUGGESTION[];

    @OneToMany(type => COMMENT_SUGG, COMMENT_SUGG => COMMENT_SUGG.ACT_PRODUCER)
    COMMENT_SUGG: COMMENT_SUGG[];

    @ManyToOne(type => SERVICE, SERVICE => SERVICE.USER)
    @JoinColumn({ name: 'SERVICE_ID' })
    SERVICE: SERVICE;

    @ManyToMany(type => ROLE, ROLE => ROLE.USER)
    ROLE: ROLE[];


    @ManyToMany(type => AREA, AREA=> AREA.USER)
    AREA: AREA[];

    ROLEID;
    AREAID;
    respzone;
    constructor(USER_ID) {
        super();
        this.USER_ID = USER_ID;
    }
}
