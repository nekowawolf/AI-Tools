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

        return resultData;
    } catch (error) {
        console.error('Error fetching AI tools data:', error);
        throw error;
    }
};