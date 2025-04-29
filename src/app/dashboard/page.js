'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { FaCopy, FaEye, FaEyeSlash, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '@/components/Modal';

export default function Dashboard() {
    const [apiKeys, setApiKeys] = useState([]);
    const [newKeyName, setNewKeyName] = useState('');
    const [editingKey, setEditingKey] = useState(null);
    const [editName, setEditName] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [revealedKeys, setRevealedKeys] = useState({});
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null, // 'create', 'edit', 'delete'
        data: null,
    });

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        try {
            const response = await fetch('/api/keys');
            if (!response.ok) throw new Error('Failed to fetch API keys');
            const data = await response.json();
            setApiKeys(data);
        } catch (error) {
            console.error('Error fetching API keys:', error);
            setMessage('Error fetching API keys');
        }
    };

    const createApiKey = async () => {
        if (!newKeyName.trim()) {
            setMessage('Please enter a name for the API key');
            return;
        }

        try {
            const response = await fetch('/api/keys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newKeyName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create API key');
            }

            setApiKeys(prevKeys => [...prevKeys, data]);
            setNewKeyName('');
            setMessage('API key created successfully!');
        } catch (error) {
            console.error('Error creating API key:', error);
            setMessage(`Error: ${error.message}`);
        }
    };

    const updateApiKey = async (id) => {
        try {
            const response = await fetch(`/api/keys/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: editName }),
            });

            if (!response.ok) throw new Error('Failed to update API key');

            const data = await response.json();
            setApiKeys(prevKeys =>
                prevKeys.map(key => key.id === id ? data : key)
            );
            setEditingKey(null);
            setEditName('');
            setMessage('API key updated successfully!');
        } catch (error) {
            console.error('Error updating API key:', error);
            setMessage('Error updating API key');
        }
    };

    const deleteApiKey = async (id) => {
        try {
            const response = await fetch(`/api/keys/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete API key');

            setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
            setMessage('API key deleted successfully!');
        } catch (error) {
            console.error('Error deleting API key:', error);
            setMessage('Error deleting API key');
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleKeyVisibility = (keyId) => {
        setRevealedKeys(prev => ({
            ...prev,
            [keyId]: !prev[keyId]
        }));
    };

    const handleCreate = async () => {
        await createApiKey();
        setModalState({ isOpen: false, type: null, data: null });
    };

    const handleEdit = async () => {
        await updateApiKey(modalState.data.id);
        setModalState({ isOpen: false, type: null, data: null });
    };

    const handleDelete = async () => {
        await deleteApiKey(modalState.data.id);
        setModalState({ isOpen: false, type: null, data: null });
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">API Keys Management</h1>
                <button
                    onClick={handleLogout}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                    Logout
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded ${message.includes('successfully')
                    ? 'bg-green-900 text-green-100'
                    : 'bg-red-900 text-red-100'
                    }`}>
                    {message}
                </div>
            )}

            {/* Create Modal */}
            <Modal
                isOpen={modalState.isOpen && modalState.type === 'create'}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
                title="Create New API Key"
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter API key name"
                        className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setModalState({ isOpen: false, type: null, data: null })}
                            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={modalState.isOpen && modalState.type === 'edit'}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
                title="Edit API Key"
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter new name"
                        className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setModalState({ isOpen: false, type: null, data: null })}
                            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={modalState.isOpen && modalState.type === 'delete'}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
                title="Delete API Key"
            >
                <div className="space-y-4">
                    <p className="text-white">Are you sure you want to delete this API key? This action cannot be undone.</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setModalState({ isOpen: false, type: null, data: null })}
                            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="grid gap-4">
                {apiKeys.map((key) => (
                    <div
                        key={key.id}
                        className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-white">{key.name}</h3>
                                <p className="text-gray-400 text-sm">
                                    Created: {new Date(key.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(key.key);
                                        setMessage('Key copied to clipboard!');
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Copy to clipboard"
                                >
                                    <FaCopy />
                                </button>
                                <button
                                    onClick={() => toggleKeyVisibility(key.id)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title={revealedKeys[key.id] ? "Hide key" : "Show key"}
                                >
                                    {revealedKeys[key.id] ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditName(key.name);
                                        setModalState({ isOpen: true, type: 'edit', data: key });
                                    }}
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                    title="Edit key"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => setModalState({ isOpen: true, type: 'delete', data: key })}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                    title="Delete key"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                        {revealedKeys[key.id] && (
                            <div className="mt-2 p-2 bg-gray-900 rounded border border-gray-700">
                                <code className="text-sm text-gray-300 font-mono">{key.key}</code>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 