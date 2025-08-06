import React, { useState, useEffect } from "react";
import { FormData } from "../../_types/family";
import styles from "./MemberForm.module.scss";

interface MemberFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dateOfBirth: "",
    gender: "male",
    relationship: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    if (!isEdit && !formData.relationship.trim()) {
      newErrors.relationship = "Relationship is required";
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`${styles.input} ${errors.name ? styles.error : ""}`}
          placeholder="Enter full name"
        />
        {errors.name && (
          <span className={styles.errorMessage}>{errors.name}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dateOfBirth" className={styles.label}>
          Date of Birth *
        </label>
        <input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          className={`${styles.input} ${
            errors.dateOfBirth ? styles.error : ""
          }`}
        />
        {errors.dateOfBirth && (
          <span className={styles.errorMessage}>{errors.dateOfBirth}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="gender" className={styles.label}>
          Gender *
        </label>
        <select
          id="gender"
          value={formData.gender}
          onChange={(e) =>
            handleInputChange(
              "gender",
              e.target.value as "male" | "female" | "other"
            )
          }
          className={styles.select}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="relationship" className={styles.label}>
          Relationship *
        </label>
        <input
          id="relationship"
          type="text"
          value={formData.relationship}
          onChange={(e) => handleInputChange("relationship", e.target.value)}
          className={`${styles.input} ${
            errors.relationship ? styles.error : ""
          }`}
          placeholder="e.g., Son, Daughter, Spouse"
        />
        {errors.relationship && (
          <span className={styles.errorMessage}>{errors.relationship}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="imageUrl" className={styles.label}>
          Profile Image URL (Optional)
        </label>
        <input
          id="imageUrl"
          type="url"
          value={formData.imageUrl || ""}
          onChange={(e) => handleInputChange("imageUrl", e.target.value)}
          className={`${styles.input} ${errors.imageUrl ? styles.error : ""}`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <span className={styles.errorMessage}>{errors.imageUrl}</span>
        )}
        {formData.imageUrl && isValidUrl(formData.imageUrl) && (
          <div className={styles.imagePreview}>
            <img src={formData.imageUrl || "/placeholder.svg"} alt="Preview" />
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update Member" : "Add Member"}
        </button>
      </div>
    </form>
  );
};

export default MemberForm;
