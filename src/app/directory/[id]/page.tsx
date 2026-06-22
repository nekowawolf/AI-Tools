import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dashboardMetadata } from "@/constants/metadataTemplates";
import { fetchAIToolsData } from "@/services/aiToolService";
import DetailClient from "./DetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const aiToolsData = await fetchAIToolsData();
  const tool = aiToolsData.find((t) => t._id.toString() === resolvedParams.id);
  if (!tool) return dashboardMetadata("Not Found", "Tool not found");
  return dashboardMetadata(tool.name, tool.description);
}

export default function AIToolDetails() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}