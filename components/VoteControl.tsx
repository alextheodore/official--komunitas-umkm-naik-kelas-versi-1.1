import React, { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

interface VoteControlProps {
  initialUpvotes: number;
  initialDownvotes: number;
  direction?: 'row' | 'col';
}

const VoteControl: React.FC<VoteControlProps> = ({ initialUpvotes, initialDownvotes, direction = 'col' }) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleUpvote = () => {
    if (userVote === 'up') {
      // User is removing their upvote
      setUpvotes(prev => prev - 1);
      setUserVote(null);
    } else if (userVote === 'down') {
      // User is changing their vote from down to up
      setUpvotes(prev => prev + 1);
      setDownvotes(prev => prev - 1);
      setUserVote('up');
    } else {
      // User is casting a new upvote
      setUpvotes(prev => prev + 1);
      setUserVote('up');
    }
  };
  
  const handleDownvote = () => {
    if (userVote === 'down') {
      // User is removing their downvote
      setDownvotes(prev => prev - 1);
      setUserVote(null);
    } else if (userVote === 'up') {
      // User is changing their vote from up to down
      setDownvotes(prev => prev + 1);
      setUpvotes(prev => prev - 1);
      setUserVote('down');
    } else {
      // User is casting a new downvote
      setDownvotes(prev => prev + 1);
      setUserVote('down');
    }
  };

  const score = upvotes - downvotes;

  const layoutClasses = {
    row: 'flex-row items-center space-x-1',
    col: 'flex-col items-center space-y-1'
  };

  const buttonSize = direction === 'col' ? 'h-7 w-7' : 'h-6 w-6';

  return (
    <div className={`flex ${layoutClasses[direction]}`}>
        <button
            onClick={handleUpvote}
            aria-label="Upvote"
            className={`p-1 rounded-md transition-colors ${userVote === 'up' ? 'text-orange-500 bg-orange-100' : 'text-gray-500 hover:bg-gray-100'}`}
        >
            <ArrowUpIcon className={buttonSize} />
        </button>
        <span className="font-bold text-gray-800 text-sm min-w-[2rem] text-center">{score}</span>
        <button
            onClick={handleDownvote}
            aria-label="Downvote"
            className={`p-1 rounded-md transition-colors ${userVote === 'down' ? 'text-blue-600 bg-blue-100' : 'text-gray-500 hover:bg-gray-100'}`}
        >
            <ArrowDownIcon className={buttonSize} />
        </button>
    </div>
  );
};

export default VoteControl;