'use client';

interface Pagination2Props {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export default function Pagination2({ currentPage, itemsPerPage, totalItems, onPageChange }: Pagination2Props) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const paginationRange: (number | '...')[] = [];
    let previousPage: number | undefined;

    for (let page = 1; page <= totalPages; page += 1) {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
            if (previousPage !== undefined && page - previousPage > 1) paginationRange.push('...');
            paginationRange.push(page);
            previousPage = page;
        }
    }

    return (
        <nav aria-label="Pagination" className="flex flex-wrap justify-center items-center gap-1 mt-4">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer rounded-md px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm text-fill-color/60 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color disabled:pointer-events-none disabled:opacity-50"
            >
                Previous
            </button>

            {paginationRange.map((page, index) => page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-fill-color/60">…</span>
            ) : (
                <button
                    type="button"
                    key={page}
                    aria-current={currentPage === page ? 'page' : undefined}
                    onClick={() => onPageChange(page)}
                    className={`cursor-pointer rounded-md px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm ${currentPage === page
                        ? 'text-blue-400 bg-blue-500/20 border border-blue-500/40 shadow-sm'
                        : 'text-fill-color/60 border border-transparent hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer rounded-md px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm text-fill-color/60 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color disabled:pointer-events-none disabled:opacity-50"
            >
                Next
            </button>
        </nav>
    );
}