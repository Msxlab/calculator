export interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface ProjectDetails {
  projectType: string;
  materialType: string;
  materialName: string;
  edgeType: string;
}

export interface Measurement {
  length: number;
  width: number;
  sqft: number;
}

export interface ExtraService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Project {
  id?: string;
  quoteNumber?: string;
  customerInfo: CustomerInfo;
  projectDetails: ProjectDetails;
  measurements: {
    tops: Measurement[];
    backsplashes: Measurement[];
    edges: Measurement[];
  };
  extras: ExtraService[];
  totalPrice: number;
  status: 'draft' | 'sent' | 'approved' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}