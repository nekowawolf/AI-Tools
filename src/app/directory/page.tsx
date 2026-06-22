import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIToolsContent from "./AIToolsContent";
import { dashboardMetadata } from "@/constants/metadataTemplates";

export const metadata = dashboardMetadata("AI Tools", "AI Tools Directory");

export default function AIToolsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <AIToolsContent />
      </main>
      <Footer />
    </>
  );
}