import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const quoteNumber = `Q${Date.now()}`;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerInfo: data.customerInfo,
        projectDetails: data.projectDetails,
        measurements: data.measurements,
        extras: data.extras,
        totalPrice: data.totalPrice,
        status: 'draft'
      }
    });

    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}