import {prisma} from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}:{
    params: {id: string}
}){
    try {
        const user = await currentUser();
        const {id} = params
        if(!user){
            return NextResponse.json({
                message: "you must be logged in to perform this task"
            })
        }
        const activity = await prisma.activity.findFirst({
            where: {
                id: id as string
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

export async function PUT(req: NextRequest, {params}:{
    params:{id: string}
}){
    try {
        const user = await currentUser();
        const {id} = params;
        const body = await req.json();
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to perform this task"
            }, {status: 403})
        }
        const activity = await prisma.activity.update({
            where:{
                id: id
            }, data:{
                dayCount: body.dayCount as number,
                name: body.name as string,
                description: body.description as string
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

export async function DELETE(req: NextRequest, {params}:{
    params: {id: string}
}){
    try {
        const user = await currentUser();
        const {id} = params
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to perform the task"
            })
        }
        const userFind = await prisma.user.findFirst({
            where:{
                email: user.emailAddresses[0].emailAddress
            }
        })
        const activity = await prisma.activity.delete({
            where:{
                id: id, 
                userId: userFind?.id
            }
        })
        return NextResponse.json({
            message: "Activity deleted successfully"
        }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}