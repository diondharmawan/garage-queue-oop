import { NextResponse } from 'next/server';
import { queueTicketSchema } from '@/lib/validations/queue';
import { checkRateLimit } from '@/lib/rate-limiter';
import { QueueRepositoryFactory } from '@/lib/oop/QueueRepository';

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export async function GET(request: Request) {
  try {
    const repository = QueueRepositoryFactory.getRepository();
    const queueTickets = await repository.getAllTickets();
    const tickets = queueTickets.map((t) => t.toJSON());
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    // Hide internal stack trace from public response
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data antrian' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check (Max 5 requests per minute per IP)
    const clientIp = getClientIp(request);
    const { isRateLimited, remaining } = checkRateLimit(clientIp, 5, 60 * 1000);

    if (isRateLimited) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan (Too Many Requests). Silakan tunggu 1 menit.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // 2. Parse JSON body safely
    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Format JSON payload tidak valid' },
        { status: 400 }
      );
    }

    // 3. Zod Input Validation & Sanitization
    const validationResult = queueTicketSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return NextResponse.json(
        {
          success: false,
          error: 'Validasi input gagal',
          details: formattedErrors,
        },
        {
          status: 400,
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
          },
        }
      );
    }

    const validData = validationResult.data;

    // 4. Execute Business Logic via Abstraction Layer
    const repository = QueueRepositoryFactory.getRepository();
    const newTicket = await repository.createTicket({
      customerName: validData.customerName,
      plateNumber: validData.plateNumber,
      motorModel: validData.motorModel,
      motorAgeYears: validData.motorAgeYears,
      serviceType: validData.serviceType,
      notes: validData.notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tiket antrian berhasil dibuat',
        data: newTicket.toJSON(),
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  } catch (error) {
    // Safe error handling without stack trace leak
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal pada server' },
      { status: 500 }
    );
  }
}
