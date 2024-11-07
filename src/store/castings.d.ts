export interface CastingInfo {
  companyName: string;
  slots: number;
  description: string;
  paid: boolean;
  location: string;
  nationality: string;
  ageMin: number;
  ageMax: number;
  gender: string;
  heightMin: number;
  heightMax: number;
  castingType: string;
  image: File | null;
  imageUrl?: string | null;
  createdAt?: string;
}
