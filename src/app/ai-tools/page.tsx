import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIToolsContent from "./AIToolsContent";
import { dashboardMetadata } from "@/constants/metadataTemplates";
import { Suspense } from "react";

export const metadata = dashboardMetadata("AI Tools", "AI Tools Directory");

export default function AIToolsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <Suspense fallback={<div className="min-h-screen body-color text-fill-color p-8 pt-12 font-sans flex items-center justify-center">Loading...</div>}>
          <AIToolsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}