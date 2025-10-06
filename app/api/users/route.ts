import { nanoid } from 'nanoid'
import { User } from '@/app/shared/types'
import { NextResponse } from 'next/server'
import prismaClient from "@/app/lib/prisma";


export async function POST(request: Request) {

  try {
    const body = await request.json();

    const { name, longitude, latitude } = body;

    const user: User = {
      id: nanoid(),
      name: name || "Snowymountain",
      lng: Number(longitude),
      lat: Number(latitude),
    }

    // persist user
    const result = await prismaClient.user.create({
      data: user
    });


    return NextResponse.json({
      message: 'User added',
      user: {...result},
    });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }

}