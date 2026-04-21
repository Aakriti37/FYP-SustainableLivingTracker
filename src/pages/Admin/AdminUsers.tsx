import { useState, useEffect } from "react";
import { Users, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";



type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
};

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (_id: string) => {
        if (!window.confirm("Are you sure you want to delete this user and all their data?")) return;
        
        try {
            await api.delete(`/admin/users/${_id}`);
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const filteredUsers = users.filter((u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                <header className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800 pb-2 flex items-center gap-3">
                            <Users className="text-blue-500" size={36} /> User Management
                        </h1>

                        <p className="text-gray-500 font-medium text-lg">Monitor and manage registered users.</p>
                    </div>
                </header>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="relative w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>

                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="text-sm font-semibold text-gray-500">
                            Total Users: <span className="text-blue-600 font-bold">{filteredUsers.length}</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-10 text-center text-gray-500">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">No users found.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold border-b border-gray-100">Name</th>
                                        <th className="p-4 font-semibold border-b border-gray-100">Email</th>
                                        <th className="p-4 font-semibold border-b border-gray-100">Joined Date</th>
                                        <th className="p-4 font-semibold border-b border-gray-100 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-bold text-gray-800">
                                                {user.firstName} {user.lastName}
                                            </td>

                                            <td className="p-4 text-gray-600">{user.email}</td>
                                            
                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-lg transition-colors font-semibold shadow-sm inline-flex items-center justify-center"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                                
                            </table>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminUsers;
