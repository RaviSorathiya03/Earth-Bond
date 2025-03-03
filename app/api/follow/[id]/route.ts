import {prisma} from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, {params}:{
    params: {id: string}
}){
    try {
        const user = await currentUser();
        const {id} = params
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
        const follow = await prisma.followers.create({
            data:{
                followerId: userFind?.id as string,
                followingId: id
            }
        })

        return NextResponse.json({
            data: follow
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
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to perform this task"
            })
        }
        const {id} = params
        const userFind = await prisma.user.findFirst({
            where:{
                email: user.emailAddresses[0].emailAddress
            }
        })
        if(!userFind){
            return NextResponse.json({
                message: "Something went wrong"
            })
        }
        const unFollow = await prisma.followers.findFirst({
            where: {
                followerId: userFind.id,
                followingId: id
            }
        })
        if(!unFollow){
            return NextResponse.json({
                message: "Something went wrong"
            }, {status: 500})
        }
        const unFollowDo = await prisma.followers.delete({
            where:{
                id: unFollow.id
            }
        })
        return NextResponse.json({
            data: unFollowDo,
            
        }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}