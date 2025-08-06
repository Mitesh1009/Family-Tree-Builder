"use client";

import React, { useState, useEffect } from "react";
import { FamilyMember, FormData, TreeAction } from "../../_types/family";
import {
  loadFamilyTree,
  saveFamilyTree,
  generateId,
} from "../../_utils/localStorage";
import {
  addMember,
  updateMember,
  deleteMember,
  toggleExpansion,
  findMemberById,
} from "../../_utils/treeOperations";
import FamilyMemberTree from "../FamilyMemberTree/FamilyMemberTree";
import { Modal } from "antd";
import MemberForm from "../MemberForm/MemberForm";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import styles from "./Home.module.scss";

const FamilyTreeApp: React.FC = () => {
  const [familyTree, setFamilyTree] = useState<FamilyMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentAction, setCurrentAction] = useState<TreeAction | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedTree = loadFamilyTree();
    if (savedTree) {
      setFamilyTree(savedTree);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (familyTree) {
      saveFamilyTree(familyTree);
    }
  }, [familyTree]);

  const handleAction = (action: TreeAction) => {
    setCurrentAction(action);

    switch (action.type) {
      case "add":
        setEditingMember(null);
        setShowForm(true);
        break;

      case "edit":
        if (action.memberId && familyTree) {
          const member = findMemberById(familyTree, action.memberId);
          if (member) {
            setEditingMember(member);
            setShowForm(true);
          }
        }
        break;

      case "delete":
        if (action.memberId) {
          setMemberToDelete(action.memberId);
          setShowConfirmDialog(true);
        }
        break;
    }
  };

  const handleFormSubmit = (formData: FormData) => {
    if (!currentAction) return;

    if (currentAction.type === "add") {
      if (!currentAction.parentId) {
        const newRoot: FamilyMember = {
          id: generateId(),
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          relationship: formData.relationship || "",
          imageUrl: formData.imageUrl || "",
          children: [],
          isExpanded: true,
        };
        setFamilyTree(newRoot);
      } else if (familyTree) {
        const updatedTree = addMember(
          familyTree,
          currentAction.parentId,
          formData
        );
        setFamilyTree(updatedTree);
      }
    } else if (
      currentAction.type === "edit" &&
      currentAction.memberId &&
      familyTree
    ) {
      const updatedTree = updateMember(
        familyTree,
        currentAction.memberId,
        formData
      );
      setFamilyTree(updatedTree);
    }

    handleFormCancel();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentAction(null);
    setEditingMember(null);
  };

  const handleDeleteConfirm = () => {
    if (memberToDelete && familyTree) {
      const updatedTree = deleteMember(familyTree, memberToDelete);
      if (!updatedTree) {
        localStorage.removeItem("family_tree_data");
      }
      setFamilyTree(updatedTree);
    }

    setShowConfirmDialog(false);
    setMemberToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowConfirmDialog(false);
    setMemberToDelete(null);
  };

  const handleToggleExpansion = (memberId: string) => {
    if (familyTree) {
      const updatedTree = toggleExpansion(familyTree, memberId);
      setFamilyTree(updatedTree);
    }
  };

  const getEditFormData = (): FormData | undefined => {
    if (!editingMember) return undefined;
    return {
      name: editingMember.name,
      dateOfBirth: editingMember.dateOfBirth,
      gender: editingMember.gender,
      relationship: editingMember.relationship || "",
      imageUrl: editingMember.imageUrl || "",
    };
  };

  const getModalTitle = (): string => {
    return currentAction?.type === "edit"
      ? "Edit Family Member"
      : "Add New Family Member";
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Family Tree Manager</h1>
        <p className={styles.subtitle}>Manage your family tree with ease</p>
      </header>

      <main className={styles.main}>
        <FamilyMemberTree
          familyTree={familyTree}
          onAction={handleAction}
          onToggleExpansion={handleToggleExpansion}
          isLoading={isLoading}
        />
      </main>

      <Modal
        open={showForm}
        onCancel={handleFormCancel}
        footer={null}
        title={getModalTitle()}
        centered
        destroyOnClose
      >
        <MemberForm
          initialData={getEditFormData()}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isEdit={!!editingMember}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Family Member"
        message="Are you sure you want to delete this family member? This action cannot be undone and will also remove all their descendants."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default FamilyTreeApp;
