import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Create a new decision session.
export async function POST() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('decision_sessions')
      .insert({ status: 'in_progress' })
      .select('id')
      .single();

    if (error) {
      console.error('[POST /api/sessions] insert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ sessionId: data.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    console.error('[POST /api/sessions] exception', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
