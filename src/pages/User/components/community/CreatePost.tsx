import React, { useRef, useState, useEffect } from 'react';
import { Image, Loader2, X, Smile } from 'lucide-react';
import { createPost } from '../../../../services/communityService';
import api from '../../../../services/api';
import toast from 'react-hot-toast';

interface CreatePostProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser?: any;
}

const CreatePost = ({ isOpen, onClose, currentUser }: CreatePostProps) => {
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => textareaRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be under 10MB');
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const clearImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClose = () => {
        setContent('');
        clearImage();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !selectedFile) {
            toast.error('Add some text or an image');
            return;
        }

        setIsSubmitting(true);
        try {
            let imageUrl = '';

            // Step 1: Upload image to Cloudinary via your backend
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);

                // Do NOT set Content-Type manually — axios sets multipart boundaries automatically
                const uploadRes = await api.post('/upload/image', formData);

                if (uploadRes.data?.success && uploadRes.data?.url) {
                    imageUrl = uploadRes.data.url;
                } else {
                    throw new Error('Image upload failed — check Cloudinary config');
                }
            }

            // Step 2: Create the post with optional imageUrl
            await createPost({
                content: content.trim() || undefined,
                image: imageUrl || undefined,
            });

            toast.success('Posted!');
            handleClose();
        } catch (error: any) {
            console.error('Post creation error:', error);
            const msg = error.response?.data?.message || error.message || 'Failed to create post';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canPost = (content.trim() || selectedFile) && !isSubmitting;
    const avatarLetter = currentUser?.firstName?.[0]?.toUpperCase() || 'Y';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-150">

                {/* ── Header ── */}
                <div className="relative flex items-center justify-center py-3 border-b border-gray-100">
                    <h2 className="font-semibold text-[15px] text-gray-900">Create post</h2>
                    <button
                        onClick={handleClose}
                        className="absolute right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Body ── */}
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
                    <div className="p-4 flex-1 overflow-y-auto">

                        {/* User row */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full shrink-0 bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                {currentUser?.profilePicture
                                    ? <img src={currentUser.profilePicture} alt="me" className="w-full h-full object-cover" />
                                    : avatarLetter
                                }
                            </div>
                            <div>
                                <p className="font-semibold text-[14px] text-gray-900">
                                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'You'}
                                </p>
                            </div>
                        </div>

                        {/* Text input */}
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Share an eco tip, achievement, or moment..."
                            rows={3}
                            className="w-full bg-transparent border-none outline-none resize-none text-[16px] text-gray-900 placeholder-gray-400 leading-relaxed"
                        />

                        {/* Image preview */}
                        {previewUrl ? (
                            <div className="mt-3 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 z-10 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full object-cover max-h-[350px]"
                                />
                            </div>
                        ) : (
                            /* Drag & drop zone — only shown when no image selected */
                            <div
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`mt-3 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'}`}
                            >
                                <Image size={28} className="mx-auto mb-2 text-gray-300" />
                                <p className="text-[13px] text-gray-400">
                                    Drag & drop or <span className="text-emerald-500 font-semibold">browse</span> to add a photo
                                </p>
                                <p className="text-[11px] text-gray-300 mt-1">PNG, JPG, WEBP up to 10MB</p>
                            </div>
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/60">
                        <div className="flex items-center gap-1">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                title="Add photo"
                                className="p-2 rounded-lg hover:bg-gray-100 text-emerald-500 transition-colors"
                            >
                                <Image size={20} />
                            </button>
                            <button
                                type="button"
                                title="Add emoji (coming soon)"
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                            >
                                <Smile size={20} />
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!canPost}
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-[14px] px-5 py-2 rounded-xl transition-colors flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                            {isSubmitting ? 'Posting…' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
