import React, { useState } from "react";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  Input,
  InputArea,
  InputAreaField
} from "@/components/ui/Input";

import { Button } from "../ui/Button";

import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import PesoIcon from "@/assets/icons/PesoIcon";
import ClockIcon from "@/assets/icons/ClockIcon";

function CreateTreatment({ isOpen, onClose }) {
  const [treatmentName, setTreatmentName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      treatment_name: treatmentName,
      price: parseFloat(price) || 0,
      duration: parseInt(duration, 10) || 0,
      description
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/treatments`,
        payload,
        { withCredentials: true }
      );
      if (response.data.success) {
        onClose();
      } else {
        setError(response.data.error || "Failed to create treatment");
      }
    } catch (err) {
      console.error("Error creating treatment:", err);
      setError("An error occurred while creating treatment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer data-cy="create-treatment-modal">
      <ModalHeader>
        <ModalIcon>
          <TreatmentIcon />
        </ModalIcon>
        <ModalTitle>CREATE NEW TREATMENT</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form data-cy="treatment-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* Treatment Name */}
            <InputContainer>
              <InputLabel>TREATMENT NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <TreatmentIcon />
                </InputIcon>
                <Input
                  data-cy="treatment-name"
                  placeholder="Name of the Treatment"
                  value={treatmentName}
                  onChange={(e) => setTreatmentName(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>
            {/* Price */}
            <InputContainer>
              <InputLabel>PRICE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <CurrencyInput
                  data-cy="treatment-price"
                  className="outline-none flex-1 bg-[#F5F3F0]"
                  prefix="₱"
                  placeholder="₱0.00"
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  value={price}
                  onValueChange={(value) => setPrice(value || "")}
                  required
                />
              </InputTextField>
            </InputContainer>
            {/* Duration */}
            <InputContainer>
              <InputLabel>DURATION (MINUTES)</InputLabel>
              <InputTextField>
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  data-cy="treatment-duration"
                  placeholder="Duration in minutes"
                  type="number"
                  min="0"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>

            {/* Description */}
            <InputContainer>
              <InputLabel>DESCRIPTION</InputLabel>
              <InputAreaField>
                <InputArea
                  data-cy="treatment-description"
                  placeholder="Brief description of the treatment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </InputAreaField>
            </InputContainer>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-treatment-btn"
              variant="outline"
              className="w-1/2"
              onClick={onClose}
              disabled={loading}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="save-treatment-btn"
              type="submit"
              className="w-1/2"
              disabled={loading}
            >
              <PlusIcon />
              {loading ? "CREATING..." : "CREATE TREATMENT"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreateTreatment;
