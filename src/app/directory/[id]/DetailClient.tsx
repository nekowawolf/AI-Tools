'use client';

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAIToolById, fetchAIToolsData } from "@/services/aiToolService";
import { AITool } from "@/types/aitool";
import { Spinner } from "@/components/ui/spinner";
import { FallbackImage } from "@/components/FallbackImage";
import { FaExternalLinkAlt, FaPlayCircle } from "react-icons/fa";
import { FaXTwitter, FaYoutube, FaInstagram } from "react-icons/fa6";
import { BsDiscord } from "react-icons/bs";
import BackButton from "@/components/BackButton";
import NwwOneeAIChat, { chatStore } from "@/components/NwwOneeAIChat";
import { CiBookmark } from "react-icons/ci";

const TweetEmbed = ({ url }: { url: string }) => {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    const renderTweet = () => {
      const tweetId = url.match(/\/status\/(\d+)/)?.[1];
      if (!tweetId) {
        if (isMounted) setLoaded(true);
        return;
      }

      const checkTwttr = setInterval(() => {
        if ((window as any).twttr && (window as any).twttr.widgets) {
          clearInterval(checkTwttr);
          
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
            (window as any).twttr.widgets.createTweet(
              tweetId,
              containerRef.current,
              { theme: 'dark', align: 'center' }
            ).then(() => {
              if (isMounted) setLoaded(true);
            });
          }
        }
      }, 100);
    };

    renderTweet();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div className="w-full max-w-xl relative z-10 flex flex-col items-center min-h-[400px]">
      {!loaded && (
        <div className="absolute top-0 w-full p-6 rounded-2xl border border-white/10 bg-white/5 animate-pulse flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10"></div>
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 rounded bg-white/10"></div>
              <div className="w-20 h-3 rounded bg-white/10"></div>
            </div>
          </div>
          <div className="w-full h-4 rounded bg-white/10 mt-2"></div>
          <div className="w-5/6 h-4 rounded bg-white/10"></div>
          <div className="w-full h-48 rounded-xl bg-white/10 mt-2"></div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className={`w-full flex justify-center transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`} 
      />
    </div>
  );
};

export default function DetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const [tool, setTool] = useState<AITool | null>(null);
  const [suggestedTools, setSuggestedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Twitter widget script if not already loaded
    if (!(window as any).twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).twttr.widgets) {
      (window as any).twttr.widgets.load();
    }

    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const allTools = await fetchAIToolsData();
        const foundTool = allTools.find((t) => t._id.toString() === id);
        
        if (foundTool) {
          setTool(foundTool);
          
          const otherTools = allTools.filter(t => t._id.toString() !== id);
          
          const sameCat = otherTools.filter(t => t.categories.some(c => foundTool.categories.includes(c)));
          const shuffledSame = [...sameCat].sort(() => 0.5 - Math.random());
          const selectedSame = shuffledSame.slice(0, 3);
          
          const remaining = otherTools.filter(t => !selectedSame.some(s => s._id === t._id));
          const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
          const selectedRand = shuffledRemaining.slice(0, 3);
          
          setSuggestedTools([...selectedSame, ...selectedRand].sort(() => 0.5 - Math.random()));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans flex items-center justify-center">
        <Spinner className="text-blue-500 size-12" />
      </main>
    );
  }

  if (!tool) {
    return (
      <main className="flex-grow pt-36 min-h-screen flex items-center justify-center text-fill-color">
        <div className="text-center flex flex-col items-center -mt-32">
          <FallbackImage
            src="https://nekowawolf.github.io/cdn-images/images/2026/1784476217_nwwonee_search.webp"
            alt="AI Not Found"
            width={160}
            height={160}
            className="mx-auto -mb-4"
          />
          <h1 className="text-lg font-bold mb-8 text-fill-color/50">AI Not Found</h1>
          <Link href="/directory" className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20">
            Back to AI Tools
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <BackButton fallbackUrl="/directory" />

        {/* Header Section */}
        <div className="glass-card rounded-3xl p-7 mb-8 border border-white/10 relative overflow-hidden">
          <button 
            onClick={() => {
              chatStore.setIsOpen(true);
              chatStore.setActiveView('user');
            }}
            className="absolute top-6 right-6 z-20 cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color"
            title="Bookmark"
          >
            <CiBookmark className="w-6 h-6" />
          </button>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <FallbackImage
              src={tool.imgURL}
              alt=""
              width={256}
              height={256}
              className="w-64 h-64 object-contain"
              unoptimized
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
            <FallbackImage
              src={tool.imgURL}
              alt={tool.name}
              width={112}
              height={112}
              className="w-28 h-28 md:w-28 md:h-28 rounded-2xl object-contain bg-black/20 p-2"
              unoptimized
            />
            <div className="flex-1">
              <h1 className="text-3xl md:text-3xl font-bold mb-2">
                {tool.name}
              </h1>
              <div className="flex flex-wrap gap-3 mb-4">
                {tool.categories.map((cat: string, index: number) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                    {cat}
                  </span>
                ))}
              </div>

              <p className="text-fill-color/80 leading-relaxed max-w-2xl">
                {tool.description}
              </p>
              {/* Buttons & Links */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                {tool.website && (
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 md:px-3 md:py-1.5 rounded-lg font-medium text-[14.5px] md:text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20"
                  >
                    <FaExternalLinkAlt className="w-3.5 h-3.5 md:w-3 md:h-3" />
                    Visit Website
                  </a>
                )}

                {tool.twitter && (
                  <a href={tool.twitter} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color">
                    <FaXTwitter className="w-[21px] h-[21px] md:w-5 md:h-5" />
                  </a>
                )}
                {tool.instagram && (
                  <a href={tool.instagram} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color">
                    <FaInstagram className="w-[21px] h-[21px] md:w-5 md:h-5" />
                  </a>
                )}
                {tool.youtube && (
                  <a href={tool.youtube} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color">
                    <FaYoutube className="w-[21px] h-[21px] md:w-5 md:h-5" />
                  </a>
                )}
                {tool.discord && (
                  <a href={tool.discord} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color">
                    <BsDiscord className="w-[21px] h-[21px] md:w-5 md:h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {tool.video_url && (
          <div className="glass-card rounded-3xl p-7 mb-8 border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                <FaPlayCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Video Overview</h2>
            </div>
            
            <div className="w-full flex justify-center">
              {(() => {
                const url = tool.video_url;
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                  const match = url.match(regExp);
                  const videoId = (match && match[2].length === 11) ? match[2] : null;
                  
                  if (videoId) {
                    return (
                      <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-2xl shadow-black/50 relative z-10">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${videoId}`} 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    );
                  }
                } else if (url.includes('twitter.com') || url.includes('x.com')) {
                  const tweetUrl = url.replace('x.com', 'twitter.com');
                  return <TweetEmbed url={tweetUrl} />;
                }
                
                return (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 relative z-10">
                    <FaPlayCircle className="w-4 h-4" />
                    Watch Video
                  </a>
                );
              })()}
            </div>
          </div>
        )}

        {/* Explore Other AI Tools Section */}
        {suggestedTools.length > 0 && (
          <div className="glass-card rounded-3xl p-8 mt-8 mb-8 border border-[var(--border-divider)] overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-divider)] relative z-10">
              <h2 className="text-2xl font-bold text-fill-color">Explore Other AI Tools</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {suggestedTools.map((sTool) => (
                <Link 
                  key={sTool._id} 
                  href={`/directory/${sTool._id}`}
                  className="flex flex-col h-full p-5 rounded-2xl bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] hover:bg-[rgba(var(--fill-color-rgb),0.06)] hover:border-blue-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-[var(--border-divider)]">
                    <div className="flex items-center gap-3">
                      <FallbackImage
                        src={sTool.imgURL}
                        alt={sTool.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-xl object-contain bg-black/20 p-1 shrink-0"
                        unoptimized
                      />
                      <div className="flex flex-col">
                        <h3 className="text-sm font-bold group-hover:text-blue-400 transition-colors line-clamp-1">
                          {sTool.name}
                        </h3>
                      </div>
                    </div>
                    {sTool.categories && sTool.categories.length > 0 && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                          {sTool.categories[0]}
                        </span>
                        {sTool.categories.length > 1 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md border border-color bg-card-color text-fill-color/70 font-bold whitespace-nowrap">
                            +{sTool.categories.length - 1}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-fill-color/60 line-clamp-2 mt-auto flex-grow">
                    {sTool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
      <NwwOneeAIChat />
    </main>
  );
}