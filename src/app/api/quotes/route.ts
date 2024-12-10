import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const quote = await prisma.quote.create({
      data: {
        customerInfo: data.customerInfo,
        projectDetails: data.projectDetails,
        measurements: data.measurements,
        extras: data.extras,
        totalPrice: data.totalPrice,
        status: data.status,
      },
    });
    
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save quote' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}