export interface ReviewDTO {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatarText?: string | null;
  designation?: string | null;
  productId?: string | null;
  isApproved: boolean;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
