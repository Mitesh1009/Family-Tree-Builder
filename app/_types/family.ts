export interface FamilyMember {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  relationship?: string;
  parentId?: string;
  children: FamilyMember[];
  isExpanded?: boolean;
  imageUrl?: string;
}

export interface FormData {
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  relationship: string;
  imageUrl?: string;
}

export interface TreeAction {
  type: 'add' | 'edit' | 'delete';
  memberId?: string;
  parentId?: string;
}
