'use client';

import { FallbackImage } from '@/components/FallbackImage';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { useAITools } from '@/hooks/useAITools';
import { Spinner } from '@/components/ui/spinner';

const ITEMS_PER_PAGE = 8;

const categories = [
    "Image",
    "Design",
    "All",
    "Video",
    "Audio",
    "Chatbot",
    "Coding",
    "3D",
    "Research",
];

import { Suspense } from 'react';

export default function AIToolsContent() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner className="text-blue-500 size-10" />
            </div>
        }>
            <AIToolsContentInner />
        </Suspense>
    );
}

function AIToolsContentInner() {
    const {
        displayedTools,
        loading,
        error,
        localSearchQuery,
        handleSearchChange,
        activeCategory,
        handleCategoryChange,
        currentPage,
        handlePageChange,
        totalPages,
        totalItems
    } = useAITools(ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen body-color text-fill-color p-8 pt-12 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="w-full max-w-2xl mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        AI Tools List
                    </h1>
                    <p className="text-fill-color/70 max-w-md mx-auto">
                        Explore our curated collection of powerful AI tools to boost your productivity and creativity.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-xl mb-6 relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-fill-color/50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                    <input
                        type="text"
                        placeholder="Search AI"
                        value={localSearchQuery}
                        onChange={handleSearchChange}
                        className="w-full py-3 pl-12 pr-6 rounded-full card-color border border-color focus:outline-none focus:border-blue-500 text-fill-color placeholder:text-fill-color/50 transition-colors"
                    />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium leading-none transition-colors duration-200 ${
                                activeCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'card-color text-fill-color/70 border border-color hover:!text-[var(--fill-color)] hover:!border-blue-600'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center p-12 w-full max-w-7xl">
                        <Spinner className="text-blue-500 size-10" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full items-center">
                        {error && (
                            <div className="text-red-500 text-center py-4 bg-red-500/10 rounded-lg border border-red-500/20 w-full max-w-7xl mb-4">
                                Error loading AI tools: {error}
                            </div>
                        )}

                        {/* Tools Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                            {displayedTools.length > 0 ? (
                                displayedTools.map((tool) => (
                                    <Link
                                        href={`/directory/${tool._id}`}
                                        key={tool._id}
                                        className="glass-card rounded-2xl p-5 flex flex-col items-center text-center h-full card-hover block"
                                    >
                                        <div className="mb-4 w-full aspect-square max-w-[80px] relative rounded-xl overflow-hidden bg-card-color mx-auto group-hover:scale-105 transition-transform">
                                            <FallbackImage
                                                src={tool.imgURL}
                                                alt={tool.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>

                                        <h3 className="text-lg font-bold text-fill-color mb-2">
                                            {tool.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5 justify-center">
                                            {tool.categories.map((cat, index) => (
                                                <span key={index} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full w-full flex-col flex gap-4">
                                    <div className="text-center py-10">
                                        <FallbackImage
                                            src="https://nekowawolf.github.io/cdn-images/images/2026/1771661079_pixchan.png"
                                            alt="No data found"
                                            width={176}
                                            height={176}
                                            className="mx-auto"
                                        />
                                        <p className="text-fill-color/50 mt-4">No data available.</p>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Pagination */}
                        {displayedTools.length > 0 && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalItems={totalItems}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}