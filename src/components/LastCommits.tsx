'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaCheck, FaCode, FaExternalLinkAlt } from 'react-icons/fa';
import { FaCodeCommit } from 'react-icons/fa6';
import { PiDotsThreeFill } from 'react-icons/pi';
import { RxDotsHorizontal } from 'react-icons/rx';
import { Spinner } from '@/components/ui/spinner';

const REPOSITORY_URL = 'https://github.com/nekowawolf/AI-Tools';

interface Commit {
    sha: string;
    html_url: string;
    author?: {
        avatar_url?: string;
        login?: string;
    };
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
}

function CommitMobileDropdown({ commitUrl, treeUrl }: { commitUrl: string; treeUrl: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative sm:hidden" ref={dropdownRef}>
            <button
                type="button"
                aria-label="Open commit actions"
                onClick={(event) => {
                    event.stopPropagation();
                    setIsOpen((open) => !open);
                }}
                className="p-1 text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] rounded-md transition-colors cursor-pointer flex items-center justify-center"
            >
                <RxDotsHorizontal className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-max min-w-[210px] rounded-xl bg-[var(--card-color)] border border-[var(--border-divider)] shadow-xl overflow-hidden right-0 origin-top-right py-1">
                    <a
                        href={commitUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-fill-color/70 hover:bg-blue-500/10 hover:text-blue-400 transition-colors whitespace-nowrap"
                    >
                        <FaCodeCommit className="w-4 h-4 shrink-0" />
                        <span className="font-medium">View commit details</span>
                    </a>
                    <a
                        href={treeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-fill-color/70 hover:bg-blue-500/10 hover:text-blue-400 transition-colors whitespace-nowrap"
                    >
                        <FaCode className="w-4 h-4 shrink-0" />
                        <span className="font-medium">Browse repository at this point</span>
                    </a>
                </div>
            )}
        </div>
    );
}

function CommitMessage({ message, url }: { message: string; url: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const subject = message.split('\n')[0];
    const body = message.substring(subject.length).trim();

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-sm font-bold text-fill-color hover:text-blue-500 transition-colors ${!isExpanded ? 'line-clamp-1' : 'break-words'}`}
                >
                    {subject}
                </a>
                {body && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded((expanded) => !expanded)}
                        className="shrink-0 flex items-center justify-center cursor-pointer text-fill-color opacity-70 hover:opacity-100 transition-all"
                        title="Toggle commit body"
                    >
                        <PiDotsThreeFill className="w-5 h-5 sm:w-[18px] sm:h-[18px]" />
                    </button>
                )}
            </div>
            {body && isExpanded && (
                <div className="mt-2 p-3 text-xs sm:text-sm text-fill-color/80 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-lg whitespace-pre-wrap break-words font-mono">
                    {body}
                </div>
            )}
        </div>
    );
}

export default function LastCommits() {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [commitsLoading, setCommitsLoading] = useState(true);
    const [showMoreCommits, setShowMoreCommits] = useState(false);

    useEffect(() => {
        async function loadCommits() {
            try {
                const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/githubrepo/commits/nekowawolf/AI-Tools?per_page=8`;
                const response = await fetch(fullUrl);
                if (!response.ok) {
                    setCommits([]);
                    return;
                }

                const result = await response.json();
                setCommits(Array.isArray(result.data) ? result.data : []);
            } catch (error) {
                console.error('Failed to load commits:', error);
                setCommits([]);
            } finally {
                setCommitsLoading(false);
            }
        }

        loadCommits();
    }, []);

    const displayedCommits = showMoreCommits ? commits : commits.slice(0, 4);
    const groupedCommits = displayedCommits.reduce<Record<string, Commit[]>>((groups, commit) => {
        if (!commit?.commit?.author?.date) return groups;
        const date = new Date(commit.commit.author.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
        groups[date] = groups[date] || [];
        groups[date].push(commit);
        return groups;
    }, {});

    return (
        <>
            <div className="w-full mt-24 mb-12 flex flex-col items-start text-left space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
                    /last-commits
                </h1>
                <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
                    Recent commits and contributions to the project.{' '}
                    <a
                        href={REPOSITORY_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:text-blue-400 transition-colors font-medium cursor-pointer inline-block mt-1 sm:mt-0"
                    >
                        Contribute
                    </a>
                </p>
            </div>

            {commitsLoading ? (
                <div className="flex justify-center items-center py-20 w-full">
                    <Spinner className="text-blue-500 size-10" />
                </div>
            ) : commits.length === 0 ? (
                <div className="text-left py-12 text-fill-color/50 font-mono text-sm">
                    No commits found.
                </div>
            ) : (
                <div className="flex flex-col w-full relative">
                    <div className="relative pl-3 sm:pl-6 border-l-2 border-[var(--border-divider)] ml-2 sm:ml-4 space-y-8">
                        {Object.entries(groupedCommits).map(([date, dateCommits]) => (
                            <div key={date} className="relative">
                                <div className="flex items-center gap-2 -ml-6 sm:-ml-9 mb-2">
                                    <div className="w-6 h-6 rounded-full body-color border border-[var(--border-divider)] flex items-center justify-center relative z-10 text-fill-color/50 shadow-sm">
                                        <FaCodeCommit className="w-[18px] h-[18px]" />
                                    </div>
                                    <span className="text-xs text-fill-color/60 body-color relative z-10 px-1">Commits on {date}</span>
                                </div>
                                <div className="flex flex-col gap-2 ml-0 sm:ml-1">
                                    {dateCommits.map((commit) => {
                                        const treeUrl = `${REPOSITORY_URL}/tree/${commit.sha}`;
                                        const authorName = commit.author?.login || commit.commit.author.name;

                                        return (
                                            <div key={commit.sha} className="flex items-start justify-between gap-3 py-3 px-3 sm:px-4 rounded-lg hover:bg-[rgba(var(--fill-color-rgb),0.03)] transition-colors group">
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <CommitMessage message={commit.commit.message} url={commit.html_url} />
                                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-fill-color/60">
                                                        {commit.author?.avatar_url && (
                                                            <Image
                                                                src={commit.author.avatar_url}
                                                                alt={authorName}
                                                                width={20}
                                                                height={20}
                                                                className="w-5 h-5 rounded-full object-cover shrink-0"
                                                            />
                                                        )}
                                                        <span className="font-semibold text-fill-color truncate max-w-[100px] sm:max-w-none">{authorName}</span>
                                                        <span className="shrink-0">committed</span>
                                                        <span className="shrink-0">
                                                            {new Date(commit.commit.author.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <span className="text-green-500 shrink-0" title="Verified">
                                                            <FaCheck className="w-3 h-3" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-2">
                                                    <CommitMobileDropdown commitUrl={commit.html_url} treeUrl={treeUrl} />
                                                    <div className="hidden sm:flex items-center font-mono text-xs border border-[var(--border-divider)] rounded-md overflow-hidden bg-transparent">
                                                        <a href={commit.html_url} target="_blank" rel="noreferrer" className="px-2 py-1 text-blue-500 hover:bg-[rgba(var(--fill-color-rgb),0.05)] transition-colors border-r border-[var(--border-divider)]">
                                                            {commit.sha.substring(0, 7)}
                                                        </a>
                                                        <a href={treeUrl} target="_blank" rel="noreferrer" className="px-2 py-1 text-fill-color/70 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.05)] transition-colors" title="Browse the repository at this point in the history">
                                                            <FaCode className="w-3.5 h-3.5" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {commits.length > 4 && (
                        <div className="mt-8 flex flex-col items-center gap-3">
                            {!showMoreCommits ? (
                                <button
                                    type="button"
                                    onClick={() => setShowMoreCommits(true)}
                                    className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors bg-[rgba(var(--fill-color-rgb),0.05)] px-4 py-2 rounded-lg cursor-pointer"
                                >
                                    See more commits
                                </button>
                            ) : (
                                <>
                                    <a
                                        href={`${REPOSITORY_URL}/commits/main/`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color bg-[rgba(var(--fill-color-rgb),0.05)] px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2"
                                    >
                                        <FaExternalLinkAlt className="w-3 h-3" /> View all commits on GitHub
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setShowMoreCommits(false)}
                                        className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                                    >
                                        See less
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
