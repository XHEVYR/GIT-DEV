import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const places = await prisma.place.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(places);
}

export async function POST(request: Request) {
  console.log(request);
  try {
    const body = await request.json();

    // 1. Cek Data Masuk di Terminal
    console.log("Data diterima dari Frontend:", body);

    // 2. Validasi Angka (PENTING! Mencegah NaN)
    const lat = parseFloat(body.lat);
    const lon = parseFloat(body.lon);

    if (isNaN(lat) || isNaN(lon)) {
      console.log("Error: Latitude/Longitude bukan angka");
      return NextResponse.json({ error: 'Lat/Lon harus angka' }, { status: 400 });
    }

    // 3. Coba Simpan
    const newPlace = await prisma.place.create({
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        image: body.image,
        lat: lat,
        lon: lon,
        category: body.category,
      }
    });

    console.log("Berhasil disimpan:", newPlace);
    return NextResponse.json(newPlace);

  } catch (error) {
    // 4. MUNCULKAN ERROR DI TERMINAL
    console.error("GAGAL SAVE DATABASE:", error); 
    
    return NextResponse.json(
      { error: 'Gagal menyimpan data ke database' }, 
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) { {
  try {
    const body = await request.json();
    const id = body.id;
    const updatedPlace = await prisma.place.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        image: body.image,
        lat: parseFloat(body.lat),
        lon: parseFloat(body.lon),
        category: body.category,
      }
    });
    return NextResponse.json(updatedPlace);
  } catch (error) {
    console.error("GAGAL UPDATE DATA:", error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data di database' }, 
      { status: 500 }
    );
  }
}}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    } 
    const deletedPlace = await prisma.place.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json(deletedPlace);
  } catch (error) {
    console.error("GAGAL DELETE DATA:", error);
    return NextResponse.json(
      { error: 'Gagal menghapus data dari database' }, 
      { status: 500 }
    );
  }
}

