import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { aiToolsMetadata } from '@/constants/metadataTemplates';
import AddAIToolClient from './AddAIToolClient';

export const metadata = aiToolsMetadata('Add AI Tool', 'Submit an AI Tool to the Nww AI Tools directory.');

export default function AddAIToolPage() {
    return (
        <>
            <Header />
            <AddAIToolClient />
            <Footer />
        </>
    );
}