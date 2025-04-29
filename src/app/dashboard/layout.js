'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [router, supabase.auth]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto ml-64">
                {children}
            </main>
        </div>
    );
} 