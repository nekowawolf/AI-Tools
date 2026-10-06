'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
    fallbackUrl: string;
    label?: string;
    forceFallback?: boolean;
}

export default function BackButton({ fallbackUrl, label = "Back to List", forceFallback = false }: BackButtonProps) {
    const router = useRouter();

    if (forceFallback) {
        return (
            <Link
                href={fallbackUrl}
                className="inline-flex items-center gap-2 text-fill-color/70 hover:text-fill-color mb-8 transition-colors cursor-pointer"
            >
                <FaArrowLeft className="w-4 h-4" />
                {label}
            </Link>
        );
    }

    const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        router.back();
    };

    return (
        <a
            href={fallbackUrl}
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-fill-color/70 hover:text-fill-color mb-8 transition-colors cursor-pointer"
        >
            <FaArrowLeft className="w-4 h-4" />
            {label}
        </a>
    );
}