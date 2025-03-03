"use server"

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getFollowers(req: NextRequest){
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to perform this task"
            }, {status: 403})
        }
        const userFind = await prisma.user.findFirst({
            where: {
                email: user.emailAddresses[0].emailAddress
            }
        })
        if(!userFind){
            return NextResponse.json({
                message: "Something went wrong"
            }, {status: 500})
        }
        const followers = await prisma.followers.findMany({
            where:{
                followingId: userFind.id
            }
        })
        return NextResponse.json({
            data: followers
        }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}

export async function getFollowing(req:NextRequest){
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to perform this task"
            })
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
        const following = await prisma.followers.findMany({
            where:{
                followerId: userFind?.id
            }
        })
        return NextResponse.json({
            data: following
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}