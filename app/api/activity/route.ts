import {prisma} from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const user = await currentUser();
        const body = await req.json();
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to perform this task"
            })
        }
        let level = null
        const userFind = await prisma.user.findFirst({
            where:{
                email: user.emailAddresses[0].emailAddress
            }
        })
        if(!userFind){
            return NextResponse.json({
                message: "Something went wrong"
            }, {status: 500})
        }
        const activity = await prisma.$transaction(async(tx)=>{
            const activity = await tx.activity.create({
                data:{
                    dayCount: body.dayCount as number,
                    name: body.name as string,
                    description: body.description as string,
                    userId: userFind?.id as string
                }
            })
            
            for(let i = 0; i<activity.dayCount; i++){
                level = await prisma.level.create({
                    data:{
                        activityId: activity.id as string,
                        number: i+1
                    }
                })
            }
        })
        return NextResponse.json({
            message: "Activity created successfully", 
            activity, 
            level
        }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something Went Wrong"
        }, {status: 500})
    }
}

export async function GET(req: NextRequest){
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to perform this task"
            }, {status: 403})
        }
        const userFind = await prisma.user.findFirst({
            where:{
                email: user.emailAddresses[0].emailAddress
            }
        })
        if(!userFind){
            return NextResponse.json({
                message: "Something went wrong"
            }, {status: 500})
        }
        const activity = await prisma.activity.findMany({
            where:{
                userId: userFind.id as string
            }
        })
        return NextResponse.json({
            data: activity
        }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}