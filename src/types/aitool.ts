export interface AITool {
    _id: string;
    name: string;
    description: string;
    categories: string[];
    image_url: string;
    media: {
        video_url?: string;
        screenshot_urls?: string[];
    };
    socials: {
        website?: string;
        twitter?: string;
        instagram?: string;
        discord?: string;
        youtube?: string;
    };
}