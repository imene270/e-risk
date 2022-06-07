const express = require('express');
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { ACTION } from "../entity/ACTION";
import { DS_DECLARATION } from "../entity/DS_DECLARATION";
import { USER } from "../entity/USER";
import helper, { environment } from "../helper";

const router = express.Router();

/**
 * Affiche la liste des DS (non effacées et non clôturées)  selon un type donné
 */
router.post("/getDsListByTypeName", async function (req: Request, res: Response) {
    console.log(req.body);
    let dsTypeName = req.body.dsTypeName;
    console.log(dsTypeName)
    const result = await DS_DECLARATION.createQueryBuilder("T_DS_DECLARATION")
        .leftJoinAndSelect("T_DS_DECLARATION.AREA", "T_AREA")
        .leftJoinAndSelect("T_DS_DECLARATION.USER", "T_USER")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_TYPE", "T_DS_TYPE")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_STATUS", "T_DS_STATUS")
        .where("T_DS_TYPE.TYPE_NAME = '" + dsTypeName + "' and T_DS_STATUS.DS_STATUS_NAME <> 'CLOSED' and T_DS_STATUS.DS_STATUS_NAME <> 'DELETED'")
        .orderBy("CASE WHEN T_DS_STATUS.DS_STATUS_NAME = 'CREATED' THEN 0 WHEN T_DS_STATUS.DS_STATUS_NAME = 'VALID' THEN 1 WHEN T_DS_STATUS.DS_STATUS_NAME = 'PROTECTED' THEN 2 WHEN T_DS_STATUS.DS_STATUS_NAME = 'CORRECTED' THEN 3 ELSE 3 END")
        .getMany();
    res.json(result);
});

/**
 * Calcule le coefficient YTD de déclarations de SD d'un service
 */
router.post("/getYtdCoeffByService", async function (req: Request, res: Response) {
    console.log(req.body);
    let usersByService: any = [];
    let dsByServiceYTD: any = [];
    usersByService = await helper.getWithBody("/gestionds/getUsersByService", req.body);
    dsByServiceYTD = await helper.getWithBody("/gestionds/getDsByServiceYTD", req.body);

    res.json(dsByServiceYTD.length / usersByService.length);

})

/**
 * La liste des utilisateurs par service
 */
router.post("/getUsersByService", async function (req: Request, res: Response) {
    let service = req.body.service;
    const result = await USER.createQueryBuilder("T_USER")
        .leftJoinAndSelect("T_USER.SERVICE", "T_SERVICE")
        .where("T_SERVICE.SERVICE_NAME ='" + service + "'")
        .getMany()
    res.json(result)
})

/**
 * La liste des DS YTD par service
 */
router.post("/getDsByServiceYTD", async function (req: Request, res: Response) {
    let service = req.body.service;
    let dsTypeName = req.body.dsTypeName;
    let currentYear = new Date().getFullYear();
    const result = await DS_DECLARATION.createQueryBuilder("T_DS_DECLARATION")
        .leftJoinAndSelect("T_DS_DECLARATION.USER", "T_USER")
        .leftJoinAndSelect("T_USER.SERVICE", "T_SERVICE")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_TYPE", "T_DS_TYPE")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_STATUS", "T_DS_STATUS")
        .where("T_SERVICE.SERVICE_NAME ='" + service + "' and YEAR(DS_DATE) = " + currentYear + " and T_DS_TYPE.TYPE_NAME = '" + dsTypeName + "' and T_DS_STATUS.DS_STATUS_NAME <> 'DELETED'")
        .getMany()
    res.json(result)
})

/**
 * Affiche les déclarations de la veille (J-1) par service et par type de SD 
 */
router.post("/getDsLastDay", async function (req: Request, res: Response) {
    let dsTypeName = req.body.dsTypeName;
    let lastDayList = []
    let lastDay = defineLastDay();

    const result = await DS_DECLARATION.createQueryBuilder("T_DS_DECLARATION")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_TYPE", "T_DS_TYPE")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_STATUS", "T_DS_STATUS")
        .where("T_DS_TYPE.TYPE_NAME = '" + dsTypeName + "' and T_DS_STATUS.DS_STATUS_NAME <> 'DELETED'")
        .getMany()

    result.forEach(element => {
        if (compareDate(element.DS_DATE, lastDay)) {
            lastDayList.push(element);
        }
    });

    res.json(lastDayList.length);
})


/**
 * Mettre à jour la date prévue pour la clôture de la situation dangeureuse
 * date prévue = max (deadlines des actions de correcction)
 */
router.post("/updateDSEstimationDate", async function (req: Request, res: Response) {
    let dsID = req.body.dsID;
    console.log("id === " + dsID);

    // const result = await ACTION.createQueryBuilder("T_ACTION")
    //     .where("DS_ID = '" + dsID + "' and ACTION_TYPE = 'correction'")
    //     .orderBy("ACTION_DATE_DEADLINE", "DESC")
    //     .getOne()

    // res.json(result["ACTION_DATE_DEADLINE"]);
    const max = await ACTION.createQueryBuilder("T_ACTION")
        .select("MAX(ACTION_DATE_DEADLINE)", "max_dates")
        .where("DS_ID = '" + dsID + "' and ACTION_TYPE = 'correction'")
        .getRawOne()
    // res.json(result["max_dates"]);
    
    const result = await DS_DECLARATION.createQueryBuilder()
            .update(DS_DECLARATION)
            .set({
                DS_ESTIMATION_DATE: max["max_dates"],
            })
            .where("DS_ID = '" + dsID + "'")
            .execute()

    // return res.json("Date prévue modifiée !");        
    return res.send(JSON.parse('{"reponse" : "Date prévue modifiée !"}'));        

})


/**
 * Vérifie si une SD existe dans J-1 ou non
 * @param date 
 * @param lastDay 
 * @returns 
 */
function compareDate(date: Date, lastDay: LastDay): boolean {
    let isInLastDay = false;

    if (date <= lastDay.to && date >= lastDay.from) {
        isInLastDay = true
    }

    return isInLastDay;
}

/**
 * Definition du J-1
 * @returns 
 */
function defineLastDay(): LastDay {
    let lastDay: LastDay = { from: new Date(), to: new Date() };

    let today = new Date();
    console.log(today.getDay());

    if (today.getDay() == 1) {
        lastDay.from = new Date(lastDay.from.setDate(lastDay.from.getDate() - 2))
        lastDay.from.setHours(6);
        lastDay.from.setMinutes(0);
        lastDay.from.setSeconds(0);

        lastDay.to = new Date(lastDay.to.setDate(lastDay.to.getDate() - 1))
        lastDay.to.setHours(5);
        lastDay.to.setMinutes(59);
        lastDay.to.setSeconds(59);
    } else {
        lastDay.from = new Date(lastDay.from.setDate(lastDay.from.getDate() - 1))
        lastDay.from.setHours(6);
        lastDay.from.setMinutes(0);
        lastDay.from.setSeconds(0);

        console.log("J-1 à partir de : " + lastDay.from);

        lastDay.to.setHours(5);
        lastDay.to.setMinutes(59);
        lastDay.to.setSeconds(59);

        console.log("J-1 jusqu'à : " + lastDay.to);

    }
    return lastDay;
}

interface LastDay {
    from: Date,
    to: Date,
}


module.exports = router;