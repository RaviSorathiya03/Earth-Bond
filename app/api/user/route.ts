import {prisma} from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:NextRequest){
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to use the app"
            }, {status: 403})
        }
        const existingUser = await prisma.user.findFirst({
            where:{
                email: user.emailAddresses[0].emailAddress
            }
        })
        if(existingUser){
            return NextResponse.json({
                message: "User already exists"
            }, {status: 403})
        }
        const newUser = await prisma.user.create({
            data:{
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName as string,
                lastName: user.lastName as string
            }
        })
        return NextResponse.json({
            message: "User created",
            data: newUser
        }, {status: 201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}

export async function GET(req:NextRequest){
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({
                message: "You must be logged in to use the app"
            }, {status: 403})
        }
        const userFind = await prisma.user.findFirst({
            where:{
                email: user.emailAddresses[0].emailAddress
            }
        })
        if(!userFind){
            return NextResponse.json({
                message: "User not found"
            }, {status: 404})
        }
        return NextResponse.json({
            message: "User found",
            data: userFind
        }, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}

export async function PUT(req:NextRequest){
    try {
        const user = await currentUser();
        const body = await req.json();
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
                message: "User not found"
            }, {status: 404})
        }
       const updateUser = await prisma.user.update({
            where:{
                id: userFind.id
            }, data:{
                bio: body.bio as string,
                profilePic: body.picUrl as string
            }
       })

       return NextResponse.json({
        message:"User profile updated successfully", 
        data: updateUser
       }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}