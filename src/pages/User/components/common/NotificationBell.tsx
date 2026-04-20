// components/common/NotificationBell.tsx

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, X, Target, Zap, Award, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

interface Notification {
    _id:       string;
    type:      string;
    title:     string;
    message:   string;
    isRead:    boolean;
    link?:     string;
    createdAt: string;
}

const TYPE_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    habit_reminder:   { icon: <Zap size={13} />,           color: '#508C12', bg: '#f0f7e6' },
    goal_deadline:    { icon: <Target size={13} />,         color: '#d97706', bg: '#fffbeb' },
    goal_completed:   { icon: <Check size={13} />,          color: '#17921f', bg: '#f0fdf4' },
    badge_earned:     { icon: <Award size={13} />,          color: '#7c3aed', bg: '#f5f3ff' },
    streak_milestone: { icon: <AlertTriangle size={13} />,  color: '#ea580c', bg: '#fff7ed' },
};

const NotificationBell = ({ isUser }: { isUser: boolean }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount,   setUnreadCount]   = useState(0);
    const [isOpen,        setIsOpen]        = useState(false);
    const [loading,       setLoading]       = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate    = useNavigate();
    const { user }    = useAuth();

    const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/notifications`);
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when user changes
    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    // Also fetch when bell is opened
    const handleBellClick = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) fetchNotifications();
    };

    // Poll every 30s
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await axios.patch(`${API_URL}/notifications/read-all`);
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all read:', err);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await axios.delete(`${API_URL}/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            setUnreadCount(prev => {
                const wasUnread = notifications.find(n => n._id === id && !n.isRead);
                return wasUnread ? Math.max(0, prev - 1) : prev;
            });
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.isRead) {
            try {
                await axios.patch(`${API_URL}/notifications/${notif._id}/read`);
                setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch { /* silent */ }
        }
        if (notif.link) navigate(notif.link);
        setIsOpen(false);
    };

    const bellColor = isUser ? 'rgba(212,237,170,0.85)' : '#508C12';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                onClick={handleBellClick}
                className="p-2 rounded-full transition-colors relative"
                style={{ color: bellColor }}
                onMouseEnter={e => (e.currentTarget.style.background = isUser ? 'rgba(255,255,255,0.1)' : '#f0f7e6')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span
                        className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full text-white flex items-center justify-center font-bold border-2 border-white"
                        style={{ background: '#ef4444', fontSize: '10px', padding: '0 3px' }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50"
                    style={{ background: 'white', borderColor: '#e8f5d0' }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 border-b"
                        style={{ borderColor: '#e8f5d0', background: '#f9fef5' }}
                    >
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm" style={{ color: '#022202' }}>
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span
                                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                                    style={{ background: '#f0f7e6', color: '#508C12' }}
                                >
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs font-semibold transition-colors"
                                    style={{ color: '#508C12' }}
                                >
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded transition-colors"
                                style={{ color: '#4a7c2f' }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="py-8 text-center text-sm" style={{ color: '#4a7c2f' }}>
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-10 text-center">
                                <Bell size={28} className="mx-auto mb-2 opacity-20" style={{ color: '#508C12' }} />
                                <p className="text-sm font-medium" style={{ color: '#4a7c2f' }}>
                                    No notifications yet
                                </p>
                                <p className="text-xs mt-1 opacity-60" style={{ color: '#4a7c2f' }}>
                                    Complete habits and goals to get notified!
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#e8f5d0]">
                                {notifications.map(notif => {
                                    const typeInfo = TYPE_ICONS[notif.type] ?? TYPE_ICONS.habit_reminder;
                                    return (
                                        <div
                                            key={notif._id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className="px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors"
                                            style={{ background: notif.isRead ? 'white' : '#f9fef5' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#f0f7e6')}
                                            onMouseLeave={e => (e.currentTarget.style.background = notif.isRead ? 'white' : '#f9fef5')}
                                        >
                                            {/* Type icon */}
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                                style={{ background: typeInfo.bg, color: typeInfo.color }}
                                            >
                                                {typeInfo.icon}
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold leading-snug" style={{ color: '#022202' }}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs mt-0.5 leading-snug" style={{ color: '#4a7c2f' }}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs mt-1 opacity-50" style={{ color: '#4a7c2f' }}>
                                                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>

                                            {/* Right side */}
                                            <div className="flex flex-col items-center gap-2 shrink-0 ml-1">
                                                {!notif.isRead && (
                                                    <span
                                                        className="w-2 h-2 rounded-full shrink-0"
                                                        style={{ background: '#508C12' }}
                                                    />
                                                )}
                                                <button
                                                    onClick={e => handleDelete(notif._id, e)}
                                                    className="p-1 rounded transition-colors opacity-40 hover:opacity-100"
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div
                            className="px-4 py-2.5 border-t text-center"
                            style={{ borderColor: '#e8f5d0', background: '#f9fef5' }}
                        >
                            <button
                                onClick={() => { fetchNotifications(); }}
                                className="text-xs font-semibold transition-colors"
                                style={{ color: '#508C12' }}
                            >
                                Refresh
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
