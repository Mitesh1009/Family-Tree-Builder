import { FamilyMember } from '../_types/family';

const STORAGE_KEY = 'family_tree_data';

export const loadFamilyTree = (): FamilyMember | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading family tree:', error);
    return null;
  }
};

export const saveFamilyTree = (tree: FamilyMember): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  } catch (error) {
    console.error('Error saving family tree:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
