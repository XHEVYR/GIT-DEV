// File: app/api/places/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Pastikan path ini benar

// GET: Untuk melihat data di browser
export async function GET() {
  try {
    const places = await prisma.place.findMany();
    return NextResponse.json(places);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

// POST: Untuk menambah data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPlace = await prisma.place.create({
      data: {
        name: body.name,
        description: body.description,
        lat: parseFloat(body.lat), // Ubah string ke float
        lon: parseFloat(body.lon),
        category: body.category,
      }
    });
    return NextResponse.json(newPlace);
  } catch (error) {
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}