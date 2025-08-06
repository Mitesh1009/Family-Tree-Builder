import React from "react";
import { FamilyMember, TreeAction } from "../../_types/family";
import FamilyTreeNode from "../FamilyTreeNode/FamilyTreeNode";
import styles from "./FamilyMemberTree.module.scss";

interface FamilyMemberTreeProps {
  familyTree: FamilyMember | null;
  onAction: (action: TreeAction) => void;
  onToggleExpansion: (memberId: string) => void;
}

const FamilyMemberTree: React.FC<FamilyMemberTreeProps> = ({
  familyTree,
  onAction,
  onToggleExpansion,
}) => {
  const handleCreateRootClick = () => {
    onAction({ type: "add" });
  };

  if (!familyTree) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Start Building Your Family Tree</h2>
          <p className={styles.emptyMessage}>
            Create the first member of your family tree to get started.
          </p>
          <button
            onClick={handleCreateRootClick}
            className={styles.createButton}
          >
            Create Root Member
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerColumn}>Family Member</div>
        <div className={styles.headerColumn}>Details</div>
      </div>
      <div className={styles.treeContent}>
        <FamilyTreeNode
          member={familyTree}
          onAction={onAction}
          onToggleExpansion={onToggleExpansion}
          isRoot={true}
          level={0}
        />
      </div>
    </div>
  );
};

export default FamilyMemberTree;
