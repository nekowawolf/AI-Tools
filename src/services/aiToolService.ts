import { AITool } from '@/types/aitool';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAIToolsData = async (): Promise<AITool[]> => {
    try {
        const fullUrl = `${API_BASE_URL}/aitools`;
        console.log('Fetching AI tools data from:', fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText} (URL: ${fullUrl})`);
        }
        const data = await response.json();

        let resultData: AITool[] = [];

        if (!Array.isArray(data)) {
            if (data && Array.isArray(data.data)) {
                resultData = data.data;
            } else {
                console.error('API did not return an array:', data);
                return [];
            }
        } else {
            resultData = data;
        }

        for (let i = resultData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [resultData[i], resultData[j]] = [resultData[j], resultData[i]];
        }

        return resultData;
    } catch (error) {
        console.error('Error fetching AI tools data:', error);
        throw error;
    }
};

export const fetchAIToolById = async (id: string): Promise<AITool | null> => {
    try {
        const tools = await fetchAIToolsData();
        return tools.find((t) => t._id.toString() === id) || null;
    } catch (error) {
        console.error('Error fetching AI tool by ID:', error);
        return null;
    }
};