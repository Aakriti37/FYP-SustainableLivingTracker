import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Trash2, Send } from 'lucide-react';
import { toggleLike, addComment, deletePost, type Post } from '../../../../services/communityService';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
    post: Post;
    currentUser: any;
}

const PostCard = ({ post, currentUser }: PostCardProps) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const hasLiked = currentUser && post.likes.includes(currentUser._id);

    const handleLike = async () => {
        if (isLiking || !currentUser) return;
        setIsLiking(true);
        try {
            await toggleLike(post._id);
        } catch (error) {
            console.error("Failed to like", error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser) return;
        try {
            await addComment(post._id, commentText);
            setCommentText('');
            setShowAllComments(true);
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await deletePost(post._id);
            setShowMenu(false);
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const displayedComments = showAllComments ? post.comments : post.comments?.slice(-2);
    const avatarLetter = post.userId?.firstName?.[0]?.toUpperCase() || 'U';

    return (
        <article className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-offset-1 ring-emerald-400 shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold text-sm">
                        {post.userId?.profilePicture
                            ? <img src={post.userId.profilePicture} alt="avatar" className="w-full h-full object-cover" />
                            : avatarLetter
                        }
                    </div>
                    <div>
                        <p className="font-semibold text-[13px] text-gray-900 leading-tight">
                            {post.userId?.firstName} {post.userId?.lastName}
                        </p>
                        <p className="text-[11px] text-gray-400 leading-tight">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {/* 3-dot menu (owner only) */}
                {currentUser?._id === post.userId?._id && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(v => !v)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            <MoreHorizontal size={20} />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                                <button
                                    onClick={handleDelete}
                                    className="w-full text-left px-4 py-3 text-sm text-red-500 font-semibold hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Image (full-bleed) ── */}
            {post.image && (
                <div className="w-full bg-gray-50 border-y border-gray-100">
                    <img
                        src={post.image}
                        alt="Post"
                        onDoubleClick={handleLike}
                        loading="lazy"
                        className="w-full object-cover max-h-[600px] cursor-pointer"
                    />
                </div>
            )}

            {/* ── Action bar ── */}
            <div className="flex items-center gap-1 px-3 pt-3 pb-1">
                <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`p-2 rounded-full transition-all duration-150 hover:bg-red-50 active:scale-90 ${hasLiked ? 'text-red-500' : 'text-gray-700'}`}
                >
                    <Heart size={22} className={hasLiked ? 'fill-red-500' : ''} />
                </button>
                <button
                    onClick={() => document.getElementById(`comment-input-${post._id}`)?.focus()}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                >
                    <MessageCircle size={22} />
                </button>
            </div>

            {/* ── Likes count ── */}
            <div className="px-4 pb-1">
                <span className="text-[13px] font-semibold text-gray-900">
                    {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                </span>
            </div>

            {/* ── Caption ── */}
            {post.content && (
                <div className="px-4 pb-2">
                    <span className="text-[13px] font-semibold text-gray-900 mr-2">
                        {post.userId?.firstName} {post.userId?.lastName}
                    </span>
                    <span className="text-[13px] text-gray-800 leading-snug">{post.content}</span>
                </div>
            )}

            {/* ── Comments ── */}
            {post.comments?.length > 0 && (
                <div className="px-4 pb-2 space-y-1">
                    {post.comments.length > 2 && !showAllComments && (
                        <button
                            onClick={() => setShowAllComments(true)}
                            className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            View all {post.comments.length} comments
                        </button>
                    )}
                    {displayedComments?.map(comment => (
                        <div key={comment._id} className="flex gap-2 text-[13px]">
                            <span className="font-semibold text-gray-900 shrink-0">{comment.userId?.firstName}</span>
                            <span className="text-gray-700 break-words">{comment.text}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Add comment ── */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
                {/* Mini avatar */}
                <div className="w-7 h-7 rounded-full shrink-0 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {currentUser?.profilePicture
                        ? <img src={currentUser.profilePicture} alt="me" className="w-full h-full object-cover" />
                        : (currentUser?.firstName?.[0]?.toUpperCase() || 'U')
                    }
                </div>
                <form onSubmit={handleAddComment} className="flex-1 flex items-center gap-2">
                    <input
                        id={`comment-input-${post._id}`}
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Add a comment…"
                        className="flex-1 text-[13px] bg-transparent outline-none placeholder-gray-400 text-gray-900"
                        autoComplete="off"
                    />
                    {commentText.trim() && (
                        <button
                            type="submit"
                            className="text-emerald-500 hover:text-emerald-600 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    )}
                </form>
            </div>
        </article>
    );
};

export default PostCard;
