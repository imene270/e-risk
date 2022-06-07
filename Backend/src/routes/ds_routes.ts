const express = require('express');
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { DS_CAUSE } from "../entity/DS_CAUSE";
import { DS_DECLARATION } from "../entity/DS_DECLARATION";
import { INCIDENT_TYPE } from "../entity/DS_INCIDENT_TYPE";
import { T_PICTURE } from "../entity/DS_PICTURE";
import { DS_RULES_QNN } from "../entity/DS_RULES_QNN";
import { DS_TYPE } from "../entity/DS_TYPE";
import helper, { environment } from "../helper";


const router = express.Router();

// afficher les types DS (1 ere étape pour faie une DS)
router.get("/gettypesDS", async function (req: Request, res: Response) {
    const typesDS = await DS_TYPE.find();
    res.json(typesDS);
});

// afficher les incidents selon type DS choisi  (2 ème étape pour faie une DS)
router.get("/getListIncidentDS", async function (req: Request, res: Response) {
    const listincident = await INCIDENT_TYPE.find();
    res.json(listincident);
});

// afficher les causes selon le type DS choisi
router.get("/getcauses/:idtypeds", async function (req: Request, res: Response) {
    const listcauses = await DS_CAUSE.find({ where: { DS_TYPE: req.params.idtypeds, CAUSE_STATUT: 1 } });
    res.json(listcauses);
})

// afficher les régles / QNN si le type est sécurité : regles d'or et 8 QNN pour la qualité
router.get("/getrules/:idtypeds", async function (req: Request, res: Response) {
    const listrules = await DS_RULES_QNN.find({ where: { DS_TYPE: req.params.idtypeds, RULES_STATUT: 1 } });
    res.json(listrules);
})

// insertion des regles d'or / QNN d'une d'une DS dans la table jointure TJ_DS_RULES
router.post("/DSrulesinsert/:dsid/:ruleid", async function (req: Request, res: Response) {
    const rulesds = [{ tDSDECLARATIONDSID: (Number)(req.params.dsid), tRULESQNNRULESID: (Number)(req.params.ruleid) }];
    const results = await getConnection().createQueryBuilder()
        .insert()
        .into("TJ_DS_RULES")
        .values(rulesds)
        .execute();

    res.json(results);
});

// insertion des causes DS dans la table jointure TJ_DS_CAUSES
router.post("/DScausesinsert/:dsid/:causeid", async function (req: Request, res: Response) {
    const causesds = [{ tDSDECLARATIONDSID: (Number)(req.params.dsid), tDSCAUSECAUSEID: (Number)(req.params.causeid) }];
    const results = await getConnection().createQueryBuilder()
        .insert()
        .into("TJ_DS_CAUSES")
        .values(causesds)
        .execute().then((data) => {
            res.send(data)
        });

    res.json(results);
});


// insert DS : DS dans la table T_DS_DECLARATION
router.post("/DSinsert", async function (req: Request, res: Response) {
    const ds = await DS_DECLARATION.create(req.body);
    const results = await DS_DECLARATION.save(ds);
    res.json(results);
});

// insert picture : dans la table T_PICTURE
router.post("/DSinsertPictures/:ids", async function (req: Request, res: Response) {
    req.body.DS_DECLARATION = req.params.ids;
    const picture = await T_PICTURE.create(req.body);
    const results = await T_PICTURE.save(picture);
    res.json(results);
});
/**
 * get all data from front
 * insert DS
 * getlist causes
 * getlist rules
 * getlist images
 */
router.post('/', async function getData(req: Request, res: Response) {
    try {
        console.log(req.body);
        /**
         * 1 .get listcauses et listrules from frontend
         * 2 .check if autrecause != null if true then push autrecause in listcause
         * 
         */
        let listcauses = req.body.listcauses;
        let listrules = req.body.listrules;
        let listphotos = req.body.listpictures;
        // insertion des causes : autrecause de DS
        /**
         * if autre cause existe , 1. insert cause into T_CAUSE with statut 0 and push it to listcauses
         */
        let AutreCause = req.body.AutreCause;
        if (AutreCause != null) {
            let autrecause = await getConnection()
                .createQueryBuilder()
                .insert()
                .into("T_DS_CAUSE")
                .values([
                    {
                        CAUSE_NAME: req.body.AutreCause, CAUSE_STATUT: 0, DS_TYPE: req.body.TYPE_ID,
                    }
                ])
                .execute();
            /**           
            * autrecause.raw[0].CAUSE_ID get id cause inséré
            */
            listcauses.push({ CAUSE_ID: autrecause.raw[0].CAUSE_ID });

        }
        /**
         * 3. insert DS and get idDS of inserted row
         * 
         */
        let idds = await getConnection()
            .createQueryBuilder()
            .insert()
            .into("T_DS_DECLARATION")
            .values([
                {
                    DS_DESC: req.body.DS_DESC, DS_TYPE: req.body.TYPE_ID, AREA: req.body.AREA_ID, INCIDENT: req.body.INCIDENT_ID, MACHINES: req.body.MACHINE_TYPE_ID,
                    USER: req.body.USER_ID, STOP_CARD: req.body.STOP_CARD, MACHINE_NUMBER: req.body.MACHINE_NUMBER, ILOT: req.body.ILOT_ID, DS_STATUS: 1, NOTE: 0
                }
            ])
            .execute();
        let ids = idds.raw[0].DS_ID;
        console.log(idds.raw[0].DS_ID);
        /**
        * 4 .insert into TJ causes_DS values of listcause with idds
        */
        for (let i = 0; i < listcauses.length; i++) {
            let cause = await helper.insert('/DS/DScausesinsert/' + ids + '/' + listcauses[i].CAUSE_ID, {});
        };
        /*
         * 5 .insert into TJ RULES_DS values of listrules with idds
         * 
         */
        for (let i = 0; i < listrules.length; i++) {
            let rule = await helper.insert('/DS/DSrulesinsert/' + ids + '/' + listrules[i].RULES_ID, {});
        };
        /**
         * 6. insertion des images dans la table T_PICTURE
         */
        for (let i = 0; i < listphotos.length; i++) {
            let picture = await helper.insert('/DS/DSinsertPictures/' + ids, listphotos[i]);
        };
        res.json("DS inserted successfully");

    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
    }

});

/**
 * modifier la cause autre d'une DS
 */
router.put("/EditAutreCauseDS/:idcause", async function (req: Request, res: Response) {
    const autre = await DS_CAUSE.findOne(req.params.idcause);
    DS_CAUSE.merge(autre, req.body);
    const results = await DS_CAUSE.save(autre);
    return res.send(results);
});
// insertion d'une cause autre d'une DS
router.post("/AutreCauseinsert/:idds", async function (req: Request, res: Response) {
    const autre = await DS_CAUSE.create(req.body);
    const results = await DS_CAUSE.save(autre);
    let cause = await helper.insert('/DS/DScausesinsert/' + req.params.idds + '/' + results["CAUSE_ID"], {});
    return res.send(results);

});
/**
 * supprimer la cause d'une ds (jointure ds cause)
 */
router.delete("/deletedsCause/:idcause/:idds", async function (req: Request, res: Response) {
    const results = await getConnection().createQueryBuilder()
        .delete()
        .from("TJ_DS_CAUSES")
        .where("tDSCAUSECAUSEID = " + req.params.idcause + " and tDSDECLARATIONDSID = " + req.params.idds)
        .execute();

    res.json(results);
})

/**
 * supprimer la régle d'une ds (jointure ds rule)
 */
router.delete("/deletedsRule/:idrule/:idds", async function (req: Request, res: Response) {

    const results = await getConnection().createQueryBuilder()
        .delete()
        .from("TJ_DS_RULES")
        .where("tRULESQNNRULESID = " + req.params.idrule + " and tDSDECLARATIONDSID = " + req.params.idds)
        .execute();
    console.log("tRULESQNNRULESID = " + req.params.idrule + " and tDSDECLARATIONDSID = " + req.params.idds)
    res.json(results);
})
module.exports = router;