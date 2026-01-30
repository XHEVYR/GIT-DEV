import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PERBAIKAN: Ubah tipe 'params' menjadi Promise<{ id: string }>
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const body = await request.json();
    
    // Karena params adalah Promise, kita harus await (ini sudah benar di kode Anda)
    const { id } = await params; 
    
    console.log("Data UPDATE diterima dari Frontend:", body);
    console.log("ID dari URL params:", id);
    
    if (!id) {
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

// PERBAIKAN: Lakukan hal yang sama untuk DELETE
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log("DELETE request - ID dari URL params:", id);
    
    if (!id) {
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