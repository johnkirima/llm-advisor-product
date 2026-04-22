import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { TaskData } from '@/lib/decision-types';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as Partial<TaskData>;
    if (!body.task_type || !body.audience || !body.success_criteria) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('tasks')
      .upsert(
        {
          session_id: params.id,
          task_type: body.task_type,
          audience: body.audience,
          success_criteria: body.success_criteria,
          scenario_summary: body.scenario_summary ?? null,
        },
        { onConflict: 'session_id' }
      );
    if (error) {
      console.error('[POST task] upsert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
