"use client";

import { useState, useTransition, useEffect } from "react";
import { storeUser, getAllUsers, deleteUsers, updateUsersSideAdmin } from "@/lib/action";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { FieldLabel } from "./ui/field";
import { X, Plus, Edit, User, Mail, Shield, Users, Trash2, Search, AlertCircle } from "lucide-react";

export default function UsersTable() {
    
    const [showPopup, setShowPopup] = useState(false)
    const [showPopupEdit, setShowPopupEdit] = useState(false)
    const [users, setUsers] = useState([]);
    const [editUsers, setEditUsers] = useState(null);
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    
    useEffect(() => {
        startTransition(async () => {
            const data = await getAllUsers();
            setUsers(data);
        }); 
    }, []);
    
    async function handleDeleteUsers(id) {
        if (confirm("Are you sure you want to delete this user?")) {
            await deleteUsers(id);
            setUsers(await getAllUsers());
        }
    }

    async function handleUpdateSuccess() {
        setUsers(await getAllUsers());
        setShowPopupEdit(false);
    }

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    Users Management
                </h1>
                <p className="text-gray-500 mt-1">Manage user accounts and permissions</p>
            </div>
            <Button 
                onClick={() => setShowPopup(true)} 
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 transition-all duration-200"
            >
                Add User
            </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by username, email or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-600 text-sm font-medium">Total Users</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">{users.length}</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                </div>
            </div>
            
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-600 text-sm font-medium">Administrators</p>
                        <p className="text-3xl font-bold text-purple-900 mt-1">
                            {users.filter(u => u.role === 'admin').length}
                        </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-lg">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-600 text-sm font-medium">Public Users</p>
                        <p className="text-3xl font-bold text-green-900 mt-1">
                            {users.filter(u => u.role === 'public').length}
                        </p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-lg">
                        <User className="h-6 w-6 text-white" />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-gray-500 font-medium">No users found</p>
                                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((u) => (
                                <tr key={u.id_users} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                                                {u.image ? (
                                                    <img 
                                                    src={u.image} 
                                                    alt={u.username}
                                                    className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                <span className="text-white font-semibold text-sm">
                                                    {u.username.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                                </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{u.username}</p>
                                                <p className="text-xs text-gray-500">ID: {u.id_users}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">{u.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm 
                                        ${
                                            u.role === 'admin' 
                                                ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white' 
                                                : 'bg-linear-to-r from-green-500 to-green-600 text-white'
                                                }`}>
                                            {u.role === 'admin' 
                                              ? (<Shield className="h-3 w-3 mr-1" />) 
                                              : (<User className="h-3 w-3 mr-1" />)
                                            }
                                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <Button 
                                                onClick={() => { setEditUsers(u); setShowPopupEdit(true);}}  
                                                variant="outline" 
                                                size="sm"
                                                className="flex items-center gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                                Edit
                                            </Button>
                                            <Button 
                                                onClick={() => handleDeleteUsers(u.id_users)} 
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1.5 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="relative bg-linear-to-r from-blue-600 to-purple-600 p-6">
                        <button 
                            onClick={() => setShowPopup(false)} 
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Add New User</h2>
                                <p className="text-blue-100 text-sm mt-0.5">Create a new user account</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form */}
                    <form action={storeUser}>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="space-y-5">
                                <Field>
                                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-600" />
                                        Username
                                    </FieldLabel>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        placeholder="Enter username" 
                                        className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-blue-600" />
                                        Email Address
                                    </FieldLabel>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="user@example.com" 
                                        className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </FieldLabel>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="Enter secure password" 
                                        className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                        Role
                                    </FieldLabel>
                                    <select 
                                        name="role" 
                                        className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm"
                                        defaultValue="public"
                                    >
                                        <option value="public">Public User</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </Field>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setShowPopup(false)}
                                className="px-6 border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 shadow-lg shadow-blue-500/30"
                            >
                                Create User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Edit User Popup */}
        {showPopupEdit && editUsers && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="relative bg-linear-to-r from-green-600 to-emerald-600 p-6">
                        <button 
                            onClick={() => setShowPopupEdit(false)} 
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Edit className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Edit User</h2>
                                <p className="text-green-100 text-sm mt-0.5">Update user information</p>
                            </div>
                        </div>
                    </div>
                
                    <form action={async (formData) => {
                        await updateUsersSideAdmin(formData);
                        await handleUpdateSuccess();
                    }}>
                        <input type="hidden" name="id_users" value={editUsers.id_users} />

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="space-y-5">
                                <Field>
                                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4 text-green-600" />
                                        Username
                                    </FieldLabel>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        defaultValue={editUsers.username}
                                        className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm" 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-green-600" />
                                        Email Address
                                    </FieldLabel>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        defaultValue={editUsers.email}
                                        className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm" 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-green-600" />
                                        Role
                                    </FieldLabel>
                                    <select 
                                        name="role" 
                                        defaultValue={editUsers.role}
                                        className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-sm"
                                    >
                                        <option value="public">Public User</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </Field>

                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <div className="flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-amber-900">Password Update</p>
                                            <p className="text-sm text-amber-700 mt-1">
                                                Passwords cannot be changed from this form. Users must reset their password through the login system.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setShowPopupEdit(false)}
                                className="px-6 border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 shadow-lg shadow-green-500/30"
                            >
                                Update User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </div>
  );
}