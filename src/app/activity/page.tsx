import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { aiToolsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = aiToolsMetadata("Activity", "See the latest AI Tools, Nww ecosystem supporters, and project commits.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}