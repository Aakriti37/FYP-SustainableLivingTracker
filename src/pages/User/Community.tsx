import { useState, useEffect } from "react";
import { PlusSquare, Leaf } from "lucide-react";
import { getPosts, type Post } from "../../services/communityService";
import { useSocket } from "../../context/SocketContext";
import CreatePost from "./components/community/CreatePost";
import PostCard from "./components/community/PostCard";
import LeaderboardSection from "./components/community/LeaderboardSection";
import api from "../../services/api";

const Community = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const fetchedPosts = await getPosts();
                setPosts(fetchedPosts);

                const lbRes = await api.get('/community/leaderboard').catch(() => null);
                if (lbRes?.data) setLeaderboard(lbRes.data);

                const userRes = await api.get('/user/profile').catch(() => null);
                if (userRes?.data) setCurrentUser(userRes.data);
            } catch (error) {
                console.error("Failed to load community data", error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_post', (newPost: Post) => {
            setPosts(prev => {
                if (prev.some(p => p._id === newPost._id)) return prev;
                return [newPost, ...prev];
            });
        });

        socket.on('update_post', (updatedPost: Post) => {
            setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
        });

        socket.on('delete_post', (postId: string) => {
            setPosts(prev => prev.filter(p => p._id !== postId));
        });

        return () => {
            socket.off('new_post');
            socket.off('update_post');
            socket.off('delete_post');
        };
    }, [socket]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="max-w-[975px] mx-auto px-4 flex flex-col lg:flex-row lg:items-start gap-8 justify-center">

                {/* ── Main Feed ── */}
                <div className="w-full max-w-[600px] mx-auto lg:mx-0">

                    {/* Feed header */}
                    <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Leaf size={22} className="text-emerald-500" />
                            <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Eco Community</h1>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                        >
                            <PlusSquare size={16} />
                            New Post
                        </button>
                    </header>

                    {/* Stories-style "create post" shortcut */}
                    <div
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <div className="w-9 h-9 rounded-full shrink-0 bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                            {currentUser?.profilePicture
                                ? <img src={currentUser.profilePicture} alt="me" className="w-full h-full object-cover" />
                                : (currentUser?.firstName?.[0]?.toUpperCase() || 'Y')
                            }
                        </div>
                        <span className="text-[14px] text-gray-400 flex-1">
                            What's on your eco-journey today?
                        </span>
                        <div className="flex items-center gap-3 text-gray-400">
                            <span className="text-xs font-medium text-emerald-500 border border-emerald-200 rounded-lg px-2 py-1">Photo</span>
                        </div>
                    </div>

                    {/* Posts */}
                    {posts.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
                            <Leaf size={36} className="mx-auto text-emerald-300 mb-3" />
                            <h2 className="font-semibold text-[16px] text-gray-800 mb-1">No posts yet</h2>
                            <p className="text-gray-400 text-[13px] mb-5">Be the first to share something with the community!</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="text-emerald-500 font-semibold text-[13px] hover:text-emerald-600 transition-colors"
                            >
                                Create a post →
                            </button>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post._id} post={post} currentUser={currentUser} />
                        ))
                    )}
                </div>

                {/* ── Leaderboard sidebar (desktop only) ── */}
                <div className="hidden lg:block w-[300px] shrink-0 sticky top-8">
                    <LeaderboardSection leaderboard={leaderboard} />
                </div>
            </div>

            <CreatePost
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                currentUser={currentUser}
            />
        </div>
    );
};

export default Community;
