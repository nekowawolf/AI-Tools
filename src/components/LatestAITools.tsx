'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGlobe } from 'react-icons/fa';
import { FallbackImage } from '@/components/FallbackImage';
import { Spinner } from '@/components/ui/spinner';
import Pagination2 from '@/components/Pagination2';
import { fetchAIToolsData } from '@/services/aiToolService';
import { AITool } from '@/types/aitool';

const ITEMS_PER_PAGE = 5;

export default function LatestAITools() {
    const router = useRouter();
    const [activities, setActivities] = useState<AITool[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchAIToolsData(false);
                const sortedData = [...data].sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateB - dateA;
                });
                setActivities(sortedData);
            } catch (error) {
                console.error('Failed to load AI Tool activity:', error);
                setActivities([]);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const totalItems = activities.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const displayedActivities = activities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    return (
        <>
            <div className="w-full mb-12 flex flex-col items-start text-left space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
                    /last-added-ai-tools
                </h1>
                <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
                    Latest AI Tools added to the directory by contributors.{' '}
                    <Link
                        href="/add-ai-tool"
                        className="text-blue-500 hover:text-blue-400 transition-colors font-medium cursor-pointer inline-block mt-1 sm:mt-0"
                    >
                        Add AI Tool
                    </Link>
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 w-full">
                    <Spinner className="text-blue-500 size-10" />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    {displayedActivities.length > 0 ? (
                        <div className="flex flex-col space-y-8 sm:space-y-10 w-full">
                            {displayedActivities.map((tool) => (
                                <div
                                    key={tool._id}
                                    onClick={() => {
                                        if (window.innerWidth >= 640) {
                                            router.push(`/directory/${tool._id}`);
                                        }
                                    }}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative transition-transform duration-300 sm:hover:translate-x-2 sm:cursor-pointer cursor-default w-full"
                                >
                                    <div
                                        onClick={() => {
                                            if (window.innerWidth < 640) {
                                                router.push(`/directory/${tool._id}`);
                                            }
                                        }}
                                        className="flex items-center gap-3 shrink-0 cursor-pointer w-fit min-w-0"
                                    >
                                        {tool.image_url ? (
                                            <FallbackImage
                                                src={tool.image_url}
                                                alt={tool.name}
                                                className="w-8 h-8 rounded-full object-cover border border-[var(--border-divider)] shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                                                <FaGlobe className="w-4 h-4" />
                                            </div>
                                        )}
                                        <span className="text-lg sm:text-xl font-bold text-fill-color group-hover:text-blue-500 transition-colors duration-300 tracking-tight truncate max-w-[200px] sm:max-w-[300px]">
                                            {tool.name}
                                        </span>
                                    </div>

                                    <span className="hidden sm:block flex-1 h-px bg-[var(--border-divider)] group-hover:bg-blue-500/30 transition-colors duration-300 mx-4" />

                                    <div className="flex items-center justify-start sm:justify-end shrink-0 min-w-0 mt-1 sm:mt-0">
                                        {tool.added_by?.name && (
                                            <div className="flex items-center gap-1.5 text-xs text-fill-color/60 font-mono mr-1.5">
                                                <span>added by</span>
                                                {tool.added_by.url ? (
                                                    <a
                                                        href={tool.added_by.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={(event) => event.stopPropagation()}
                                                        className="cursor-pointer font-semibold opacity-70 hover:opacity-100 transition-all text-fill-color"
                                                    >
                                                        {tool.added_by.name}
                                                    </a>
                                                ) : (
                                                    <span className="font-semibold text-fill-color">{tool.added_by.name}</span>
                                                )}
                                                {tool.created_at && <span className="text-fill-color/30 hidden sm:inline">·</span>}
                                            </div>
                                        )}

                                        <div className="relative flex items-center shrink-0 h-6 overflow-hidden w-[105px]">
                                            <div className="absolute inset-y-0 left-0 flex items-center text-xs text-fill-color/60 font-mono transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-full">
                                                {tool.created_at && (
                                                    <span>
                                                        {new Date(tool.created_at).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="absolute inset-y-0 left-0 flex items-center text-xs text-blue-500 font-mono transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap">
                                                View Details →
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-left py-12 text-fill-color/50 font-mono text-sm">
                            No activity found.
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination2
                                currentPage={currentPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalItems={totalItems}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
