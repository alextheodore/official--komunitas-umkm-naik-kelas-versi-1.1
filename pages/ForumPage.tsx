import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ForumThread } from "../types";
import { supabase } from "../lib/supabase";
import { SearchIcon, ForumIcon } from "../components/icons";
import NewThreadModal from "../components/NewThreadModal";
import ThreadSkeleton from "../components/skeletons/ThreadSkeleton";
import { useAuth } from "../contexts/AuthContext";

const ForumPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("forum_threads")
        .select(
          `
                    *,
                    profiles:author_id (id, full_name, avatar_url, business_name),
                    forum_posts (id)
                `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped: ForumThread[] = data.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        author_id: t.author_id,
        author: {
          id: t.profiles.id,
          name: t.profiles.full_name,
          profilePicture:
            t.profiles.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              t.profiles.full_name
            )}`,
          businessName: t.profiles.business_name,
        },
        createdAt: t.created_at,
        views: t.views || 0,
        upvotes: t.upvotes || 0,
        downvotes: t.downvotes || 0,
        posts: t.forum_posts || [],
      }));

      setThreads(mapped);
    } catch (err) {
      console.error("Forum fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Forum Diskusi
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Berbagi pengetahuan, bertanya, dan berkolaborasi dengan sesama
            anggota UMKM.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari topik diskusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
            <SearchIcon className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" />
          </div>
          <button
            onClick={() =>
              currentUser
                ? setIsModalOpen(true)
                : alert("Silakan login untuk memulai diskusi.")
            }
            className="px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all transform hover:-translate-y-1"
          >
            Mulai Diskusi Baru
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => <ThreadSkeleton key={i} />)
          ) : filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <Link
                key={thread.id}
                to={`/forum/${thread.id}`}
                className="block p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-primary-300 hover:shadow-md transition-all animate-fade-in-up"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-600 mb-2 uppercase">
                      <span className="px-2 py-1 bg-primary-50 rounded">
                        {thread.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {thread.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <img
                        src={thread.author?.profilePicture}
                        className="h-8 w-8 rounded-full border border-gray-100"
                      />
                      <div className="text-sm">
                        <span className="font-bold text-gray-700">
                          {thread.author?.name}
                        </span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-500">
                          {new Date(thread.createdAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex gap-8 text-center text-sm">
                    <div>
                      <p className="font-extrabold text-gray-800">
                        {thread.posts.length}
                      </p>
                      <p className="text-gray-400">Balasan</p>
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-800">
                        {thread.views}
                      </p>
                      <p className="text-gray-400">Dilihat</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">Belum ada diskusi di sini.</p>
            </div>
          )}
        </div>
      </div>

      <NewThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddThread={() => {
          fetchThreads();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ForumPage;
