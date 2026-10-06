'use client';

import { useRef, useState } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { toast } from 'sonner';
import { BiLogoBitcoin } from 'react-icons/bi';
import { FaCheck, FaCopy, FaEthereum } from 'react-icons/fa';
import { SiKofi, SiSolana } from 'react-icons/si';
import BackButton from '@/components/BackButton';
import { Spinner } from '@/components/ui/spinner';
import { submitSupportRequest } from '@/services/supporterService';

const SOLANA_ADDRESS = 'FSrM2wHhHibFbK5S1oHsWG1PDQzj1soLSn2CNnMhCjWi';
const EVM_ADDRESS = '0x1fCD05ACED7295baCd96A4dfAA43E3055c70CF2E';

export default function SupportUsClient() {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState('Ko-fi');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState<'solana' | 'evm' | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    const copyAddress = async (address: string, type: 'solana' | 'evm') => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(type);
            window.setTimeout(() => setCopied(null), 2000);
        } catch {
            toast.error('Unable to copy the address.');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedName = name.trim();
        const trimmedUrl = url.trim();

        if (!trimmedName) return toast.error('Name is required.');
        if (trimmedUrl && !/^https?:\/\/.+$/i.test(trimmedUrl)) return toast.error('Invalid URL.');
        if (!turnstileToken) return toast.error('Please verify that you are a human.');

        setIsSubmitting(true);
        try {
            await submitSupportRequest(trimmedName, trimmedUrl, platform, turnstileToken);
            toast.success('Support details submitted successfully.');
            setName('');
            setUrl('');
            setPlatform('Ko-fi');
            setTurnstileToken('');
            turnstileRef.current?.reset();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to submit support details');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <BackButton fallbackUrl="/activity" label="Back to Activity" forceFallback />

                <div className="mt-8 mb-12 space-y-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">/support-us</h1>
                    <p className="text-fill-color/60 text-sm max-w-xl leading-relaxed">
                        Help us maintain the Nww ecosystem. After supporting, you can optionally submit your details to appear on the public supporters list.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <article className="glass-card rounded-2xl p-6 flex flex-col h-full">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><SiKofi className="text-[#FF5E5B]" /> Ko-fi</h2>
                        <p className="text-fill-color/70 text-sm mb-6 flex-grow">Buy us a coffee and directly support ongoing development across the Nww ecosystem.</p>
                        <a href="https://ko-fi.com/nwwonee" target="_blank" rel="noopener noreferrer" className="w-full text-center px-4 py-3 bg-[#FF5E5B] hover:opacity-90 text-white rounded-xl font-medium transition-opacity">
                            Support via Ko-fi
                        </a>
                    </article>

                    <article className="glass-card rounded-2xl p-6 flex flex-col h-full">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><BiLogoBitcoin className="text-[#F7931A]" /> Crypto</h2>
                        <p className="text-fill-color/70 text-sm mb-6">Send tokens directly through Solana or an EVM network.</p>
                        <div className="flex flex-col space-y-3">
                            <button type="button" onClick={() => copyAddress(SOLANA_ADDRESS, 'solana')} className="flex items-center justify-between p-3 bg-[rgba(var(--fill-color-rgb),0.05)] border border-[var(--border-divider)] rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
                                <span className="flex items-center gap-2 text-sm font-semibold"><SiSolana className="text-[#14F195]" /> Solana</span>
                                <span className="flex items-center gap-1.5 text-xs">{copied === 'solana' ? <><FaCheck className="text-green-500" /> Copied</> : <><FaCopy /> Copy</>}</span>
                            </button>
                            <button type="button" onClick={() => copyAddress(EVM_ADDRESS, 'evm')} className="flex items-center justify-between p-3 bg-[rgba(var(--fill-color-rgb),0.05)] border border-[var(--border-divider)] rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
                                <span className="flex items-center gap-2 text-sm font-semibold"><FaEthereum className="text-[#627EEA]" /> EVM</span>
                                <span className="flex items-center gap-1.5 text-xs">{copied === 'evm' ? <><FaCheck className="text-green-500" /> Copied</> : <><FaCopy /> Copy</>}</span>
                            </button>
                        </div>
                    </article>
                </div>

                <div className="mb-8 space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">/submit-support-details</h2>
                    <p className="text-fill-color/60 text-sm">Optional: submit your display details after supporting us.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="supporter-name" className="text-sm font-semibold">Name <span className="text-red-500">*</span></label>
                        <input id="supporter-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name or username" autoComplete="name" className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="supporter-url" className="text-sm font-semibold">Link <span className="text-fill-color/40 font-normal">(optional)</span></label>
                        <input id="supporter-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://your-profile.example" autoComplete="url" className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl focus:outline-none focus:border-blue-500" />
                    </div>
                    <fieldset className="space-y-2">
                        <legend className="text-sm font-semibold mb-2">Support platform</legend>
                        <div className="grid grid-cols-2 gap-3">
                            {['Ko-fi', 'Crypto'].map((option) => (
                                <button key={option} type="button" onClick={() => setPlatform(option)} aria-pressed={platform === option} className={`px-4 py-3 rounded-xl border font-medium cursor-pointer transition-colors ${platform === option ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-[rgba(var(--fill-color-rgb),0.03)] border-[var(--border-divider)] text-fill-color/70 hover:border-blue-500/50'}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </fieldset>
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="order-1 sm:order-2 flex justify-center w-full sm:w-auto">
                            <Turnstile ref={turnstileRef} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''} onSuccess={setTurnstileToken} onError={() => setTurnstileToken('')} onExpire={() => setTurnstileToken('')} />
                        </div>
                        <button type="submit" disabled={!turnstileToken || isSubmitting} className="order-2 sm:order-1 px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer w-full sm:w-fit">
                            {isSubmitting ? <Spinner className="w-5 h-5 text-white" /> : 'Submit Details'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}