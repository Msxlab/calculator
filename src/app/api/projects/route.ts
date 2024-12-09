import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: {
        customerId: body.customerId,
        projectType: body.projectDetails.projectType,
        materialType: body.projectDetails.materialType,
        materialName: body.projectDetails.materialName,
        edgeType: body.projectDetails.edgeType,
        totalPrice: body.totalPrice,
        userId: body.userId,
        measurements: {
          create: [
            ...body.measurements.tops.map((m: any) => ({
              type: 'tops',
              length: m.length,
              width: m.width,
              sqft: m.sqft,
            })),
            ...body.measurements.backsplashes.map((m: any) => ({
              type: 'backsplashes',
              length: m.length,
              width: m.width,
              sqft: m.sqft,
            })),
          ],
        },
        extras: {
          create: body.extras,
        },
      },
      include: {
        measurements: true,
        extras: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        customer: true,
        measurements: true,
        extras: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}