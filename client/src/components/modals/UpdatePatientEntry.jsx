import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";

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

import PesoIcon from "@/assets/icons/PesoIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import UserIcon from "@/assets/icons/UserIcon";
import UserIDIcon from "@/assets/icons/UserIDIcon";
import CircleUserIcon from "@/assets/icons/CircleUserIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import UpdateIcon from "@/assets/icons/UpdateIcon";

function UpdatePatientEntry({ isOpen, onClose, entryData, onSubmit }) {
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({});

  const [packagesList, setPackagesList] = useState([]);
  const [treatmentsList, setTreatmentsList] = useState([]);
  const [aestheticianList, setAestheticianList] = useState([]);

  useEffect(() => {
    if (entryData) {
      /*setFormData({
          patient_name: entryData.patient_name || "",
          person_in_charge: entryData.person_in_charge || "",
          treatment: entryData.treatment || "",
          total_amount: entryData.total_amount || "",
          payment_method: entryData.payment_method || "",
          date_of_session: entryData.date_of_session || "",
          time_of_session: entryData.time_of_session || "",
          consent_form_signed: entryData.consent_form_signed || false
        });*/
      setOriginalData({
        ...entryData,
        package_name: entryData.package_name || "",
        treatment: entryData.treatment || "",
        payment_method: entryData.payment_method || ""
      });
      setFormData({});
    }
    const fetchAestheticians = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/getusers?archived!=notTrue`,
          {
            credentials: "include"
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Correct way to get JSON from fetch

        const aestheticians = Array.isArray(data)
          ? data.filter((user) => user.role?.toLowerCase() === "aesthetician")
          : [];

        setAestheticianList(aestheticians);
      } catch (error) {
        console.error("Error fetching aestheticians:", error);
        setAestheticianList([]); // fallback to empty list
      }
    };

    const fetchPackages = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/packages?archived=notTrue`,
          {
            credentials: "include"
          }
        );
        const data = await res.json();
        setPackagesList(data);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      }
    };

    const fetchTreatments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/treatments?archived!=notTrue`,
          {
            credentials: "include"
          }
        );
        const data = await res.json();
        setTreatmentsList(data);
      } catch (err) {
        console.error("Failed to fetch treatments:", err);
      }
    };

    fetchAestheticians();
    fetchPackages();
    fetchTreatments();
  }, [entryData]);

  if (!isOpen) return null;
  const total = parseFloat(
    formData.total_amount ?? originalData.total_amount ?? "0"
  );
  const paid = parseFloat(
    formData.amount_paid ?? originalData.amount_paid ?? "0"
  );
  const remainingBalance = total - paid;

  return (
    <ModalContainer data-cy="update-patient-entry-modal">
      <ModalHeader>
        <ModalIcon>
          <CircleUserIcon />
        </ModalIcon>
        <ModalTitle data-cy="update-patient-title">
          UPDATE PATIENT RECORD
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form
          onSubmit={(e) => e.preventDefault()}
          data-cy="update-patient-form"
        >
          <div className="flex flex-col gap-4">
            <p data-cy="patient-name-display">
              PATIENT RECORD OF{" "}
              {originalData.patient_name?.toUpperCase() || "UNKNOWN"}
            </p>

            <InputContainer>
              <InputLabel>PERSON IN CHARGE</InputLabel>
              <p data-cy="person-in-charge-display">
                {originalData.person_in_charge}
              </p>
            </InputContainer>

            {/* PACKAGE */}
            <InputContainer>
              <InputLabel>PACKAGE</InputLabel>
              <p data-cy="package-display">{originalData.package_name}</p>
            </InputContainer>

            {/* TREATMENT */}
            <InputContainer>
              <InputLabel>TREATMENT</InputLabel>
              <p data-cy="treatment-display">{originalData.treatment}</p>
            </InputContainer>

            <InputContainer>
              <InputLabel>TOTAL AMOUNT</InputLabel>
              <p data-cy="total-amount-display">{originalData.total_amount}</p>
            </InputContainer>

            <InputContainer>
              <InputLabel>AMOUNT PAID</InputLabel>
              <p data-cy="amount-paid-display">{originalData.amount_paid}</p>
            </InputContainer>

            <InputContainer>
              <InputLabel>REMAINING BALANCE</InputLabel>
              <p data-cy="remaining-balance-display">{remainingBalance}</p>
            </InputContainer>

            <InputContainer>
              <InputLabel>PAYMENT METHOD</InputLabel>
              <p data-cy="payment-method-display">
                {originalData.payment_method}
              </p>
            </InputContainer>
          </div>

          <div className="flex flex-row w-full gap-4 mt-4">
            <InputContainer className="flex-1">
              <InputLabel>DATE OF SESSION</InputLabel>
              <p data-cy="date-of-session-display">
                {originalData.date_of_session}
              </p>
            </InputContainer>

            <InputContainer className="flex-1">
              <InputLabel>TIME OF SESSION</InputLabel>
              <p data-cy="time-of-session-display">
                {originalData.time_of_session}
              </p>
            </InputContainer>
          </div>

          <div className="flex flex-row w-full gap-4 mt-4">
            <InputContainer className="flex-1">
              <InputLabel>DATE OF NEXT SESSION</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  data-cy="next-date-of-session-input"
                  type="date"
                  className="text-input"
                  placeholder="Date of Session"
                  required
                  value={
                    formData.date_of_session ??
                    originalData.date_of_session ??
                    ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date_of_session: e.target.value
                    })
                  }
                />
              </InputTextField>
            </InputContainer>

            <InputContainer className="flex-1">
              <InputLabel>TIME OF NEXT SESSION</InputLabel>
              <InputTextField className="flex-1">
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  data-cy="next-time-of-session-input"
                  type="time"
                  className="text-input"
                  required
                  value={
                    formData.time_of_session ??
                    originalData.time_of_session ??
                    ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time_of_session: e.target.value
                    })
                  }
                />
              </InputTextField>
            </InputContainer>
          </div>

          <div className="flex flex-col gap-4 my-4">
            <h5 className="text-xl leading-8 font-semibold">
              PATIENT CONSENT FORM
            </h5>
            <div className="flex flex-row gap-3 items-center justify-start">
              <Checkbox
                data-cy="consent-checkbox"
                id="consent"
                checked={formData.consent_form_signed}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, consent_form_signed: checked })
                }
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
          </div>

          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-update-patient-btn"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="submit-update-patient"
              className="md:w-1/2"
              onClick={() => onSubmit(formData)}
            >
              <UpdateIcon />
              UPDATE ENTRY
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default UpdatePatientEntry;
