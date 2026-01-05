import React from 'react';

const PostSkeleton: React.FC = () => (
    <div className="flex space-x-4 py-6 border-t border-gray-200">
        <div className="bg-gray-200 h-12 w-12 rounded-full flex-shrink-0"></div>
        <div className="flex-grow space-y-3">
            <div className="flex justify-between items-center">
                <div className="bg-gray-200 h-5 w-1/3 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/5 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
            </div>
            <div className="flex items-center space-x-4 pt-2">
                <div className="bg-gray-200 h-8 w-24 rounded-md"></div>
                <div className="bg-gray-200 h-6 w-16 rounded-md"></div>
            </div>
        </div>
    </div>
);


const ForumThreadSkeleton: React.FC = () => (
    <div className="bg-gray-50 py-12 animate-pulse">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 space-y-3">
                    <div className="bg-gray-200 h-5 w-1/4 rounded"></div>
                    <div className="bg-gray-200 h-10 w-full rounded"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded mt-4"></div>
                </div>
                
                <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                     <div className="flex space-x-4">
                        <div className="bg-gray-200 h-12 w-12 rounded-full flex-shrink-0"></div>
                        <div className="flex-grow space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="bg-gray-200 h-5 w-1/3 rounded"></div>
                                <div className="bg-gray-200 h-4 w-1/5 rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="bg-gray-200 h-4 w-full rounded"></div>
                                <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                                <div className="bg-gray-200 h-4 w-full rounded"></div>
                            </div>
                            <div className="flex items-center space-x-4 pt-2">
                                <div className="bg-gray-200 h-8 w-24 rounded-md"></div>
                                <div className="bg-gray-200 h-6 w-16 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            </div>
        </div>
    </div>
);

export default ForumThreadSkeleton;