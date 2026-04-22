import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { PrioritiesData, Priority } from '@/lib/decision-types';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as Partial<PrioritiesData>;
    const { rank_1, rank_2, rank_3 } = body;
    if (!rank_1 || !rank_2 || !rank_3) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const allowed: Priority[] = ['quality', 'reliability', 'affordability'];
    const picks = [rank_1, rank_2, rank_3];
    if (!picks.every((p) => allowed.includes(p as Priority))) {
      return NextResponse.json(
        { error: 'Invalid priority value' },
        { status: 400 }
      );
    }
    if (new Set(picks).size !== 3) {
      return NextResponse.json(
        { error: 'Priorities must be distinct' },
        { status: 400 }
      );
    }
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('priorities')
      .upsert(
        {
          session_id: params.id,
          rank_1,
          rank_2,
          rank_3,
        },
        { onConflict: 'session_id' }
      );
    if (error) {
      console.error('[POST priorities] upsert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
