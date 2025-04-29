'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
    FaHome,
    FaKey,
    FaCog,
    FaChartLine,
    FaUser,
    FaSignOutAlt,
    FaBars,
    FaTimes
} from 'react-icons/fa';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClientComponentClient();

    const menuItems = [
        { name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
        { name: 'API Keys', icon: <FaKey />, path: '/dashboard/keys' },
        { name: 'Analytics', icon: <FaChartLine />, path: '/dashboard/analytics' },
        { name: 'Settings', icon: <FaCog />, path: '/dashboard/settings' },
        { name: 'Profile', icon: <FaUser />, path: '/dashboard/profile' },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className={`fixed left-0 top-0 h-screen bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center justify-between p-4">
                {isOpen && <h1 className="text-xl font-bold">API Manager</h1>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-gray-700"
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
            <nav className="mt-8">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => router.push(item.path)}
                        className={`flex items-center w-full p-4 hover:bg-gray-700 transition-colors ${pathname === item.path ? 'bg-gray-700' : ''
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {isOpen && <span className="ml-4">{item.name}</span>}
                    </button>
                ))}
            </nav>
            <div className="absolute bottom-0 w-full p-4">
                <button
                    onClick={handleSignOut}
                    className="flex items-center w-full p-4 hover:bg-gray-700 transition-colors"
                >
                    <span className="text-xl"><FaSignOutAlt /></span>
                    {isOpen && <span className="ml-4">Sign Out</span>}
                </button>
            </div>
        </div>
    );
} 