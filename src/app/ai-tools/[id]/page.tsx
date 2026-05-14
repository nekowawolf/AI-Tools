import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dashboardMetadata } from "@/constants/metadataTemplates";
import aiToolsData from "@/data/ai-tools.json";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import BackButton from "@/components/BackButton";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const tool = aiToolsData.find((t) => t.id.toString() === resolvedParams.id);
  if (!tool) return dashboardMetadata("Not Found", "Tool not found");
  return dashboardMetadata(tool.name, tool.description);
}

export default async function AIToolDetails({ params }: Props) {
  const resolvedParams = await params;
  const tool = aiToolsData.find((t) => t.id.toString() === resolvedParams.id);

  if (!tool) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-36 min-h-screen flex items-center justify-center text-fill-color">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
            <Link href="/ai-tools" className="text-blue-500 hover:underline">
              Back to AI Tools
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <BackButton fallbackUrl="/ai-tools" />

          {/* Header Section */}
          <div className="glass-card rounded-3xl p-7 mb-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Image
                src={tool.imgURL}
                alt=""
                width={256}
                height={256}
                className="w-64 h-64 object-contain"
                unoptimized
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
              <Image
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
                    <span key={index} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm border border-blue-500/20">
                      {cat}
                    </span>
                  ))}
                </div>

                <p className="text-fill-color/80 leading-relaxed max-w-2xl">
                  {tool.description}
                </p>
                {/* Button */}
                <a
                  href={tool.linkURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20 mt-4"
                >
                  Visit Website
                  <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}