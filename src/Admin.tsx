/// <reference types="vite/client" />
import { useEffect, useState } from "react";
import { Search, Users, TestTube, Star, Download, Calendar, Phone, Mail, User, RefreshCw, Filter, LogOut, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// --- Types ---
interface WaitlistUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    beta_tester: boolean;
    ambassador: boolean;
    created_at: string;
}

// --- API Configuration ---
const API_URL = import.meta.env.VITE_API_URL;
const API_ENDPOINTS = {
    verify: `${API_URL}/api/admin-verify`,
    waitlist: `${API_URL}/api/waitlist`,
    logout: `${API_URL}/api/admin-logout`,
};

// --- Main Admin Component ---
export default function Admin() {
    const navigate = useNavigate();

    // --- State Management ---
    const [users, setUsers] = useState<WaitlistUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // --- Data Fetching and Auth ---
    useEffect(() => {
        const verifyAndFetch = async () => {
            try {
                // 1. Verify admin session
                const verifyRes = await fetch(API_ENDPOINTS.verify, { credentials: 'include' });
                const verifyData = await verifyRes.json();

                if (!verifyData.authenticated) {
                    navigate('/admin-login');
                    return;
                }

                // 2. Fetch waitlist data
                await fetchData();

            } catch (err) {
                setError("Failed to verify admin status. Please try logging in again.");
                console.error("Verification or fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        verifyAndFetch();
    }, [navigate]);

    const fetchData = async () => {
        setRefreshing(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINTS.waitlist, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
                setLastUpdated(new Date());
            } else {
                throw new Error(data.message || "Failed to fetch waitlist data.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            console.error("Error fetching waitlist:", err);
        } finally {
            setRefreshing(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(API_ENDPOINTS.logout, { method: 'POST', credentials: 'include' });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            localStorage.removeItem("isAdmin");
            navigate('/admin-login');
        }
    };

    // --- Filtering and Exporting ---
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    const exportToCSV = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Beta Tester", "Ambassador", "Joined At"];
        const csvData = filteredUsers.map(user => [
            user.id,
            user.name,
            user.email,
            user.phone || "N/A",
            user.beta_tester ? "Yes" : "No",
            user.ambassador ? "Yes" : "No",
            new Date(user.created_at).toISOString()
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `kanairoxo-waitlist-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // --- UI Components ---
    const StatCard = ({ icon: Icon, label, value, color, shadow }: { icon: React.ElementType, label: string, value: number, color: string, shadow: string }) => (
        <div className={`rounded-3xl p-6 md:p-8 bg-gradient-to-br ${color} shadow-lg ${shadow} flex items-center gap-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
            <div className="flex-shrink-0 bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-inner">
                <Icon size={36} className="text-white drop-shadow-md" />
            </div>
            <div>
                <p className="text-white/90 text-sm font-medium uppercase tracking-wider">{label}</p>
                <p className="text-4xl font-bold text-white mt-1 drop-shadow-sm">{value}</p>
            </div>
        </div>
    );

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <ShieldCheck className="animate-pulse text-indigo-300 h-16 w-16 mx-auto" />
                    <p className="text-gray-600 text-lg font-medium">Verifying credentials & loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                <div className="bg-white border-2 border-red-200 rounded-2xl p-8 text-center shadow-xl max-w-lg">
                    <AlertTriangle className="text-red-500 h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-800 mb-2">An Error Occurred</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/admin-login')}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const stats = [
        { label: "Total Waitlist", value: users.length, icon: Users, color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-300/50" },
        { label: "Beta Testers", value: users.filter(u => u.beta_tester).length, icon: TestTube, color: "from-emerald-500 to-green-400", shadow: "shadow-emerald-300/50" },
        { label: "Ambassadors", value: users.filter(u => u.ambassador).length, icon: Star, color: "from-amber-400 to-orange-400", shadow: "shadow-amber-300/50" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 text-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-xl mx-auto space-y-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">KanairoXO Dashboard</h1>
                        <p className="text-gray-500 text-lg mt-1">Waitlist Management System</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchData} disabled={refreshing} className="flex items-center gap-2 px-4 py-2.5 text-indigo-700 bg-white border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                            Refresh
                        </button>
                        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg shadow-md hover:opacity-90 transition-opacity">
                            <Download size={18} />
                            Export CSV
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-red-700 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 transition-all duration-200">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => <StatCard key={index} {...stat} />)}
                </section>

                {/* Search & Filter Bar */}
                <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="w-full md:max-w-lg relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-indigo-50/60 border-2 border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 text-indigo-700 bg-white border border-indigo-200 rounded-xl shadow hover:bg-indigo-50 transition-colors duration-200 w-full md:w-auto justify-center">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </section>

                {/* Main Content: Table */}
                <main className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <header className="px-6 py-5 border-b border-gray-200 bg-white/50">
                        <h2 className="text-xl font-semibold text-indigo-900">Waitlist Members</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Showing <span className="font-bold text-indigo-600">{filteredUsers.length}</span> of <span className="font-bold text-indigo-600">{users.length}</span> members.
                        </p>
                    </header>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    {["User", "Contact", "Beta Tester", "Ambassador", "Joined At"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-indigo-800/80 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{`ID: ${user.id}`}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Mail size={14} className="text-gray-400" /> {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                    <Phone size={14} className="text-gray-400" /> {user.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold leading-tight ${user.beta_tester ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"}`}>
                                                {user.beta_tester ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold leading-tight ${user.ambassador ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"}`}>
                                                {user.ambassador ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-800">{new Date(user.created_at).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500">{new Date(user.created_at).toLocaleTimeString()}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-16 px-6">
                            <Users size={48} className="mx-auto text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-800">
                                {searchTerm ? "No Members Found" : "Your Waitlist is Empty"}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? "Try a different search term or clear the search." : "New sign-ups will appear here."}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500">
                    <p>KanairoXO Waitlist Management System</p>
                    <p className="mt-1">Last updated: <span className="font-medium text-gray-600">{lastUpdated.toLocaleString()}</span></p>
                </footer>
            </div>
        </div>
    );
}
