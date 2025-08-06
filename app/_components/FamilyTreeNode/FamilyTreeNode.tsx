import React, { useState, useRef, useEffect } from "react";
import { FamilyMember, TreeAction } from "../../_types/family";
import { calculateAge } from "../../_utils/treeOperations";
import styles from "./FamilyTreeNode.module.scss";

interface FamilyTreeNodeProps {
  member: FamilyMember;
  onAction: (action: TreeAction) => void;
  onToggleExpansion: (memberId: string) => void;
  isRoot?: boolean;
  level?: number;
}

const FamilyTreeNode: React.FC<FamilyTreeNodeProps> = ({
  member,
  onAction,
  onToggleExpansion,
  isRoot = false,
  level = 0,
}) => {
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [showDropdown, setShowDropdown] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownAction = (action: TreeAction) => {
    setShowDropdown(false);
    onAction(action);
  };

  const toggleDropdown = () => {
    if (!showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setShowDropdown(!showDropdown);
  };

  const age = calculateAge(member.dateOfBirth);
  const hasChildren = member.children.length > 0;

  return (
    <div className={styles.treeNode}>
      <div
        className={styles.nodeRow}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        <button
          className={`${styles.expandButton} ${
            !hasChildren ? styles.invisible : ""
          }`}
          onClick={() => onToggleExpansion(member.id)}
          aria-label={member.isExpanded ? "Collapse" : "Expand"}
        >
          {hasChildren && (member.isExpanded ? "▼" : "▶")}
        </button>

        <div className={styles.memberInfo}>
          <div className={styles.nameSection}>
            {member.imageUrl && (
              <div className={styles.memberImage}>
                <img
                  src={member.imageUrl || "/placeholder.svg"}
                  alt={member.name}
                />
              </div>
            )}
            <div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberDetails}>
                {member.gender} • Born{" "}
                {new Date(member.dateOfBirth).getFullYear()}
              </p>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <p className={styles.memberAge}>Age: {age}</p>
            {member.relationship && !isRoot && (
              <p className={styles.memberRelationship}>
                Relationship: {member.relationship}
              </p>
            )}
          </div>
        </div>

        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            ref={buttonRef}
            className={styles.actionsButton}
            onClick={toggleDropdown}
            aria-label="Member actions"
          >
            ⋮
          </button>

          {showDropdown && (
            <div
              className={styles.dropdownMenu}
              style={{
                position: "fixed",
                top: dropdownPos.top,
                left: dropdownPos.left,
              }}
              ref={dropdownRef}
            >
              <button
                onClick={() =>
                  handleDropdownAction({ type: "add", parentId: member.id })
                }
                className={styles.dropdownItem}
              >
                Add Child
              </button>
              <button
                onClick={() =>
                  handleDropdownAction({ type: "edit", memberId: member.id })
                }
                className={styles.dropdownItem}
              >
                Edit
              </button>
              <button
                onClick={() =>
                  handleDropdownAction({
                    type: "delete",
                    memberId: member.id,
                  })
                }
                className={`${styles.dropdownItem} ${styles.delete}`}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {hasChildren && member.isExpanded && (
        <div className={styles.childrenContainer}>
          {member.children.map((child) => (
            <FamilyTreeNode
              key={child.id}
              member={child}
              onAction={onAction}
              onToggleExpansion={onToggleExpansion}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyTreeNode;
