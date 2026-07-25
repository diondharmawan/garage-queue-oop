import { NextResponse } from 'next/server';
import { QueueRepositoryFactory } from '@/lib/oop/QueueRepository';

export async function GET() {
  try {
    const repository = QueueRepositoryFactory.getRepository();
    const queueTickets = await repository.getAllTickets();
    const tickets = queueTickets.map((t) => t.toJSON());
    return NextResponse.json({ success: true, data: tickets });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengambil data antrian' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, plateNumber, motorModel, motorAgeYears, serviceType, notes } = body;

    if (!customerName || !plateNumber || !motorModel || serviceType === undefined) {
      return NextResponse.json(
        { success: false, error: 'Data pendaftaran tidak lengkap!' },
        { status: 400 }
      );
    }

    const repository = QueueRepositoryFactory.getRepository();
    const newTicket = await repository.createTicket({
      customerName,
      plateNumber,
      motorModel,
      motorAgeYears: Number(motorAgeYears) || 0,
      serviceType: serviceType === 'HEAVY' ? 'HEAVY' : 'LIGHT',
      notes,
    });

    return NextResponse.json({
      success: true,
      message: 'Tiket antrian berhasil dibuat!',
      data: newTicket.toJSON(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal membuat tiket antrian' },
      { status: 500 }
    );
  }
}
