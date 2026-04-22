import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

type SelectionBody = {
  llm_id: string;
  confidence: number; // 1-5
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as Partial<SelectionBody>;
    const { llm_id, confidence } = body;
    if (!llm_id || typeof confidence !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    if (confidence < 1 || confidence > 5) {
      return NextResponse.json(
        { error: 'Confidence must be between 1 and 5' },
        { status: 400 }
      );
    }
    const supabase = getSupabaseServer();
    const sessionId = params.id;
    const nowIso = new Date().toISOString();

    const { error: selError } = await supabase
      .from('selections')
      .upsert(
        {
          session_id: sessionId,
          llm_id,
          confidence,
          selected_at: nowIso,
        },
        { onConflict: 'session_id' }
      );
    if (selError) {
      console.error('[POST selection] upsert error', selError);
      return NextResponse.json({ error: selError.message }, { status: 500 });
    }

    const { error: sessError } = await supabase
      .from('decision_sessions')
      .update({ status: 'committed', committed_at: nowIso })
      .eq('id', sessionId);
    if (sessError) {
      console.error('[POST selection] session update error', sessError);
      return NextResponse.json({ error: sessError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
