export interface AITool {
    _id: string;
    name: string;
    description: string;
    categories: string[];
    image_url: string;
    website?: string;
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
    added_by?: {
        name: string;
        url?: string;
    };
    created_at?: string;
}

export interface AIToolSubmissionPayload {
    website: string;
    name: string;
    link?: string;
    turnstile_token: string;
}