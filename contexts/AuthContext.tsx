
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AppUser } from '../types';
import { User, AuthResponse } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    currentUser: AppUser | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    wishlist: string[];
    isInWishlist: (productId: string) => boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    following: string[];
    isFollowing: (userId: string) => boolean;
    followUser: (userId: string) => Promise<void>;
    unfollowUser: (userId: string) => Promise<void>;
    updateProfile: (data: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [following, setFollowing] = useState<string[]>([]);

    useEffect(() => {
        // Cek sesi saat inisialisasi
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleUser(session?.user ?? null);
        });

        // Listen perubahan auth (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUser = async (supabaseUser: User | null) => {
        setUser(supabaseUser);
        if (supabaseUser) {
            try {
                // Ambil data dari tabel profiles yang dibuat oleh trigger SQL
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', supabaseUser.id)
                    .single();

                if (profile) {
                    setCurrentUser({
                        id: profile.id,
                        name: profile.full_name,
                        email: profile.email,
                        profilePicture: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`,
                        businessName: profile.business_name || 'Bisnis Baru',
                        role: profile.role as 'user' | 'admin',
                        joinDate: profile.created_at,
                        phoneNumber: profile.phone_number,
                        address: profile.address,
                        businessCategory: profile.business_type,
                        nib: profile.nib,
                        website: profile.website
                    });
                }
                
                // Fetch Wishlist & Following (Data Real)
                const [{ data: wishData }, { data: followData }] = await Promise.all([
                    supabase.from('wishlist').select('product_id').eq('user_id', supabaseUser.id),
                    supabase.from('following').select('followed_id').eq('follower_id', supabaseUser.id)
                ]);

                if (wishData) setWishlist(wishData.map(w => w.product_id));
                if (followData) setFollowing(followData.map(f => f.followed_id));
            } catch (err) {
                console.error("Gagal memuat profil user:", err);
            }
        } else {
            setCurrentUser(null);
            setWishlist([]);
            setFollowing([]);
        }
        setLoading(false);
    };

    const login = async (email: string, pass: string): Promise<AuthResponse> => {
        return await supabase.auth.signInWithPassword({ email, password: pass });
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const isInWishlist = (id: string) => wishlist.includes(id);
    const addToWishlist = async (id: string) => {
        if (!user) return;
        await supabase.from('wishlist').insert({ user_id: user.id, product_id: id });
        setWishlist(prev => [...prev, id]);
    };
    const removeFromWishlist = async (id: string) => {
        if (!user) return;
        await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', id);
        setWishlist(prev => prev.filter(x => x !== id));
    };

    const isFollowing = (id: string) => following.includes(id);
    const followUser = async (id: string) => {
        if (!user) return;
        await supabase.from('following').insert({ follower_id: user.id, followed_id: id });
        setFollowing(prev => [...prev, id]);
    };
    const unfollowUser = async (id: string) => {
        if (!user) return;
        await supabase.from('following').delete().eq('follower_id', user.id).eq('followed_id', id);
        setFollowing(prev => prev.filter(x => x !== id));
    };

    const updateProfile = async (profileData: Partial<AppUser>) => {
        if (!user) return;
        
        const dbData: any = {};
        if (profileData.name) dbData.full_name = profileData.name;
        if (profileData.businessName) dbData.business_name = profileData.businessName;
        if (profileData.phoneNumber) dbData.phone_number = profileData.phoneNumber;
        if (profileData.address) dbData.address = profileData.address;
        if (profileData.businessCategory) dbData.business_type = profileData.businessCategory;
        if (profileData.website) dbData.website = profileData.website;
        if (profileData.profilePicture) dbData.avatar_url = profileData.profilePicture;

        const { error } = await supabase.from('profiles').update(dbData).eq('id', user.id);
        if (error) throw error;
        
        if (currentUser) {
            setCurrentUser({ ...currentUser, ...profileData });
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, currentUser, loading, login, logout, 
            wishlist, isInWishlist, addToWishlist, removeFromWishlist,
            following, isFollowing, followUser, unfollowUser, updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
