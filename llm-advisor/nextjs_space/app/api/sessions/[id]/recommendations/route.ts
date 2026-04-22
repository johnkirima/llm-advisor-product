import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { scoreLLMs } from '@/lib/recommend';
import {
  ConstraintsData,
  PrioritiesData,
  TaskData,
} from '@/lib/decision-types';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServer();
    const sessionId = params.id;

    const [taskRes, constRes, priRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('session_id', sessionId).single(),
      supabase
        .from('constraints')
        .select('*')
        .eq('session_id', sessionId)
        .single(),
      supabase
        .from('priorities')
        .select('*')
        .eq('session_id', sessionId)
        .single(),
    ]);

    if (taskRes.error || constRes.error || priRes.error) {
      const errMsg =
        taskRes.error?.message ||
        constRes.error?.message ||
        priRes.error?.message ||
        'Session data incomplete';
      console.error('[POST recommendations] fetch error', errMsg);
      return NextResponse.json({ error: errMsg }, { status: 400 });
    }

    const task = taskRes.data as TaskData;
    const constraints = constRes.data as ConstraintsData;
    const priorities = priRes.data as PrioritiesData;

    const recs = scoreLLMs(task, constraints, priorities);

    // Clear prior recommendations (idempotent re-run) then insert fresh set.
    const { error: delError } = await supabase
      .from('recommendations')
      .delete()
      .eq('session_id', sessionId);
    if (delError) {
      console.error('[POST recommendations] delete error', delError);
    }

    const rows = recs.map((r) => ({
      session_id: sessionId,
      llm_id: r.llm_id,
      rank: r.rank,
      weighted_score: r.weighted_score,
      rationale_json: r.rationale,
    }));
    const { error: insError } = await supabase
      .from('recommendations')
      .insert(rows);
    if (insError) {
      console.error('[POST recommendations] insert error', insError);
      return NextResponse.json({ error: insError.message }, { status: 500 });
    }

    return NextResponse.json({ recommendations: recs });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    console.error('[POST recommendations] exception', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
