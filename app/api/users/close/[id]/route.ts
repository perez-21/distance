import { NextResponse } from 'next/server'
import { getDistance } from 'geolib';
import prismaClient from "@/app/lib/prisma";


export async function GET(request: Request, { params }: { params: { id: string}}) {

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat') || 10.000);
  const lng = Number(searchParams.get('lng') || 1.000);

  await prismaClient.user.update({where: {id}, data: {
    lat,
    lng
  }});

  const users = await prismaClient.user.findMany({where: {id: { not: id }}});

  const distances = users.map((user) => {
    return {id: user.id, name: user.name, distance: getDistance({latitude: lat, longitude: lng} , {latitude: Number(user.lat), longitude: Number(user.lng)}) / 1000};
  });

  const filteredDistances = distances.toSpliced(10, distances.length - 10).sort((a, b) => a.distance - b.distance);

  return NextResponse.json(
    filteredDistances
  );
}