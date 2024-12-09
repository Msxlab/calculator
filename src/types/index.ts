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

export interface Extra {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Project {
  customerInfo: CustomerInfo;
  projectDetails: ProjectDetails;
  measurements: {
    tops: Measurement[];
    backsplashes: Measurement[];
    edges: Measurement[];
  };
  extras: Extra[];
  totalPrice: number;
  status: 'draft' | 'quote' | 'contract' | 'completed';
}