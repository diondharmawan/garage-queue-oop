import { NextResponse } from 'next/server';
import { QueueRepositoryFactory } from '@/lib/oop/QueueRepository';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, pitNumber } = body;

    const repository = QueueRepositoryFactory.getRepository();
    const updatedTicket = await repository.updateTicketStatus(id, status, pitNumber);

    return NextResponse.json({
      success: true,
      message: 'Status antrian berhasil diperbarui!',
      data: updatedTicket.toJSON(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui status antrian' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repository = QueueRepositoryFactory.getRepository();
    const success = await repository.deleteTicket(id);

    return NextResponse.json({
      success,
      message: success ? 'Tiket berhasil dihapus' : 'Tiket tidak ditemukan',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus tiket' },
      { status: 500 }
    );
  }
}
