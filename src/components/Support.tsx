'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BiLogoBitcoin } from 'react-icons/bi';
import { SiKofi } from 'react-icons/si';
import { Spinner } from '@/components/ui/spinner';
import Pagination2 from '@/components/Pagination2';
import { fetchSupportersData } from '@/services/supporterService';
import { Supporter } from '@/types/supporter';

const ITEMS_PER_PAGE = 5;

export default function Support() {
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function loadData() {
            const data = await fetchSupportersData();
            setSupporters([...data].sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
            }));
            setLoading(false);
        }

        loadData();
    }, []);

    const totalItems = supporters.length;
    const displayedSupporters = supporters.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <section aria-labelledby="support-us-title">
            <div className="w-full mt-24 mb-12 flex flex-col items-start text-left space-y-2">
                <h2 id="support-us-title" className="text-xl sm:text-2xl font-bold font-sans tracking-tight">/support-us</h2>
                <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
                    Support{' '}
                    <a href="https://www.nekowawolf.xyz/ecosystem" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 text-fill-color font-semibold">
                        nww ecosystem
                    </a>{' '}
                    and help us keep building.{' '}
                    <Link href="/support-us" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
                        Support Us
                    </Link>
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-10 w-full"><Spinner className="text-blue-500 size-10" /></div>
            ) : displayedSupporters.length > 0 ? (
                <div className="flex flex-col space-y-8 sm:space-y-10 w-full">
                    {displayedSupporters.map((supporter) => (
                        <div key={supporter._id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-transform duration-300 sm:hover:translate-x-2">
                            <div className="min-w-0">
                                {supporter.url ? (
                                    <a href={supporter.url} target="_blank" rel="noopener noreferrer" className="font-semibold opacity-70 hover:opacity-100 text-fill-color truncate block max-w-[300px]">
                                        {supporter.name}
                                    </a>
                                ) : (
                                    <span className="font-semibold text-fill-color truncate block max-w-[300px]">{supporter.name}</span>
                                )}
                            </div>
                            <span className="hidden sm:block flex-1 h-px bg-[var(--border-divider)] group-hover:bg-blue-500/30 transition-colors mx-4" />
                            <div className="flex items-center gap-2 text-xs text-fill-color/60 font-mono shrink-0">
                                {supporter.platform === 'Ko-fi' ? <SiKofi className="text-[#FF5E5B]" /> : <BiLogoBitcoin className="text-[#F7931A]" />}
                                <span>{supporter.platform}</span>
                                {supporter.created_at && <span className="text-fill-color/30">·</span>}
                                {supporter.created_at && new Date(supporter.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    ))}
                    <Pagination2 currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={totalItems} onPageChange={setCurrentPage} />
                </div>
            ) : (
                <div className="text-left py-12 text-fill-color/50 font-mono text-sm">No supporters found yet.</div>
            )}
        </section>
    );
}