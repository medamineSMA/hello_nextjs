import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { name } = await request.json();

        const { data, error } = await supabase
            .from('api_keys')
            .update({ name })
            .eq('id', id)
            .eq('user_id', session.user.id)
            .select()
            .single();

        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { error } = await supabase
            .from('api_keys')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) throw error;
        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
} 