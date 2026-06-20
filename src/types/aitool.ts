export interface AITool {
    _id: string;
    name: string;
    description: string;
    categories: string[];
    imgURL: string;
    video_url?: string;
    website?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
    telegram?: string;
}
