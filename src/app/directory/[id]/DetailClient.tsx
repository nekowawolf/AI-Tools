'use client';

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAIToolById } from "@/services/aiToolService";
import { AITool } from "@/types/aitool";
import { Spinner } from "@/components/ui/spinner";
import { FallbackImage } from "@/components/FallbackImage";
import { FaExternalLinkAlt, FaPlayCircle } from "react-icons/fa";
import { FaXTwitter, FaYoutube, FaInstagram } from "react-icons/fa6";
import { BsDiscord } from "react-icons/bs";
import BackButton from "@/components/BackButton";

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
        const data = await fetchAIToolById(id as string);
        setTool(data);
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
        <div className="text-center flex flex-col items-center">
          <FallbackImage
            src="https://nekowawolf.github.io/cdn-images/images/2026/1771661079_pixchan.png"
            alt="AI Not Found"
            width={176}
            height={176}
            className="mx-auto mb-2"
          />
          <h1 className="text-lg font-bold mb-6 text-fill-color/50">AI Not Found</h1>
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
                    Visit Website
                    <FaExternalLinkAlt className="w-3.5 h-3.5 md:w-3 md:h-3" />
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

      </div>
    </main>
  );
}