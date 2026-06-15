import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AITool } from '@/types/aitool';
import { fetchAIToolsData } from '@/services/aiToolService';

export const useAITools = (itemsPerPage: number = 8) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [toolsData, setToolsData] = useState<AITool[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('q') || '');
    const activeCategory = searchParams.get('category') || 'All';
    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchAIToolsData();
                setToolsData(data);
            } catch (err) {
                setError('Failed to fetch AI tools data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Debounce search URL update
    useEffect(() => {
        const handler = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (localSearchQuery !== currentQ) {
                const params = new URLSearchParams(searchParams.toString());
                if (localSearchQuery) params.set('q', localSearchQuery);
                else params.delete('q');
                params.set('page', '1');
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [localSearchQuery, pathname, router, searchParams]);

    const updateURL = (newCategory: string, newQuery: string, newPage: number) => {
        const params = new URLSearchParams();
        if (newCategory !== 'All') params.set('category', newCategory);
        if (newQuery) params.set('q', newQuery);
        if (newPage > 1) params.set('page', newPage.toString());
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleCategoryChange = (category: string) => {
        updateURL(category, localSearchQuery, 1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
    };

    const handlePageChange = (page: number) => {
        updateURL(activeCategory, localSearchQuery, page);
    };

    const filteredTools = useMemo(() => {
        return toolsData.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(localSearchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || (tool.categories && tool.categories.includes(activeCategory));
            return matchesSearch && matchesCategory;
        });
    }, [toolsData, localSearchQuery, activeCategory]);

    const totalItems = filteredTools.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const displayedTools = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTools.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTools, currentPage, itemsPerPage]);

    return {
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
    };
};
