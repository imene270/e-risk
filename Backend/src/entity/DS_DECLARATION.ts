import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { ACTION } from "./ACTION";
import { AREA } from "./DS_AREA";
import { DS_CAUSE } from "./DS_CAUSE";
import { INCIDENT_TYPE } from "./DS_INCIDENT_TYPE";
import { T_PICTURE } from "./DS_PICTURE";
import { DS_RULES_QNN } from "./DS_RULES_QNN";
import { T_DS_STATUS } from "./DS_STATUS";
import { DS_TYPE } from "./DS_TYPE";
import { ILOT } from "./ILOT";
import { MACHINE_TYPE } from "./MACHINE_TYPE";
import { USER } from "./USER";

@Entity("T_DS_DECLARATION", { database: "DB_ERISK" })
export class DS_DECLARATION extends BaseEntity {

    @PrimaryGeneratedColumn()
    DS_ID: number;

    @Column({ type: "nvarchar", length: "MAX" })
    DS_DESC: string;

    @Column()
    STOP_CARD: boolean;

    @Column({ nullable: true })
    NOTE: number;

    /**
     * DS_STATUT null par défaut , 0 si la situation dangereuse est non valide et 1 si valide
   
     @Column({ nullable: true })
     DS_STATUT: boolean;
    */

    @ManyToOne(type => T_DS_STATUS, T_DS_STATUS => T_DS_STATUS.DS)
    @JoinColumn({ name: 'DS_STATUS' })
    DS_STATUS: boolean;

    @Column({ nullable: true })
    MACHINE_NUMBER: string;

    @ManyToOne(type => DS_TYPE, DS_TYPE => DS_TYPE.DS_DECLARATION)
    @JoinColumn({ name: 'TYPE_ID' })
    DS_TYPE: DS_TYPE[];

    @ManyToOne(type => USER, USER => USER.DS_DECLARATION)
    @JoinColumn({ name: 'USER_ID' })
    USER: USER;

    @ManyToOne(type => AREA, AREA => AREA.DS_DECLARATIONS)
    @JoinColumn({ name: 'AREA_ID' })
    AREA: AREA;

    @ManyToOne(type => ILOT, ILOT => ILOT.DS_DECLARATIONS)
    @JoinColumn({ name: 'ILOT_ID' })
    ILOT: ILOT;

    @ManyToOne(type => MACHINE_TYPE, MACHINE_TYPE => MACHINE_TYPE.DS_DECLARATIONS, { nullable: true })
    @JoinColumn({ name: 'MACHINE_TYPE_ID' })
    MACHINES: MACHINE_TYPE;

    @ManyToOne(type => INCIDENT_TYPE, INCIDENT_TYPE => INCIDENT_TYPE.DS_DECLARATIONS)
    @JoinColumn({ name: 'INCIDENT_ID' })
    INCIDENT: INCIDENT_TYPE;

    @OneToMany(type => ACTION, ACTION => ACTION.DS)
    ACTION: ACTION[];



    @OneToMany(type => T_PICTURE, T_PICTURE => T_PICTURE.DS_DECLARATION)
    PICTURE: T_PICTURE[];


    @ManyToMany(type => DS_CAUSE, DS_CAUSE => DS_CAUSE.DS)
    CAUSES: DS_CAUSE[];

    @ManyToMany(type => DS_RULES_QNN, DS_RULES_QNN => DS_RULES_QNN.DS)
    DS_RULES: DS_RULES_QNN[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    DS_DATE: Date;

    @Column({ nullable: true })
    DS_ESTIMATION_DATE: Date;

    @Column({ nullable: true })
    DS_END_DATE: Date;
}
