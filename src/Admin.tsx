/// <reference types="vite/client" />
import { useEffect, useState } from "react";
import { Search, Users, TestTube, Star, Download, Calendar, Phone, Mail, User, RefreshCw, Filter } from 'lucide-react';

export default function Admin() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const response = await fetch(`${API_URL}/api/waitlist`);
            const data = await response.json();
            if (data.success) setUsers(data.data);
        } catch (err) {
            console.error("Error fetching waitlist:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Phone", "Beta Tester", "Ambassador", "Joined"];
        const csvData = filteredUsers.map(user => [
            user.name,
            user.email,
            user.phone || "",
            user.beta_tester ? "Yes" : "No",
            user.ambassador ? "Yes" : "No",
            new Date(user.created_at).toLocaleString()
        ]);
        
        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(","))
            .join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `kanairoxo-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const stats = [
        {
            label: "Total Waitlist",
            value: users.length,
            icon: Users,
            color: "from-blue-500 to-cyan-400",
            shadow: "shadow-blue-200"
        },
        {
            label: "Beta Testers",
            value: users.filter(u => u.beta_tester).length,
            icon: TestTube,
            color: "from-emerald-500 to-green-400",
            shadow: "shadow-emerald-200"
        },
        {
            label: "Ambassadors",
            value: users.filter(u => u.ambassador).length,
            icon: Star,
            color: "from-amber-400 to-orange-400",
            shadow: "shadow-amber-200"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading waitlist data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 text-gray-900 py-10 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">KanairoXO Waitlist</h1>
                        <p className="text-gray-500 text-lg">
                            Manage and monitor your waitlist members
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 lg:mt-0">
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-5 py-3 text-indigo-700 bg-white border border-indigo-200 rounded-xl shadow hover:bg-indigo-50 transition-colors duration-200 disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                            Refresh
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl shadow hover:from-indigo-600 hover:to-cyan-600 transition-colors duration-200"
                        >
                            <Download size={20} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`rounded-3xl p-8 bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow} flex items-center gap-6 transition-transform hover:scale-105`}
                        >
                            <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-2xl p-4 shadow-inner">
                                <stat.icon size={36} className="text-white drop-shadow" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                                <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="bg-white/80 rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="w-full md:max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={22} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-4 py-4 bg-indigo-50 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 text-lg"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-5 py-4 text-indigo-700 bg-white border border-indigo-200 rounded-xl shadow hover:bg-indigo-50 transition-colors duration-200">
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white/90 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-cyan-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-indigo-900">Waitlist Members</h2>
                                <p className="text-gray-500 text-base mt-1">
                                    Showing <span className="font-bold">{filteredUsers.length}</span> of <span className="font-bold">{users.length}</span> members
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <User size={18} />
                                            Name
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Mail size={18} />
                                            Email
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Phone size={18} />
                                            Phone
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                        Beta Tester
                                    </th>
                                    <th className="px-8 py-5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                        Ambassador
                                    </th>
                                    <th className="px-8 py-5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={18} />
                                            Joined
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user, idx) => (
                                    <tr 
                                        key={user.id} 
                                        className="hover:bg-indigo-50/60 transition-colors duration-150"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="font-semibold text-indigo-900">{user.name}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-indigo-700">{user.email}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-indigo-700">{user.phone || "—"}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold ${
                                                user.beta_tester 
                                                    ? "bg-emerald-100 text-emerald-800" 
                                                    : "bg-gray-100 text-gray-800"
                                            }`}>
                                                {user.beta_tester ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold ${
                                                user.ambassador 
                                                    ? "bg-amber-100 text-amber-800" 
                                                    : "bg-gray-100 text-gray-800"
                                            }`}>
                                                {user.ambassador ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm text-indigo-900">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-indigo-400">
                                                {new Date(user.created_at).toLocaleTimeString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow">
                                <Users size={48} className="text-indigo-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                                {searchTerm ? "No matching members found" : "No waitlist members yet"}
                            </h3>
                            <p className="text-indigo-500 max-w-md mx-auto mb-4">
                                {searchTerm 
                                    ? "Try adjusting your search terms to find what you're looking for."
                                    : "Users who sign up for your waitlist will appear here."
                                }
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between py-8 text-base text-indigo-400">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        Last updated: {new Date().toLocaleString()}
                    </div>
                    <div className="mt-2 sm:mt-0 font-semibold text-indigo-500">
                        KanairoXO Waitlist Management System
                    </div>
                </div>
            </div>
        </div>
    );
}
