export interface AITool {
    _id: string;
    name: string;
    description: string;
    categories: string[];
    image_url: string;
    video_url?: string;
    website?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
    youtube?: string;
}
