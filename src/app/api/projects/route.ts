import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const project = await prisma.quote.create({
      data: {
        quoteNumber: `Q${Date.now()}`,
        customerInfo: JSON.stringify(data.customerInfo),
        projectDetails: JSON.stringify(data.projectDetails),
        measurements: JSON.stringify(data.measurements),
        extras: JSON.stringify(data.extras),
        totalPrice: data.totalPrice,
        status: 'draft'
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await prisma.quote.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // JSON string'leri objelere çevir
    const formattedProjects = projects.map(project => ({
      ...project,
      customerInfo: JSON.parse(project.customerInfo),
      projectDetails: JSON.parse(project.projectDetails),
      measurements: JSON.parse(project.measurements),
      extras: JSON.parse(project.extras)
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}