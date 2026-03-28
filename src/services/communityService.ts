import api from './api';

export interface UserSnippet {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
}

export interface Comment {
    _id: string;
    userId: UserSnippet;
    text: string;
    createdAt: string;
}

export interface Post {
    _id: string;
    userId: UserSnippet;
    content?: string;
    image?: string;
    likes: string[]; // array of user IDs
    comments: Comment[];
    createdAt: string;
    likeCount?: number;
}

export const getPosts = async (): Promise<Post[]> => {
    const response = await api.get('/community/posts');
    return response.data;
};

export const createPost = async (postData: { content?: string, image?: string }): Promise<Post> => {
    const response = await api.post('/community/posts', postData);
    return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
    await api.delete(`/community/posts/${postId}`);
};

export const toggleLike = async (postId: string): Promise<Post> => {
    const response = await api.post(`/community/posts/${postId}/like`);
    return response.data;
};

export const addComment = async (postId: string, text: string): Promise<Post> => {
    const response = await api.post(`/community/posts/${postId}/comment`, { text });
    return response.data;
};
