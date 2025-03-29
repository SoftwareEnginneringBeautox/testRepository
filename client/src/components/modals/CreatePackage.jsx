import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";



import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody,
} from "@/components/ui/Modal";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input,
} from "@/components/ui/Input";

import { Button } from "../ui/Button";

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import PesoIcon from "@/assets/icons/PesoIcon";

function CreatePackage({ isOpen, onClose }) {
  const [packageName, setPackageName] = useState("");
  const [selectedTreatmentId, setSelectedTreatmentId] = useState("");
  const [numberOfTreatments, setNumberOfTreatments] = useState("");
  const [amount, setAmount] = useState("");
  const [treatmentsList, setTreatmentsList] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch treatments from the server
  useEffect(() => {
    async function fetchTreatments() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/treatments`, {
          withCredentials: true,
        });
        setTreatmentsList(response.data);
      } catch (err) {
        console.error("Error fetching treatments:", err);
      }
    }
    fetchTreatments();
  }, []);

  // Compute total amount automatically based on the selected treatment price and number of treatments
  useEffect(() => {
    const treatment = treatmentsList.find(
      (t) => String(t.id) === selectedTreatmentId
    );
    if (treatment && numberOfTreatments) {
      const total = treatment.price * parseInt(numberOfTreatments, 10);
      setAmount(total.toFixed(2));
    } else {
      setAmount("");
    }
  }, [selectedTreatmentId, numberOfTreatments, treatmentsList]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      package_name: packageName,
      // Optionally, you can store treatment id; here we store treatment name from lookup:
      treatment: treatmentsList.find(t => String(t.id) === selectedTreatmentId)?.treatment_name || "",
      sessions: parseInt(numberOfTreatments, 10) || 0,
      price: parseFloat(amount) || 0,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/packages`, payload, {
        withCredentials: true,
      });
      if (response.data.success) {
        onClose();
      } else {
        setError(response.data.error || "Failed to create package");
      }
    } catch (err) {
      console.error("Error creating package:", err);
      setError("An error occurred while creating package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <PackageIcon />
        </ModalIcon>
        <ModalTitle>CREATE NEW PACKAGE</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* Package Name */}
            <InputContainer>
              <InputLabel>PACKAGE NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PackageIcon />
                </InputIcon>
                <Input
                  placeholder="Name of the Package"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  required
                  className="bg-[#F5F3F0]"
                />
              </InputTextField>
            </InputContainer>

            {/* Treatments Dropdown */}
            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>
              <InputTextField className="bg-[#F5F3F0] border rounded p-2">
                <select
                  className="w-full"
                  value={selectedTreatmentId}
                  onChange={(e) => setSelectedTreatmentId(e.target.value)}
                  required
                >
                  <option value="">Select treatment</option>
                  {treatmentsList.map((treatment) => (
                    <option key={treatment.id} value={treatment.id}>
                      {treatment.treatment_name} - ₱{treatment.price}
                    </option>
                  ))}
                </select>
              </InputTextField>
            </InputContainer>

            {/* Number of Treatments */}
            <InputContainer>
              <InputLabel>NUMBER OF TREATMENTS</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PackageIcon />
                </InputIcon>
                <Input
                  placeholder="Number of treatments to be taken"
                  type="number"
                  min="0"
                  step="1"
                  value={numberOfTreatments}
                  onChange={(e) => setNumberOfTreatments(e.target.value)}
                  required
                  className="bg-[#F5F3F0]"
                />
              </InputTextField>
            </InputContainer>

            {/* Amount (Computed) */}
            <InputContainer>
              <InputLabel>AMOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <CurrencyInput
                  className="outline-none flex-1 bg-[#F5F3F0]"
                  prefix="₱"
                  placeholder="₱0.00"
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  value={amount}
                  readOnly
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose} disabled={loading}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button type="submit" className="w-1/2" disabled={loading}>
              <PlusIcon />
              {loading ? "CREATING..." : "CREATE PACKAGE"}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreatePackage;
