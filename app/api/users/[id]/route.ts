
import { User } from '@/app/shared/types'
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string}}) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  // TODO: query database
  
  const user: User = {
    id,
    name: "insert name",
    lat: 1234,
    lng: 5678,
  }

  return NextResponse.json(user, {status: 200})
}