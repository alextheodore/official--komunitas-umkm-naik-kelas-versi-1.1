
import type { AppUser } from '../types';

// FIX: Changed IDs from number to string to match AppUser interface
export const allUsersData: AppUser[] = [
    {
        id: '1',
        name: 'Admin Komunitas',
        email: 'admin@example.com',
        profilePicture: 'https://picsum.photos/seed/admin/100/100',
        businessName: 'Komunitas UMKM',
        role: 'admin',
        joinDate: '2024-01-01',
    },
    {
        id: '101',
        name: 'Andi Pratama',
        email: 'andi.p@example.com',
        profilePicture: 'https://picsum.photos/seed/testi3/100/100',
        businessName: 'Garmen Andi Jaya',
        role: 'user',
        joinDate: '2024-05-20',
    },
    {
        id: '102',
        name: 'Rina Susanti',
        email: 'rina.s@example.com',
        profilePicture: 'https://picsum.photos/seed/testi2/100/100',
        businessName: 'Kriya Kulit Rina',
        role: 'user',
        joinDate: '2024-04-15',
    },
    {
        id: '103',
        name: 'Budi Santoso',
        email: 'budi.s@example.com',
        profilePicture: 'https://picsum.photos/seed/testi1/100/100',
        businessName: 'Kedai Kopi Maju',
        role: 'user',
        joinDate: '2024-03-10',
    },
    {
        id: '104',
        name: 'Siti Aminah',
        email: 'siti.a@example.com',
        profilePicture: 'https://picsum.photos/seed/user1/100/100',
        businessName: 'Kue Lezat Siti',
        role: 'user',
        joinDate: '2024-06-01',
    },
    {
        id: '105',
        name: 'Joko Widodo',
        email: 'joko.w@example.com',
        profilePicture: 'https://picsum.photos/seed/user2/100/100',
        businessName: 'Mebel Jati Jepara',
        role: 'user',
        joinDate: '2024-06-05',
    }
];
