'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
    fallbackUrl: string;
    label?: string;
}

export default function BackButton({ fallbackUrl, label = "Back to List" }: BackButtonProps) {
    const router = useRouter();

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