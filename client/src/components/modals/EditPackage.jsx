import React, { useState, useEffect, useRef } from "react";
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody
} from "@/components/ui/Modal";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

import { Button } from "../ui/Button";
import { MultiSelectCheckbox } from "@/components/ui/MultiSelectCheckbox";
import { TreatmentMultiSelect } from "@/components/ui/TreatmentMultiSelect";

import UserIcon from "@/assets/icons/UserIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import HashtagIcon from "@/assets/icons/HashtagIcon";
import PesoIcon from "@/assets/icons/PesoIcon";
import EditIcon from "@/assets/icons/EditIcon";

function EditPackage({ isOpen, onClose, entryData, onSubmit }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    package_name: "",
    treatment_ids: [],
    sessions: "",
    price: "",
    expiration: ""
  });

  const [treatments, setTreatments] = useState([]);
  const initialized = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch treatment list
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/treatments?archived=false`,
          {
            credentials: "include"
          }
        );
        const data = await res.json();
        const activeTreatments = Array.isArray(data)
          ? data.filter((t) => !t.archived)
          : [];
        setTreatments(activeTreatments);
      } catch (error) {
        console.error("Failed to fetch treatments:", error);
      }
    };

    fetchTreatments();
  }, []);

  // Fix initialization logic to always show original data
  useEffect(() => {
    // Reset the initialization flag when the modal opens/closes
    if (!isOpen) {
      initialized.current = false;
      return;
    }

    // Only initialize when modal is open and we have entryData
    if (isOpen && entryData && !initialized.current) {
      setFormData({
        package_name: entryData.package_name || "",
        treatment_ids: Array.isArray(entryData.treatment_ids) 
          ? entryData.treatment_ids 
          : (Array.isArray(entryData.treatments) 
              ? entryData.treatments.map(t => t?.id).filter(Boolean) 
              : []),
        sessions: entryData.sessions || "",
        price: entryData.price || "",
        expiration: entryData.expiration || ""
      });
      
      console.log("entryData loaded into form:", entryData);
      initialized.current = true;
    }
  }, [isOpen, entryData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    if (!entryData?.id) {
      setIsSubmitting(false);
      return;
    }
  
    const cleanedData = { ...formData };
  
    Object.keys(cleanedData).forEach((key) => {
      if (cleanedData[key] === "" || cleanedData[key]?.length === 0) {
        delete cleanedData[key];
      }
    });
  
    if (cleanedData.treatment_ids) {
      cleanedData.treatment_ids = cleanedData.treatment_ids.map(Number);
    }
  
    try {
      onSubmit({ id: entryData.id, ...cleanedData });
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContainer data-cy="edit-package-modal">
      <ModalHeader>
        <ModalIcon>
          <PackageIcon />
        </ModalIcon>
        <ModalTitle>EDIT PACKAGE</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={(e) => e.preventDefault()} data-cy="edit-package-form">
          <div className="flex flex-col gap-4">
            {/* Package Name */}
            <InputContainer>
              <InputLabel>PACKAGE NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input
                  data-cy="package-name"
                  placeholder="e.g. Brazilian Package"
                  value={formData.package_name}
                  onChange={(e) =>
                    setFormData({ ...formData, package_name: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            {/* Treatments */}
            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>
              <TreatmentMultiSelect
                options={treatments.map((t) => ({
                  value: t.id,
                  label: `${t.treatment_name} - ₱${t.price}`
                }))}
                placeholder="Select treatments"
                value={formData.treatment_ids}
                onChange={(val) =>
                  setFormData({ ...formData, treatment_ids: val })
                }
              />
            </InputContainer>

            {/* Sessions */}
            <InputContainer>
              <InputLabel>NUMBER OF SESSIONS</InputLabel>
              <InputTextField>
                <InputIcon>
                  <HashtagIcon />
                </InputIcon>
                <Input
                  data-cy="package-sessions"
                  placeholder="e.g. 3 sessions"
                  type="number"
                  value={formData.sessions}
                  onChange={(e) =>
                    setFormData({ ...formData, sessions: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            {/* Price */}
            <InputContainer>
              <InputLabel>AMOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <Input
                  data-cy="package-price"
                  placeholder="₱0.00"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>EXPIRATION (IN WEEKS)</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PackageIcon />
                </InputIcon>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 12 weeks"
                  value={formData.expiration}
                  onChange={(e) =>
                    setFormData({ ...formData, expiration: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>
          </div>

          {/* Buttons */}
          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-package-btn"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="save-package-btn"
              className="md:w-1/2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <EditIcon />
              {isSubmitting ? "UPDATING..." : "EDIT PACKAGE"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditPackage;
