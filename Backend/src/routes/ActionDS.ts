const express = require('express');
import { Request, Response } from "express";
import { ACTION } from "../entity/ACTION";
import { DS_DECLARATION } from "../entity/DS_DECLARATION";
import { T_DS_STATUS } from "../entity/DS_STATUS";
import helper, { environment } from "../helper";
//var db = mongoose.connection;
import connectDB from "../../src/ormconfig";
const stream = require('stream');
const fs = require("fs")

const router = express.Router();

// afficher la description d'une DS
router.get("/getdetailsDS/:ds", async function (req: Request, res: Response) {
    const result = await DS_DECLARATION.createQueryBuilder("T_DS_DECLARATION")
        .leftJoinAndSelect("T_DS_DECLARATION.CAUSES", "T_DS_CAUSE")
        .leftJoinAndSelect("T_DS_DECLARATION.PICTURE", "T_PICTURE")
        .leftJoinAndSelect("T_DS_DECLARATION.AREA", "T_AREA")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_RULES", "T_RULES_QNN")
        .leftJoinAndSelect("T_DS_DECLARATION.INCIDENT", "T_INCIDENT")
        .leftJoinAndSelect("T_DS_DECLARATION.USER", "T_USER")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_TYPE", "T_DS_TYPE")
        .leftJoinAndSelect("T_DS_DECLARATION.ILOT", "T_ILOT")
        .leftJoinAndSelect("T_DS_DECLARATION.MACHINES", "MACHINE_TYPE")
        .leftJoinAndSelect("T_DS_DECLARATION.DS_STATUS", "T_DS_STATUS")
        .where("T_DS_DECLARATION.DS_ID = " + req.params.ds)
        .getMany();
    res.send(result);
});

/**
 * afficher les actions selon type (correction / protection) et id DS : situation dangereuse et statut (=1 par defaut)
 */
router.post("/getActions/:idds", async function (req: Request, res: Response) {
    console.log(req.body);
    console.log(req.params.idds);
    const actions = await ACTION.find({ where: { DS: req.params.idds, ACTION_TYPE: req.body.ACTION_TYPE, DS_STATUS: 1 } });
    res.send({ actions: actions, date: new Date() });
})

/**
 * insertion des actions 
 */
router.post("/Actioninsert", async function (req: Request, res: Response) {

    if (req.body.ACTION_DATE_DEADLINE == null || req.body.ACTION_DATE_DEADLINE == undefined) {
        req.body.ACTION_DATE_DEADLINE = new Date();
        req.body.ACTION_DATE_CLOSED = new Date();
    }

    const action = await ACTION.create(req.body);

    console.log("ACT === ", action)

    if (req.body.ACTION_TYPE == 'protection') {
        action['ISDONE'] = true;
    }

    const results = await ACTION.save(action);
    console.log(results);
  
        const data = (JSON.parse( JSON.stringify(results )));
        console.log('data imen: ' + data)
        fs.writeFile("C:/Users/pc/OneDrive/trigger/e-risk/E-RISK"+data.ACTION_ID+".json", '{ "operation type" :"insert", "data" :' +JSON.stringify(results) +"}",error => {
        if(error) {
            throw error;
        }
        //console.log("strignify : " + JSON.stringify(results));
    });

    return res.send(results);

});


/**
 * Modifier les actions
 */
router.put("/Editaction/:id", async function (req: Request, res: Response) {
    const action = await ACTION.findOne(req.params.id);
    ACTION.merge(action, req.body);
    const results = await ACTION.save(action);
    const data = JSON.parse(JSON.stringify(results));
    fs.writeFile("C:/Users/pc/OneDrive/trigger/e-risk/E-RISK"+data.ACTION_ID+".json", '{ "operation type" :"modifie", "data" :' +JSON.stringify(results) +"}",error => {
        if(error) {
            throw error;
        }
     //   console.log("strignify : " + JSON.stringify(results));
    });
    return res.send(results);
});
/**
 * Supprimer une action
 */
router.delete("/deleteAction/:id", async function (req: Request, res: Response) {
   const dataa= (req.params.id)
    const results = await ACTION.delete(req.params.id);

    console.log("suprrrimer id 2  " + dataa) 
    fs.writeFile("C:/Users/pc/OneDrive/trigger/e-risk/E-RISK"+dataa+".json", '{ "operation type" :"supprime", "data" :' +JSON.stringify(dataa) +"}",error => {

        if(error) {
            throw error;
        }
     //   console.log("strignify : " + JSON.stringify(results));
    });

    return res.send(results);
})
/**
 * Cloturer une action
 */
router.put("/Doneaction/:id", async function (req: Request, res: Response) {
    const action = await ACTION.findOne(req.params.id);
    action.ACTION_DATE_CLOSED = new Date();
    action.ISDONE = true;
    ACTION.merge(action, req.body);
    const results = await ACTION.save(action);
    res.send(JSON.stringify("ok"));
});


/**
 * set une note / modifier description
 */
router.put("/EditDS/:id", async function (req: Request, res: Response) {
    const ds = await DS_DECLARATION.findOne(req.params.id);
    DS_DECLARATION.merge(ds, req.body);
    const results = await DS_DECLARATION.save(ds);
    return res.send(results);
});
/**
 * Valider une situation dangereuse
 */
router.put("/ValidDS/:id", async function (req: Request, res: Response) {
    const statut = await T_DS_STATUS.find({ where: { DS_STATUS_NAME: "VALID" } });
    req.body.DS_STATUS = statut[0].DS_STATUS_ID;
    let valid = await helper.update('/actionds/EditDS/' + req.params.id, req.body);
    return res.send(JSON.stringify(statut[0]));
});
/**
 * Supprimer une situation dangereuse
 */
router.put("/DeleteDS/:id", async function (req: Request, res: Response) {
    const statut = await T_DS_STATUS.find({ where: { DS_STATUS_NAME: "DELETED" } });
    req.body.DS_STATUS = statut[0].DS_STATUS_ID;
    console.log(req.body.DS_STATUS);
    let valid = await helper.update('/actionds/EditDS/' + req.params.id, req.body);
    return res.send(JSON.stringify("la situation a été supprimé"));
});
/**
 * modifier la statut du ds : protected / corrected
 */
router.put("/DSIsprotected/:id", async function (req: Request, res: Response) {
    console.log(req.body);
    let st = (req.body.typeaction == "protection") ? "protected" : ((req.body.typeaction == "correction") ? "corrected" : "closed");
    const statut = await T_DS_STATUS.find({ where: { DS_STATUS_NAME: st } });
    req.body.DS_STATUS = statut[0].DS_STATUS_ID;
    console.log(req.body.DS_STATUS);
    console.log("ds is protected ?");
    let valid = await helper.update('/actionds/EditDS/' + req.params.id, req.body);
    console.log("ok");
    res.send(statut[0]);

});



// trigger essai 1 

router.get("/triggerr", async function (req: Request, res: Response) {
    var MySQLEvents = require('mysql-events');
    var dsn = {
      host:'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS

    };
    var mysqlEventWatcher = MySQLEvents(dsn);
    console.log(mysqlEventWatcher);
    var watcher =mysqlEventWatcher.add(
      'DB_ERISK.T_ACTION.',
      function (oldRow, newRow, event) {
         //row inserted
        if (oldRow === null) {
          //insert code goes here
          console.log('heloo insert ' + oldRow)
        }
     
         //row deleted
        if (newRow === null) {
          //delete code goes here
          console.log('heloo delete' + newRow)

        }
     
         //row updated
        if (oldRow !== null && newRow !== null) {
          //update code goes here
          console.log('heloo update' + newRow + oldRow)

        }
     
        //detailed event information
        console.log(event)
      }
    );
});















/**
 * A Helper Function to Close the Change Stream
 */

/*closeChangeStream(timeInMs = 60000, changeStream) {
   return new Promise((resolve) => {
       setTimeout(() => {
           console.log("Closing the change stream");
           changeStream.close();
           resolve();
       }, timeInMs)
   })
};
*/
// router.get("/trigger/Inserttt", async function (req: Request, res: Response) {
//     const pipeline = [
//         {
//             '$match': {
//                 'operationType': 'insert',
//             },
//         }
//     ];


    
// const mysql = require('mysql'); 
// const con = mysql.createConnection({ host: "localhost", user: process.env.DB_USER, password:process.env.DB_PASS, database : process.env.DB_NAME }); 
// con.connect(function(err) { if (err) throw err;
//      console.log("Connecté à la base de données MySQL!");
//       con.query("select * from T_ACTION", 
//       function (err, result) { 
          
        
        
//         if (err) throw err;
//          console.log(result);
//          res.send(result);

//         });

//     });

//     //             fs.writeFile("C:/Users/pc/OneDrive/trigger/ACT" + data.fullDocument.refAction + ".json", JSON.stringify(doc), err => {// refAction chnagement
//     //                 if (err) throw err;
//     //                 console.log('File successfully written to disk :) ');
//     //             })

//     //         }
//     //     })
//     // );

// });

//afficher les types DS (1 ere étape pour faie une DS) erreur watch
// function closeChangeStream(timeInMs = 60000, changeStream) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             console.log("Closing the change stream");
//             changeStream.close();
//             resolve();
//         }, timeInMs)
//     })
// };
 
/* router.get("/getActionss", async function (req: Request, res: Response) {
    const pipeline = [
                {
                    '$match': {
                        'operationType': 'insert',
                    },
                }
            ];

    const actions = await ACTION.find();
    const changeStream = actions.watch(pipeline);
    changeStream.stream().pipe(
        new stream.Writable({
            objectMode: true,
            write: function (doc, _, cb) {

                const data = JSON.parse(JSON.stringify(doc));
                cb();

                fs.writeFile("C:/Users/pc/OneDrive/trigger/ACT" + data.fullDocument.refAction + ".json", JSON.stringify(doc), err => {// refAction chnagement
                    if (err) throw err;
                    console.log('File successfully written to disk :) ');
                })

            }
        })
    );



    // res.json(actions);
    // console.log('my actions : ' + JSON.stringify(actions));

}); */





module.exports = router;