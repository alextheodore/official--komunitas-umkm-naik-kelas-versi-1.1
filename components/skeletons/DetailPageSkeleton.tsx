import React from 'react';

const DetailPageSkeleton: React.FC = () => (
    <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Image Gallery Skeleton */}
                <div>
                    <div className="bg-gray-200 h-96 w-full rounded-lg"></div>
                    <div className="mt-4 grid grid-cols-5 gap-4">
                        <div className="bg-gray-200 h-20 w-full rounded-md"></div>
                        <div className="bg-gray-200 h-20 w-full rounded-md"></div>
                        <div className="bg-gray-200 h-20 w-full rounded-md"></div>
                    </div>
                </div>

                {/* Info Skeleton */}
                <div className="space-y-6 pt-2">
                    <div className="bg-gray-200 h-5 w-1/4 rounded"></div>
                    <div className="bg-gray-200 h-10 w-full rounded"></div>
                    <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
                    <div className="bg-gray-200 h-8 w-1/3 rounded"></div>
                    <div className="space-y-3 pt-4">
                        <div className="bg-gray-200 h-4 w-full rounded"></div>
                        <div className="bg-gray-200 h-4 w-full rounded"></div>
                        <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg border mt-4">
                        <div className="flex items-center">
                            <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
                            <div className="ml-4 flex-grow space-y-2">
                                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                                <div className="bg-gray-200 h-3 w-1/3 rounded"></div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                        <div className="bg-gray-200 h-12 w-1/2 rounded-full"></div>
                        <div className="bg-gray-200 h-12 w-1/2 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
export default DetailPageSkeleton;