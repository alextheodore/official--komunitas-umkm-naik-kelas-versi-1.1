
import type { ForumUser, ForumThread, ForumPost } from '../types';

// FIX: Changed IDs from number to string to match ForumUser interface
export const forumUsers: ForumUser[] = [
    { id: '102', name: 'Rina Susanti', profilePicture: 'https://picsum.photos/seed/testi2/100/100', businessName: 'Kriya Kulit Rina' },
    { id: '103', name: 'Budi Santoso', profilePicture: 'https://picsum.photos/seed/testi1/100/100', businessName: 'Kedai Kopi Maju' },
    { id: '104', name: 'Siti Aminah', profilePicture: 'https://picsum.photos/seed/user1/100/100', businessName: 'Kue Lezat Siti' },
    { id: '101', name: 'Andi Pratama', profilePicture: 'https://picsum.photos/seed/testi3/100/100', businessName: 'Garmen Andi Jaya' },
];

const generatePosts = (threadId: string, author: ForumUser, content: string): ForumPost[] => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - (parseInt(threadId) * 2));
    
    // FIX: Added author_id to ForumPost mock data
    return [
        { id: `${threadId}-1`, author_id: author.id, author, content, timestamp: baseDate.toISOString(), upvotes: 25 + parseInt(threadId), downvotes: 2 },
        { id: `${threadId}-2`, author_id: forumUsers[1].id, author: forumUsers[1], content: "Sangat setuju! Ini tips yang bagus sekali, terutama untuk pemula. Terima kasih sudah berbagi.", timestamp: new Date(baseDate.getTime() + 60000 * 5).toISOString(), upvotes: 15, downvotes: 0 },
        { id: `${threadId}-3`, author_id: forumUsers[2].id, author: forumUsers[2], content: "Saya sudah coba terapkan beberapa poin di sini and hasilnya lumayan terlihat. Poin nomor 3 paling berdampak untuk bisnis saya.", timestamp: new Date(baseDate.getTime() + 60000 * 15).toISOString(), upvotes: 8, downvotes: 1 },
        { id: `${threadId}-4`, author_id: author.id, author, content: "Senang bisa membantu! Ada yang punya pengalaman berbeda mungkin?", timestamp: new Date(baseDate.getTime() + 60000 * 25).toISOString(), upvotes: 5, downvotes: 0 },
    ];
};

export const allForumThreads: ForumThread[] = [
    {
        id: '1',
        title: 'Bagaimana cara terbaik memulai promosi di Instagram untuk produk kuliner?',
        category: 'Pemasaran',
        author_id: forumUsers[2].id,
        author: forumUsers[2], // Siti Aminah
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        views: 258,
        posts: generatePosts('1', forumUsers[2], "Halo semua, saya baru mulai bisnis kue online and masih bingung soal promosi di Instagram. Ada yang punya tips jitu? Haruskah saya pakai ads atau endorse selebgram? Terima kasih!"),
        upvotes: 88,
        downvotes: 5,
    },
    {
        id: '2',
        title: 'Tips mengelola keuangan untuk UMKM yang baru berjalan',
        category: 'Manajemen',
        author_id: forumUsers[3].id,
        author: forumUsers[3], // Andi Pratama
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        views: 450,
        posts: generatePosts('2', forumUsers[3], "Penting banget buat kita sebagai pelaku UMKM untuk melek finansial sejak awal. Beberapa hal yang saya pelajari: 1. Pisahkan rekening pribadi & bisnis. 2. Catat semua pemasukan & pengeluaran sekecil apapun. 3. Buat anggaran bulanan. Ada yang mau menambahkan?"),
        upvotes: 125,
        downvotes: 3,
    },
    {
        id: '3',
        title: 'Mencari supplier kulit berkualitas di area Jabodetabek',
        category: 'Tips Bisnis',
        author_id: forumUsers[0].id,
        author: forumUsers[0], // Rina Susanti
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        views: 120,
        posts: generatePosts('3', forumUsers[0], "Teman-teman pengrajin kulit, boleh minta rekomendasinya untuk supplier kulit sapi yang bagus di area Jakarta and sekitarnya? Saya butuh untuk produksi tas. Terima kasih!"),
        upvotes: 42,
        downvotes: 1,
    },
    {
        id: '4',
        title: 'Apakah worth it ikut bazar offline di masa sekarang?',
        category: 'Lainnya',
        author_id: forumUsers[1].id,
        author: forumUsers[1], // Budi Santoso
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        views: 310,
        posts: generatePosts('4', forumUsers[1], "Dengan maraknya penjualan online, apakah masih relevan untuk ikut pameran atau bazar offline? Biayanya kan lumayan. Mohon sharing pengalamannya ya."),
        upvotes: 67,
        downvotes: 10,
    },
];
