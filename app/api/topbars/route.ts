import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    console.log('📊 Fetching all topbars...');

    const topbars = await prisma.topBar.findMany({
      orderBy: { createdAt: 'asc' }, // Show in creation order
    });

    console.log(`📊 Found ${topbars.length} topbars`);

    // Transform data for frontend use
    const formattedTopBars = topbars.map((topbar) => ({
      id: topbar.id,
      title: topbar.title,
      link: topbar.link,
      textColor: topbar.textColor,
      backgroundColor: topbar.backgroundColor || undefined,
      button: topbar.button
        ? {
            text: topbar.button.text || undefined,
            link: topbar.button.link || undefined,
            textColor: topbar.button.textColor,
            backgroundColor: topbar.button.backgroundColor,
          }
        : undefined,
      createdAt: topbar.createdAt,
      updatedAt: topbar.updatedAt,
    }));

    console.log('🔗 TopBars formatted for frontend');

    // Limit to maximum 2 topbars for carousel functionality (active topbars logic)
    const limitedTopBars = formattedTopBars.slice(0, 2);

    console.log(`📊 Returning ${limitedTopBars.length} active topbars`);

    return NextResponse.json({
      success: true,
      data: limitedTopBars,
    });
  } catch (error) {
    console.error('Error in topbars API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
