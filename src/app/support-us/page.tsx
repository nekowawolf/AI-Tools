import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { aiToolsMetadata } from '@/constants/metadataTemplates';
import SupportUsClient from './SupportUsClient';

export const metadata = aiToolsMetadata('Support Us', 'Support the Nww ecosystem and help us keep building.');

export default function SupportUsPage() {
    return (
        <>
            <Header />
            <SupportUsClient />
            <Footer />
        </>
    );
}