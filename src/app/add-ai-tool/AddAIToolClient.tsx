'use client';

import { useEffect, useRef, useState } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';
import { Spinner } from '@/components/ui/spinner';
import { fetchAIToolsData, submitAITool } from '@/services/aiToolService';

const normalizeUrl = (url: string) => url.trim().toLowerCase().replace(/\/$/, '');

const isValidHttpUrl = (value: string) => {
    try {
        const url = new URL(value);
        return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname);
    } catch {
        return false;
    }
};

export default function AddAIToolClient() {
    const [website, setWebsite] = useState('');
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingUrls, setExistingUrls] = useState<string[]>([]);
    const [isCheckingUrl, setIsCheckingUrl] = useState(false);
    const [urlExists, setUrlExists] = useState<boolean | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchAIToolsData(false);
                setExistingUrls(data.flatMap((tool) => {
                    const toolUrl = tool.website || tool.socials?.website;
                    return toolUrl ? [normalizeUrl(toolUrl)] : [];
                }));
            } catch (error) {
                console.error('Failed to load AI Tools for duplicate validation:', error);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        const trimmedWebsite = website.trim();
        if (!trimmedWebsite || !isValidHttpUrl(trimmedWebsite)) {
            return;
        }

        const timer = window.setTimeout(() => {
            setUrlExists(existingUrls.includes(normalizeUrl(trimmedWebsite)));
            setIsCheckingUrl(false);
        }, 500);

        return () => window.clearTimeout(timer);
    }, [website, existingUrls]);

    const handleWebsiteChange = (value: string) => {
        setWebsite(value);
        setUrlExists(null);
        setIsCheckingUrl(Boolean(value.trim() && isValidHttpUrl(value.trim())));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedWebsite = website.trim();
        const trimmedName = name.trim();
        const trimmedLink = link.trim();

        if (!trimmedWebsite) return toast.error('AI Tool website is required.');
        if (!isValidHttpUrl(trimmedWebsite)) return toast.error('Website must be a valid URL starting with http:// or https://.');
        if (urlExists || existingUrls.includes(normalizeUrl(trimmedWebsite))) return toast.error('This AI Tool is already listed.');
        if (!trimmedName) return toast.error('Name (added by) is required.');
        if (trimmedLink && !isValidHttpUrl(trimmedLink)) return toast.error('Contributor link must be a valid URL.');
        if (!turnstileToken) return toast.error('Please verify that you are a human.');

        setIsSubmitting(true);
        try {
            await submitAITool({
                website: trimmedWebsite,
                name: trimmedName,
                link: trimmedLink || undefined,
                turnstile_token: turnstileToken,
            });
            toast.success('AI Tool submitted successfully. It will appear after review.');
            setWebsite('');
            setName('');
            setLink('');
            setTurnstileToken('');
            setUrlExists(null);
            turnstileRef.current?.reset();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to submit AI Tool');
        } finally {
            setIsSubmitting(false);
        }
    };

    const websiteError = website.trim() && !isValidHttpUrl(website.trim())
        ? 'Enter a valid URL starting with http:// or https://'
        : null;

    return (
        <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <BackButton fallbackUrl="/activity" label="Back to Activity" forceFallback />

                <div className="mt-8 mb-12 space-y-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">/add-ai-tool</h1>
                    <p className="text-fill-color/60 text-sm max-w-xl leading-relaxed">
                        Know a useful AI website that belongs here? Submit its official website and help grow the directory. Every submission is reviewed before publishing.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6 w-full">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor="ai-tool-website" className="text-sm font-semibold">Link <span className="text-red-500">*</span></label>
                            {isCheckingUrl && <Spinner className="w-3.5 h-3.5 text-blue-500" />}
                            {!isCheckingUrl && urlExists === true && <span className="text-xs text-red-500">Already listed</span>}
                            {!isCheckingUrl && urlExists === false && <span className="text-xs text-green-500">Available to submit</span>}
                        </div>
                        <input
                            id="ai-tool-website"
                            type="url"
                            value={website}
                            onChange={(event) => handleWebsiteChange(event.target.value)}
                            placeholder="https://example.ai"
                            autoComplete="url"
                            aria-invalid={Boolean(websiteError || urlExists)}
                            className={`w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border rounded-xl text-fill-color focus:outline-none transition-colors ${websiteError || urlExists ? 'border-red-500/60 focus:border-red-500' : urlExists === false ? 'border-green-500/50 focus:border-green-500' : 'border-[var(--border-divider)] focus:border-blue-500'}`}
                        />
                        {websiteError && <p className="text-xs text-red-500">{websiteError}</p>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="contributor-name" className="text-sm font-semibold">Name (added by) <span className="text-red-500">*</span></label>
                        <input id="contributor-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name or username" autoComplete="name" className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="contributor-link" className="text-sm font-semibold">Contributor link <span className="text-fill-color/40 font-normal">(optional)</span></label>
                        <input id="contributor-link" type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="Your website, portfolio, or social link" autoComplete="url" className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="order-1 sm:order-2 flex-shrink-0 flex justify-center w-full sm:w-auto">
                            <Turnstile ref={turnstileRef} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''} onSuccess={setTurnstileToken} onError={() => setTurnstileToken('')} onExpire={() => setTurnstileToken('')} />
                        </div>
                        <button type="submit" disabled={!turnstileToken || isSubmitting || urlExists === true} className="order-2 sm:order-1 px-6 py-3 rounded-xl font-medium text-[15px] text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer w-full sm:w-fit">
                            {isSubmitting ? <Spinner className="w-5 h-5 text-white" /> : 'Submit AI Tool'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}