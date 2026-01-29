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


export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;
    
    console.log("Data UPDATE diterima dari Frontend:", body);
    console.log("ID yang akan di-update:", id);
    
    if (!id) {
      console.log("Error: ID tidak ditemukan");
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }
    
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
    
    console.log("Berhasil di-update:", updatedPlace);
    return NextResponse.json(updatedPlace);
  } catch (error) {
    console.error("GAGAL UPDATE DATA:", error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data di database' }, 
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log("DELETE request URL:", request.url);
    console.log("ID yang akan di-delete:", id);
    
    if (!id) {
      console.log("Error: ID tidak ditemukan di query parameter");
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    } 
    
    const deletedPlace = await prisma.place.delete({
      where: { id: parseInt(id) }
    });
    
    console.log("Berhasil di-delete:", deletedPlace);
    return NextResponse.json(deletedPlace);
  } catch (error) {
    console.error("GAGAL DELETE DATA:", error);
    return NextResponse.json(
      { error: 'Gagal menghapus data dari database' }, 
      { status: 500 }
    );
  }
}

