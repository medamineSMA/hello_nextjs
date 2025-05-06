import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('user_id', session.user.id);

        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        // Parse request body
        const { key } = await request.json();
        if (!key) {
            return new Response(JSON.stringify({ error: 'Key is required' }), { status: 400 });
        }

        // Create Supabase client
        const supabase = createRouteHandlerClient({ cookies });

        // Check if the key exists in the api_keys table
        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('key', key)
            .single();

        if (error || !data) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // If key is valid, return a success message (add your logic here)
        return new Response(JSON.stringify({ message: "API key validated. Ready for summarization!" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
} 