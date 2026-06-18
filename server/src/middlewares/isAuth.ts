import {Request,Response,NextFunction} from 'express'
import jwt ,{JwtPayload}from 'jsonwebtoken'
import User,{IUser} from '../models/User.js'


export interface AuthenticatedRequest extends Request{
    user?: IUser | null;

}
export const isAuth = async(
    req:AuthenticatedRequest,
    res:Response,
    next:NextFunction
): Promise<void> =>{
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            res.status(401).json({
                message:"Please Login - No auth header",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if(!token){
             res.status(401).json({
                message:"Please Login - Token missing",
            });
            return;

        }
        const decodedData = jwt.verify(
            token, 
            process.env.JWT_SEC as string
        )as JwtPayload; 

        if(!decodedData || !decodedData._id){
           res.status(401).json({
                message:"Invalid token",
            });  
            return; 
        }

        const user = await User.findById(decodedData._id);

        if(!user){
            res.status(401).json({
                message:"Expired token",
            });  
            return;
            
        }

        req.user = user;
        next();
    } catch (error:any) {
        console.log(error.message);
         res.status(500).json({
                message:"Please Login",
            });  

        
    }
}