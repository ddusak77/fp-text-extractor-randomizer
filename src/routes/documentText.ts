import express, {Request, Response} from "express";
import firebaseMethods from "../database/firebase";
import randomstring from "randomstring";
import { IDictionary, saveProjectPayload } from "../interfaces/interfaces";
const router = express.Router()

router.use(function timeLog (req: Request, res: Response, next) {
    //middleware, enabling CORS for testing purposes
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
  })

router.route('/documentText')
    .post(async function(req: Request, res: Response) {
        //not liking this here, should be in a separate dir with project database methods
        //move there if time
        const collectionName = 'projects';
        const project:saveProjectPayload = req.body.project;
        const fbm = new firebaseMethods();
        await fbm.exists(collectionName, project.name).then(async exists => {
            if(exists) {
                await fbm.update(collectionName, project.name, 'text', project.text)
                return res.send({'status':'success', 'message':'project updated'})
            } else {
                await fbm.insert(collectionName, project.name, project)
                return res.send({'status':'success', 'message':'project created'})
            }
        }).catch(error => {
            console.error(error);
            res.statusCode = 400;
            return res.send({'status':'error','message':error});
        })
    })
    .get(async function(req: Request, res: Response) {
        //same comment as above
        const collectionName = 'projects';
        const {name} = req.query;

        if(typeof name !== 'string') {
            res.statusCode = 400;
            return res.send({'status':'error', 'message': 'invalid parameter [name], must be string'});
        }

        const fbm = new firebaseMethods();

        await fbm.get(collectionName, name).then(data => {
            if(!data) {
                res.statusCode = 400;
                return res.send({
                    'status':'error', 
                    'message':'project not found, try sending the text to the server first'
                });
            }

            const replacedText:IDictionary<string> = {};
            data.text.forEach((element: string) => {
                replacedText[element] = randomstring.generate(element.length)
            });
            const output = {
                name: data.name,
                text: replacedText
            }
            return res.send({'status':'success', 'message':'randomized text for project: '+ name, output: output});
        }).catch(error => {
            console.error(error);
            res.statusCode = 400;
            return res.send({'status':'error', 'message':error});
        });
        
    })
    

export default router