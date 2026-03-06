import express,{Request,Response} from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@showsphere/common";
import mongoose from "mongoose";


const router = express.Router();


router.get("/api/tickets/:id",async(req:Request,res:Response)=>{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new NotFoundError();   // return 404 instead of 400
        }
        const ticket = await Ticket.findById(id);
        // console.log(ticket);
        if(!ticket){
               throw new NotFoundError();
        }
        res.send(ticket);
        // return res.statusCode()
        // return res.status(200).send(ticket);
})


export {router as showTicketRouter};