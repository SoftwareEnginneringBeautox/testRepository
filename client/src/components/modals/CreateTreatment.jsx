import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingTreatments, setExistingTreatments] = useState([]);
  const [expiration, setExpiration] = useState("");

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/treatments`, {
          withCredentials: true
        });
        setExistingTreatments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch existing treatments:", err);
      }
    };

    if (isOpen) fetchExisting();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) {
      console.log("Submission already in progress");
      return;
    }
    
    setLoading(true);
    setError("");
  
    try {  
      const trimmedName = treatmentName.trim().toLowerCase();
      const duplicate = existingTreatments.find(
        (t) => t.treatment_name.trim().toLowerCase() === trimmedName
      );
  
      if (duplicate) {
        setError("A treatment with this name already exists.");
        setLoading(false);
        return;
      }
  
      // Add submission timestamp to track duration
      const startTime = Date.now();
      console.log(`Starting treatment creation at ${new Date(startTime).toISOString()}`);
      
      const payload = {
        treatment_name: treatmentName,
        price: parseFloat(price) || 0,
        duration: parseInt(duration, 10) || 0,
        expiration: expiration ? parseInt(expiration, 10) : null
      };

      // Use axios with timeout
      const response = await axios.post(
        `${API_BASE_URL}/api/treatments`,
        payload,
        { 
          withCredentials: true,
          timeout: 15000 // 15 second timeout
        }
      );
      
      console.log(`Treatment creation completed in ${Date.now() - startTime}ms`);
      
      if (response.data.success) {
        onClose();
      } else {
        setError(response.data.error || "Failed to create treatment");
      }
    } catch (err) {
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
                  placeholder="e.g. Diamond Peel Facial"
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
                  className="outline-none flex-1 bg-transparent dark:text-customNeutral-100 dark:placeholder-customNeutral-300"
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
                  placeholder="e.g. 45"
                  type="number"
                  min="0"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>

            {/* Expiration */}
            <InputContainer>
              <InputLabel>EXPIRATION (WEEKS)</InputLabel>
              <InputTextField>
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  data-cy="treatment-expiration"
                  placeholder="e.g. 12"
                  type="number"
                  min="0"
                  step="1"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>

            {error && <p className="text-red-500">{error}</p>}
          </div>

          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-treatment-btn"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
              disabled={loading}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="save-treatment-btn"
              type="submit"
              className="md:w-1/2"
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
