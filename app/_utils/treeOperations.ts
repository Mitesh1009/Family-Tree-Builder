import { FamilyMember, FormData } from "../_types/family";
import { generateId } from "./localStorage";

export const findMemberById = (
  tree: FamilyMember,
  id: string
): FamilyMember | null => {
  if (tree.id === id) return tree;

  for (const child of tree.children) {
    const found = findMemberById(child, id);
    if (found) return found;
  }

  return null;
};

export const addMember = (
  tree: FamilyMember,
  parentId: string,
  formData: FormData
): FamilyMember => {
  const newTree = { ...tree };
  const parent = findMemberById(newTree, parentId);

  if (parent) {
    const newMember: FamilyMember = {
      id: generateId(),
      ...formData,
      parentId,
      children: [],
      isExpanded: true,
    };

    parent.children = [...parent.children, newMember];
    parent.isExpanded = true;
  }

  return newTree;
};

export const updateMember = (
  tree: FamilyMember,
  memberId: string,
  formData: FormData
): FamilyMember => {
  if (tree.id === memberId) {
    return {
      ...tree,
      ...formData,
      children: tree.children.map((child) =>
        updateMember(child, memberId, formData)
      ),
    };
  }

  return {
    ...tree,
    children: tree.children.map((child) =>
      updateMember(child, memberId, formData)
    ),
  };
};

export const deleteMember = (
  tree: FamilyMember,
  memberId: string
): FamilyMember | null => {
  if (tree.id === memberId) {
    return null;
  }

  return {
    ...tree,
    children: tree.children
      .map((child) => deleteMember(child, memberId))
      .filter((child): child is FamilyMember => child !== null),
  };
};

export const toggleExpansion = (
  tree: FamilyMember,
  memberId: string
): FamilyMember => {
  if (tree.id === memberId) {
    return { ...tree, isExpanded: !tree.isExpanded };
  }

  return {
    ...tree,
    children: tree.children.map((child) => toggleExpansion(child, memberId)),
  };
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};
