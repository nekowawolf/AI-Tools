import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dashboardMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = dashboardMetadata("News", "The latest news and updates from various AI tools.");

export default function NewsPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}