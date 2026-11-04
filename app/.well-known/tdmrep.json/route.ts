import { NextResponse } from 'next/server';
import { tdmReservationRules } from '../../lib/content-usage';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(tdmReservationRules);
}
