'use client';

import { useState, useMemo, useEffect } from 'react';
import { FallbackImage } from '@/components/FallbackImage';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Pagination from '@/components/Pagination';
import aiToolsData from '@/data/ai-tools.json';

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

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function AIToolsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const searchQuery = searchParams.get('q') || '';
    const activeCategory = searchParams.get('category') || 'All';
    const currentPage = Number(searchParams.get('page')) || 1;
    const [shuffledData, setShuffledData] = useState<typeof aiToolsData>([]);

    useEffect(() => {
        setShuffledData(shuffleArray(aiToolsData));
    }, []);

    const updateURL = (newCategory: string, newQuery: string, newPage: number) => {
        const params = new URLSearchParams();
        if (newCategory !== 'All') params.set('category', newCategory);
        if (newQuery) params.set('q', newQuery);
        if (newPage > 1) params.set('page', newPage.toString());
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const filteredTools = useMemo(() => {
        const source = shuffledData.length > 0 ? shuffledData : aiToolsData;
        
        return source.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || (tool.categories && tool.categories.includes(activeCategory));
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory, shuffledData]);

    const totalItems = filteredTools.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const displayedTools = filteredTools.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleCategoryChange = (category: string) => {
        updateURL(category, searchQuery, 1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        updateURL(activeCategory, q, 1);
    };

    const handlePageChange = (page: number) => {
        updateURL(activeCategory, searchQuery, page);
    };

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
                        value={searchQuery}
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
                            className={`px-4 py-2 rounded-full text-sm font-medium leading-none transition-colors duration-200 ${
                                activeCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'card-color text-fill-color/70 hover:text-fill-color border border-color'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                    {displayedTools.length > 0 ? (
                        displayedTools.map((tool) => (
                            <Link
                                href={`/ai-tools/${tool.id}`}
                                key={tool.id}
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
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}