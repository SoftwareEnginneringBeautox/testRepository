import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";

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
import { TreatmentMultiSelect } from "@/components/ui/TreatmentMultiSelect";

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import PesoIcon from "@/assets/icons/PesoIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";

function CreatePackage({ isOpen, onClose }) {
  const [packageName, setPackageName] = useState("");
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState([]);
  const [numberOfTreatments, setNumberOfTreatments] = useState("");
  const [amount, setAmount] = useState("");
  const [treatmentsList, setTreatmentsList] = useState([]);
  const [existingPackages, setExistingPackages] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [treatmentsRes, packagesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/treatments?archived=false`, {
            withCredentials: true
          }),
          axios.get(`${API_BASE_URL}/api/packages`, {
            withCredentials: true
          })
        ]);

        setTreatmentsList(treatmentsRes.data);
        setExistingPackages(packagesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTreatmentIds.length > 0 && numberOfTreatments) {
      const selectedTreatments = treatmentsList.filter((t) =>
        selectedTreatmentIds.includes(t.id)
      );
      const totalPerSession = selectedTreatments.reduce(
        (sum, t) => sum + t.price,
        0
      );
      const total = totalPerSession * parseInt(numberOfTreatments, 10);
      setAmount(total.toFixed(2));
    } else {
      setAmount("");
    }
  }, [selectedTreatmentIds, numberOfTreatments, treatmentsList]);

  if (!isOpen) return null;

  const treatmentOptions = treatmentsList.map((t) => ({
    value: t.id,
    label: `${t.treatment_name} - ₱${t.price}`
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const duplicate = existingPackages.find(
      (pkg) =>
        pkg.package_name.toLowerCase().trim() ===
        packageName.toLowerCase().trim()
    );
    if (duplicate) {
      setError("A package with this name already exists.");
      setLoading(false);
      return;
    }

    const selectedTreatmentNames = treatmentsList
      .filter((t) => selectedTreatmentIds.includes(t.id))
      .map((t) => t.treatment_name);

    const payload = {
      package_name: packageName,
      treatments: selectedTreatmentNames,
      sessions: parseInt(numberOfTreatments, 10) || 0,
      price: parseFloat(amount) || 0,
      treatment_ids: selectedTreatmentIds.map(Number)
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/packages`,
        payload,
        { withCredentials: true }
      );
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
    <ModalContainer data-cy="create-package-modal">
      <ModalHeader>
        <ModalIcon>
          <PackageIcon />
        </ModalIcon>
        <ModalTitle>CREATE NEW PACKAGE</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} data-cy="create-package-form">
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>PACKAGE NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PackageIcon />
                </InputIcon>
                <Input
                  data-cy="package-name"
                  placeholder="e.g. Brazilian Package"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  required
                  className="bg-[#F5F3F0]"
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>
              <TreatmentMultiSelect
                options={treatmentOptions}
                value={selectedTreatmentIds}
                onChange={setSelectedTreatmentIds}
                placeholder="Select treatments"
                className="bg-[#F5F3F0]"
              />
            </InputContainer>

            <InputContainer>
              <InputLabel>NUMBER OF SESSIONS</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PackageIcon />
                </InputIcon>
                <Input
                  data-cy="package-sessions"
                  placeholder="e.g. 5 sessions"
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

            <InputContainer>
              <InputLabel>AMOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <CurrencyInput
                  data-cy="package-price"
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

            <InputContainer>
              <InputLabel>EXPIRATION DATE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  name="date"
                  type="date"
                  placeholder="Select expiration date"
                  required
                  className="text-input"
                />
              </InputTextField>
            </InputContainer>
          </div>

          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-package-btn"
              variant="outline"
              className="w-1/2"
              onClick={onClose}
              disabled={loading}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="save-package-btn"
              type="submit"
              className="w-1/2"
              disabled={loading}
            >
              <PlusIcon />
              {loading ? "CREATING..." : "CREATE PACKAGE"}
            </Button>
          </div>

          {error && (
            <p className="text-red-500 mt-2" data-cy="error-message">
              {error}
            </p>
          )}
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreatePackage;
