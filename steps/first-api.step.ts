import { ApiRouteConfig } from "motia";

export const config : ApiRouteConfig= {
    name: "titleyt",
    type : "api",
    path : "/titleyt",
    method : "POST",
    emits : ["youtube.title"],

};

interface submitrequest{
    channel: string;
    email : string;
}
export const handler =async (req:any ,{emit ,logger,state}:any )=>{
    try {
        logger.info('recived submission request', {body:req.body} ) 
        const {channel ,email } = req.body as submitrequest;

        if(!channel || !email){
            return{
                status:400,
                body:{
                error : "missing required fields"
            },
            };
        }

    } catch (error:any) {
        logger.error('error in submissions{error:error.message}')
        return{
            status:500,
            body:{
                error : "internal server error"
            }
            
        }

    }
}