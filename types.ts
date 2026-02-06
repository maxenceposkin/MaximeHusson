export interface Project {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  images: string[];
  description: string;
  year: string;
}

export interface NavItem {
  label: string;
  action: () => void;
}
