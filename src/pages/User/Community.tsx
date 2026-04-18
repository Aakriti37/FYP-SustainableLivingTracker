// pages/User/Community.tsx
// Fixed: removed duplicate create post shortcut, kept only New Post button

import { useState, useEffect } from "react";
import { PlusSquare, Leaf } from "lucide-react";
import { getPosts, type Post } from "../../services/communityService";
import { useSocket } from "../../context/SocketContext";
import CreatePost        from "./components/community/CreatePost";
import PostCard          from "./components/community/PostCard";
import LeaderboardSection from "./components/community/LeaderboardSection";
import api from "../../services/api";

const Community = () => {
    const [posts,             setPosts]             = useState<Post[]>([]);
    const [leaderboard,       setLeaderboard]       = useState([]);
    const [currentUser,       setCurrentUser]       = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const fetchedPosts = await getPosts();
                setPosts(fetchedPosts);

                const [lbRes, userRes] = await Promise.all([
                    api.get('/community/leaderboard').catch(() => null),
                    api.get('/user/profile').catch(() => null),
                ]);
                if (lbRes?.data)   setLeaderboard(lbRes.data);
                if (userRes?.data) setCurrentUser(userRes.data);
            } catch (error) {
                console.error("Failed to load community data", error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('new_post',    (newPost: Post)     => setPosts(prev => prev.some(p => p._id === newPost._id) ? prev : [newPost, ...prev]));
        socket.on('update_post', (updated: Post)     => setPosts(prev => prev.map(p => p._id === updated._id ? updated : p)));
        socket.on('delete_post', (postId: string)    => setPosts(prev => prev.filter(p => p._id !== postId)));
        return () => { socket.off('new_post'); socket.off('update_post'); socket.off('delete_post'); };
    }, [socket]);

    return (
        <div className="min-h-screen py-8 font-sans" style={{ background: '#f0f7e6' }}>
            <div className="max-w-[975px] mx-auto px-4 flex flex-col lg:flex-row lg:items-start gap-8 justify-center">

                {/* ── Main Feed ── */}
                <div className="w-full max-w-[600px] mx-auto lg:mx-0">

                    {/* Feed header — ONE button only */}
                    <header className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: '#c5e3a0' }}>
                        <div className="flex items-center gap-2">
                            <Leaf size={22} style={{ color: '#508C12' }} />
                            <h1 className="text-xl font-bold" style={{ color: '#022202' }}>Eco Community</h1>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
                            style={{ background: '#508C12' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                        >
                            <PlusSquare size={16} /> New Post
                        </button>
                    </header>

                    {/* Posts list */}
                    {posts.length === 0 ? (
                        <div className="bg-white border rounded-2xl p-10 text-center" style={{ borderColor: '#c5e3a0' }}>
                            <Leaf size={36} className="mx-auto mb-3 opacity-30" style={{ color: '#508C12' }} />
                            <h2 className="font-semibold text-lg mb-1" style={{ color: '#022202' }}>No posts yet</h2>
                            <p className="text-sm mb-5" style={{ color: '#4a7c2f' }}>
                                Be the first to share something!
                            </p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="font-bold underline"
                                style={{ color: '#508C12' }}
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

                {/* ── Leaderboard sidebar ── */}
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
