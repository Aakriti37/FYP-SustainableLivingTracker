import { useState, useEffect } from "react";
import { MessageSquare, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";


type Post = {
    image: any;
    _id: string;
    content: string;
    userId: { firstName: string; lastName: string; email: string };
    likes: string[];
    createdAt: string;
};

const AdminPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPosts = async () => {
        try {
            const res = await api.get("/admin/posts");
            setPosts(res.data);
        } catch (error: any) {
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeletePost = async (_id: string) => {
        if (!window.confirm("Delete this post permanently?")) return;
        try {
            await api.delete("/admin/posts/${id}");
            toast.success("Post deleted");
            fetchPosts();
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    // const filteredPosts = posts.filter((p) =>
    //     p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     `${p.userId?.firstName} ${p.userId?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredPosts = posts.filter((p) =>
        (p.content?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (`${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                <header className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800 pb-2 flex items-center gap-3">
                            <MessageSquare className="text-purple-500" size={36} /> Community Posts
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">Moderate user generated content.</p>
                    </div>
                </header>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="relative w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search posts or authors..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm font-semibold text-gray-500">
                            Total Posts: <span className="text-purple-600 font-bold">{filteredPosts.length}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-10 text-center text-gray-500">Loading posts...</div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">No posts found.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold border-b border-gray-100 w-1/4">Author</th>
                                        <th className="p-4 font-semibold border-b border-gray-100 w-1/6">Image</th>
                                        <th className="p-4 font-semibold border-b border-gray-100 w-1/2">Content</th>
                                        <th className="p-4 font-semibold border-b border-gray-100 w-1/6">Date</th>
                                        <th className="p-4 font-semibold border-b border-gray-100 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredPosts.map((post) => (
                                        <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-gray-800">{post.userId?.firstName} {post.userId?.lastName}</p>
                                                <p className="text-xs text-gray-500">{post.userId?.email}</p>
                                            </td>

                                            <td className="p-4">
                                                {post.image ? (
                                                    <img
                                                    src={post.image}  // use `post.image` exactly
                                                    alt="Post"
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No Image</span>
                                                )}
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                <p className="line-clamp-2">{post.content}</p>
                                            </td>

                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeletePost(post._id)}
                                                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-lg transition-colors font-semibold shadow-sm inline-flex items-center justify-center"
                                                    title="Delete Post"
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

export default AdminPosts;
