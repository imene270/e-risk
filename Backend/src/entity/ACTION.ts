import { Entity, //Entity is your model decorated
     PrimaryGeneratedColumn, // id column will be auto-generated
      Column, //To add database columns 
       BaseEntity, //Base abstract entity for all entities, used in ActiveRecord patterns.
       ManyToOne, //  to create a one-to-one relationship between two entities.
        JoinColumn  //Where you put @JoinColumn decorator that side will be called "owner side of the relationship"
    } from "typeorm";


import { DS_DECLARATION } from "./DS_DECLARATION"; // foreign key from table declaration 

@Entity("T_ACTION") //  a database table will be created for the Photo entity 
export class ACTION extends BaseEntity {

    @PrimaryGeneratedColumn() // Primary Key 
    ACTION_ID: number;

    // @Column()
    //  ACTION_TITLE: string;

    @Column({ type: "nvarchar", length: "MAX" }) //description de l'action
    ACTION_DESC: string;

    @Column()
    REALISATEUR: string; // FullName de celui qui va faire l'action

    @Column()
    ACTION_TYPE: string; // type d'action : protection ou correction

    @Column({ default: () => '1' })
    DS_STATUS: boolean; // 0 if deleted

    @Column({ default: () => '0' })
    ISDONE: boolean;  // 1 if closed ; 0 by default

    @ManyToOne(type => DS_DECLARATION, DS_DECLARATION => DS_DECLARATION.ACTION) // foreign key with table declaration 
    @JoinColumn({ name: 'DS_ID' })
    DS: DS_DECLARATION;

    @Column()
    ACTION_DATE_DEADLINE: Date; 

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) // date creation = date systeme 
    ACTION_DATE_CREATED: Date;

    @Column({ nullable: true }) // date fin d'action 
    ACTION_DATE_CLOSED: Date;
}