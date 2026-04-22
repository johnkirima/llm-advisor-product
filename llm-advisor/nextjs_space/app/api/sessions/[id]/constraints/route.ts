import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { ConstraintsData } from '@/lib/decision-types';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as Partial<ConstraintsData>;
    if (!body.deadline_urgency || !body.budget_sensitivity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('constraints')
      .upsert(
        {
          session_id: params.id,
          deadline_urgency: body.deadline_urgency,
          budget_sensitivity: body.budget_sensitivity,
        },
        { onConflict: 'session_id' }
      );
    if (error) {
      console.error('[POST constraints] upsert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
