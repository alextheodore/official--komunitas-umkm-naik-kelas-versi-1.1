
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface FollowButtonProps {
  // FIX: userId is string
  userId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const { currentUser, isFollowing, followUser, unfollowUser } = useAuth();

  if (!currentUser || currentUser.id === userId) {
    return null; // Don't show button for self or when not logged in
  }

  const following = isFollowing(userId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (following) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
        following
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-primary-600 text-white hover:bg-primary-700'
      }`}
    >
      {following ? 'Mengikuti' : 'Follow'}
    </button>
  );
};

export default FollowButton;
