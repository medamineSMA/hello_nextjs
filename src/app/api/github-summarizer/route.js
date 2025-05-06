import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
