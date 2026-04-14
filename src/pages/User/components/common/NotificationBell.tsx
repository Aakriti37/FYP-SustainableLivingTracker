// components/common/NotificationBell.tsx

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, X, Target, Zap, Award, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";

interface Notification {
    _id:       string;
    type:      string;
    title:     string;
    message:   string;
    isRead:    boolean;
    link?:     string;
    createdAt: string;
}

const TYPE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
    habit_reminder:   { icon: <Zap size={14} />,          color: '#508C12' },
    goal_deadline:    { icon: <Target size={14} />,        color: '#d97706' },
    goal_completed:   { icon: <Check size={14} />,         color: '#17921f' },
    badge_earned:     { icon: <Award size={14} />,         color: '#5cbd36' },
    streak_milestone: { icon: <AlertTriangle size={14} />, color: '#ea580c' },
};

const NotificationBell = ({ isUser }: { isUser: boolean }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount,   setUnreadCount]   = useState(0);
    const [isOpen,        setIsOpen]        = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate    = useNavigate();
    const { user }    = useAuth();

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_URL}/notifications`);
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch {
            // silent fail
        }
    };

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    // Poll every 30 seconds for new notifications
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await axios.patch(`${API_URL}/notifications/read-all`);
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch {
            // silent fail
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await axios.delete(`${API_URL}/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch {
            // silent fail
        }
    };

    const handleNotificationClick = async (notif: Notification) => {
        // Mark as read
        if (!notif.isRead) {
            await axios.patch(`${API_URL}/notifications/${notif._id}/read`).catch(() => {});
            setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        // Navigate
        if (notif.link) navigate(notif.link);
        setIsOpen(false);
    };

    const iconStyle = isUser
        ? { color: 'rgba(212,237,170,0.85)' }
        : { color: '#508C12' };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full transition-colors relative"
                style={iconStyle}
                onMouseEnter={e => (e.currentTarget.style.background = isUser ? 'rgba(255,255,255,0.1)' : '#f0f7e6')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span
                        className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full text-white text-xs font-bold flex items-center justify-center px-1"
                        style={{ background: '#ef4444', fontSize: '10px' }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50"
                    style={{ background: 'white', borderColor: '#c5e3a0' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#e8f5d0' }}>
                        <h3 className="font-bold text-sm" style={{ color: '#022202' }}>
                            Notifications {unreadCount > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs" style={{ background: '#f0f7e6', color: '#508C12' }}>
                                    {unreadCount} new
                                </span>
                            )}
                        </h3>
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
                            <button onClick={() => setIsOpen(false)} style={{ color: '#4a7c2f' }}>
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto divide-y" style={{ divideColor: '#e8f5d0' }}>
                        {notifications.length === 0 ? (
                            <div className="text-center py-10 text-sm" style={{ color: '#4a7c2f' }}>
                                <Bell size={28} className="mx-auto mb-2 opacity-30" style={{ color: '#508C12' }} />
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(notif => {
                                const typeInfo = TYPE_ICONS[notif.type] || TYPE_ICONS.habit_reminder;
                                return (
                                    <div
                                        key={notif._id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className="px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors"
                                        style={{ background: notif.isRead ? 'white' : '#f9fef5' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#f0f7e6')}
                                        onMouseLeave={e => (e.currentTarget.style.background = notif.isRead ? 'white' : '#f9fef5')}
                                    >
                                        {/* Icon */}
                                        <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                            style={{ background: '#f0f7e6', color: typeInfo.color }}
                                        >
                                            {typeInfo.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold" style={{ color: '#022202' }}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: '#4a7c2f' }}>
                                                {notif.message}
                                            </p>
                                            <p className="text-xs mt-1 opacity-60" style={{ color: '#4a7c2f' }}>
                                                {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>

                                        {/* Unread dot + delete */}
                                        <div className="flex flex-col items-center gap-2 shrink-0">
                                            {!notif.isRead && (
                                                <span className="w-2 h-2 rounded-full" style={{ background: '#508C12' }} />
                                            )}
                                            <button
                                                onClick={e => handleDelete(notif._id, e)}
                                                className="p-1 rounded transition-colors opacity-50 hover:opacity-100"
                                                style={{ color: '#ef4444' }}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
