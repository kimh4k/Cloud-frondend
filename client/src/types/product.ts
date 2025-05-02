export interface Category {
  id: number;
  documentId: string;
  title: string;
  description: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Product {
  id: number;
  documentId: string;
  price: number;
  desc: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  type: 'featured' | 'trending' | string;
  isNew: boolean | null;
  img: Image[];
  categories: Category[];
  sub_categories: any[];
  img2: Image[];
}

export interface ApiResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  img: Image;
}
