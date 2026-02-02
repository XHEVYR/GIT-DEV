export interface Place {
    id: string;
    name: string;
    category: string;
    lat: number | string;
    lon: number | string;
    address?: string;
    image?: string;
    description?: string;
}