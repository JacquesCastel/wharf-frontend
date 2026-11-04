import { NextResponse } from 'next/server';
import { contentUsageRobotsText } from '../lib/content-usage';

export const dynamic = 'force-static';

export function GET() {
  return new NextResponse(contentUsageRobotsText(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
