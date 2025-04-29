'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { FaCopy, FaEye, FaEyeSlash, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '@/components/Modal';

function generateSecureKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let key = '';

    // Add 8 random characters
    for (let i = 0; i < 8; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Add 2 special characters
    key += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    key += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Add 4 more random characters
    for (let i = 0; i < 4; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Add 2 numbers
    key += Math.floor(Math.random() * 10);
    key += Math.floor(Math.random() * 10);

    // Shuffle the key
    return key.split('').sort(() => Math.random() - 0.5).join('');
}

export default function Keys() {
    const [keys, setKeys] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showKey, setShowKey] = useState({});
    const router = useRouter();
    const supabase = createClientComponentClient();

    const fetchKeys = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('api_keys')
                .select('*')
                .eq('user_id', session.user.id);

            if (error) throw error;
            setKeys(data || []);
        } catch (error) {
            console.error('Error fetching keys:', error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase, router]);

    useEffect(() => {
        fetchKeys();
    }, [fetchKeys]);

    const handleAddKey = async (keyData) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const generatedKey = generateSecureKey();

            const { error } = await supabase
                .from('api_keys')
                .insert([{
                    name: keyData.name,
                    key: generatedKey,
                    user_id: session.user.id,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;
            await fetchKeys();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding key:', error);
        }
    };

    const handleUpdateKey = async (keyData) => {
        try {
            const { error } = await supabase
                .from('api_keys')
                .update(keyData)
                .eq('id', selectedKey.id);

            if (error) throw error;
            await fetchKeys();
            setShowEditModal(false);
            setSelectedKey(null);
        } catch (error) {
            console.error('Error updating key:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('api_keys')
                .delete()
                .eq('id', selectedKey.id);

            if (error) throw error;
            await fetchKeys();
            setShowDeleteModal(false);
            setSelectedKey(null);
        } catch (error) {
            console.error('Error deleting key:', error);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Key copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">API Keys</h1>
                <button
                    onClick={() => {
                        setSelectedKey(null);
                        setShowAddModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Add New Key
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {keys.map((key) => (
                        <div
                            key={key.id}
                            className="bg-white p-4 rounded-lg shadow border border-gray-200"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{key.name}</h3>
                                    <p className="text-gray-500 text-sm">
                                        Created: {new Date(key.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(key.key)}
                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        <FaCopy />
                                    </button>
                                    <button
                                        onClick={() => setShowKey(prev => ({ ...prev, [key.id]: !prev[key.id] }))}
                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                        title={showKey[key.id] ? "Hide key" : "Show key"}
                                    >
                                        {showKey[key.id] ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedKey(key);
                                            setShowEditModal(true);
                                        }}
                                        className="text-blue-500 hover:text-blue-600 transition-colors"
                                        title="Edit key"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedKey(key);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-500 hover:text-red-600 transition-colors"
                                        title="Delete key"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            {showKey[key.id] && (
                                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                                    <code className="text-sm text-gray-800 font-mono">{key.key}</code>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Key Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New API Key"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const keyData = {
                            name: formData.get('name')
                        };
                        handleAddKey(keyData);
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Enter a name for this key"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                        />
                    </div>
                    <div className="text-sm text-gray-500">
                        A secure API key will be automatically generated for you.
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Generate Key
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Key Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedKey(null);
                }}
                title="Edit API Key"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const keyData = {
                            name: formData.get('name')
                        };
                        handleUpdateKey(keyData);
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={selectedKey?.name}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Key</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                            <code className="text-sm text-gray-800 font-mono">{selectedKey?.key}</code>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedKey(null);
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Key Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedKey(null);
                }}
                title="Delete API Key"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to delete the key &quot;{selectedKey?.name}&quot;? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                setSelectedKey(null);
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 