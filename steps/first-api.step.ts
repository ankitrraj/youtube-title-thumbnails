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

        //validate 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return{
                status:400,
                body:{
                error : "invalid email address"
            },
            };
        }

        const jobId =`job_${Date.now()}_${Math.random().toString(36).substring(2,9)}`;

        await state.set(`job : ${jobId}`,{
            jobId,
            channel,
            email,
            state : "queue",
            createdAt : new Date().toISOString(),

        })
        logger.info('job created', {jobId ,channel,email})
        await emit({
            topic : "youtube.title",
            data : {
                jobId,
                channel,
                email

            }
        })
        return{
            status:202,
            body:{
                succes : true,
                jobId,
                message : "job created and queued for processing"
            }
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