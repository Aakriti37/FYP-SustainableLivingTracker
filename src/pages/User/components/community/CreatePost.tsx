// pages/User/components/community/CreatePost.tsx

import React, { useRef, useState, useEffect } from 'react';
import { Image, Loader2, X, Smile } from 'lucide-react';
import { createPost } from '../../../../services/communityService';
import api from '../../../../services/api';
import toast from 'react-hot-toast';

interface CreatePostProps {
    isOpen:       boolean;
    onClose:      () => void;
    currentUser?: any;
}

const CreatePost = ({ isOpen, onClose, currentUser }: CreatePostProps) => {
    const [content,      setContent]      = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl,   setPreviewUrl]   = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragOver,     setDragOver]     = useState(false);
    const fileInputRef  = useRef<HTMLInputElement>(null);
    const textareaRef   = useRef<HTMLTextAreaElement>(null);

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
        if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
        if (file.size > 10 * 1024 * 1024)   { toast.error('Image must be under 10MB');    return; }
        
        setSelectedFile(file);
        
        const reader = new FileReader();
        
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClose = () => { setContent(''); clearImage(); onClose(); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim() && !selectedFile) { toast.error('Add some text or an image'); return; }
        
        setIsSubmitting(true);
        
        try {
            let imageUrl = '';
            
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                
                const uploadRes = await api.post('/upload/image', formData);
                
                if (uploadRes.data?.success && uploadRes.data?.url) imageUrl = uploadRes.data.url;
                else throw new Error('Image upload failed');
            }
            await createPost({ content: content.trim() || undefined, image: imageUrl || undefined });
            
            toast.success('Posted!');
            handleClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const canPost       = (content.trim() || selectedFile) && !isSubmitting;
    const avatarLetter  = currentUser?.firstName?.[0]?.toUpperCase() || 'Y';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(2,34,2,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden flex flex-col border" style={{ borderColor: '#c5e3a0' }}>

                {/* Header */}
                <div className="relative flex items-center justify-center py-3 border-b" style={{ borderColor: '#e8f5d0' }}>
                    <h2 className="font-semibold text-sm" style={{ color: '#022202' }}>Create post</h2>
                    
                    <button
                        onClick={handleClose}
                        className="absolute right-3 p-1.5 rounded-full transition-colors"
                        style={{ color: '#4a7c2f' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f0f7e6')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
                    <div className="p-4 flex-1 overflow-y-auto">
                        {/* User row */}
                        <div className="flex items-center gap-3 mb-4">
                            
                            <div
                                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #022202, #17921f)' }}
                            >
                                {currentUser?.profilePicture
                                    ? <img src={currentUser.profilePicture} alt="me" className="w-full h-full object-cover" />
                                    : avatarLetter}
                            </div>

                            <p className="font-semibold text-sm" style={{ color: '#022202' }}>
                                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'You'}
                            </p>
                        </div>

                        {/* Caption text input */}
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Share an eco tip, achievement, or moment..."
                            rows={3}
                            className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
                            style={{ color: '#022202' }}
                        />

                        {/* Image preview */}
                        {previewUrl ? (
                            <div className="mt-3 relative rounded-xl overflow-hidden border" style={{ borderColor: '#c5e3a0' }}>
                                <button type="button" onClick={clearImage}
                                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full text-white"
                                    style={{ background: 'rgba(2,34,2,0.7)' }}>
                                    <X size={14} />
                                </button>

                                <img src={previewUrl} alt="Preview" className="w-full object-cover" style={{ maxHeight: '300px' }} />
                            </div>
                        ) : (
                            <div
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileSelect(f); }}
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-3 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
                                style={{ borderColor: dragOver ? '#508C12' : '#c5e3a0', background: dragOver ? '#f0f7e6' : '#f9fef5' }}
                            >
                                <Image size={26} className="mx-auto mb-2" style={{ color: '#c5e3a0' }} />
                                <p className="text-xs" style={{ color: '#4a7c2f' }}>
                                    Drag & drop or <span className="font-semibold" style={{ color: '#508C12' }}>browse</span> to add a photo
                                </p>

                                <p className="text-xs mt-1 opacity-60" style={{ color: '#4a7c2f' }}>PNG, JPG, WEBP up to 10MB</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: '#e8f5d0', background: '#f9fef5' }}>
                        <div className="flex items-center gap-1">
                            
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef}
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                            
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-lg transition-colors" style={{ color: '#508C12' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f0f7e6')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <Image size={20} />
                            </button>

                            <button type="button" className="p-2 rounded-lg transition-colors" style={{ color: '#c5e3a0' }}>
                                <Smile size={20} />
                            </button>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={!canPost}
                            className="font-semibold text-sm px-5 py-2 rounded-xl text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            style={{ background: '#508C12' }}
                            onMouseEnter={e => canPost && (e.currentTarget.style.background = '#3f7708')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
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
