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
    const supabase = createRouteHandlerClient({ cookies });

    try {
        // Check authentication
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.error('Auth error:', authError);
            return new Response(JSON.stringify({ error: 'Authentication error' }), { status: 401 });
        }
        if (!session) {
            return new Response(JSON.stringify({ error: 'No session found' }), { status: 401 });
        }

        // Parse request body
        const { key } = await request.json();
        if (!key) {
            return new Response(JSON.stringify({ error: 'Key is required' }), { status: 400 });
        }

        // Define your secret key (store this in an environment variable in production!)
        const SECRET_KEY = process.env.API_SECRET_KEY || "my-secret-key";

        // Check if the provided key matches
        if (key !== SECRET_KEY) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // If key matches, return your data (replace with your actual data logic)
        const data = [
            { id: 1, value: "foo" },
            { id: 2, value: "bar" },
        ];

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Unexpected error:', error);
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