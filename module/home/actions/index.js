"use server";

import { inngest } from "@/src/inngest/client";



export const onInvoke = async()=>{
    await inngest.send({
        name:"agent/hello"
    })
}