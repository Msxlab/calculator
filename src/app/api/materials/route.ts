import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(materials);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const material = await prisma.material.create({
      data: {
        name: body.name,
        type: body.type,
        pricePerSqft: body.pricePerSqft,
      },
    });
    return NextResponse.json(material);
  } catch (error) {
    return