import React, { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Checkbox } from "@/components/ui/checkbox";

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

import { ModalSelect, SelectItem } from "../ui/Select";

import { Button } from "../ui/Button";

import PesoIcon from "@/assets/icons/PesoIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import UserIcon from "@/assets/icons/UserIcon";
import UserIDIcon from "@/assets/icons/UserIDIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import PercentageIcon from "@/assets/icons/PercentageIcon";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";

function CreatePatientEntry({ isOpen, onClose }) {
  // ----------- State Hooks -----------
  const [patientName, setPatientName] = useState("");
  const [personInCharge, setPersonInCharge] = useState("");
  const [packageName, setPackageName] = useState("");
  const [treatment, setTreatment] = useState("");

  // Currency/decimal fields (store them as strings)
  const [amount, setAmount] = useState(""); // Original amount input by the user
  const [packageDiscount, setPackageDiscount] = useState("");
  const [totalAmount, setTotalAmount] = useState(""); // Computed automatically

  // Payment method radio
  const [paymentMethod, setPaymentMethod] = useState("full-payment");

  // Session date/time
  const [dateOfSession, setDateOfSession] = useState("");
  const [timeOfSession, setTimeOfSession] = useState("");

  // Consent form
  const [consentFormSigned, setConsentFormSigned] = useState(false);

  // Form validation
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Automatically compute total amount whenever amount or discount changes
  useEffect(() => {
    const numericAmount = parseFloat(amount) || 0;
    const numericDiscount = parseFloat(packageDiscount) || 0;
    const computedTotal =
      numericAmount - (numericAmount * numericDiscount) / 100;
    setTotalAmount(computedTotal.toFixed(2));
  }, [amount, packageDiscount]);

  if (!isOpen) return null;

  console.log("Current state values:", {
    personInCharge,
    packageName,
    treatment
  });

  // Handle form submission, sending new patient record to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitAttempted(true);

    // Validate required dropdown selections
    const errors = {};
    if (!personInCharge) errors.personInCharge = "Person in charge is required";
    if (!packageName) errors.packageName = "Package is required";
    if (!treatment) errors.treatment = "Treatment is required";

    setFormErrors(errors);

    // If there are validation errors, stop submission
    if (Object.keys(errors).length > 0) {
      console.error("Form validation failed:", errors);
      return;
    }

    // Parse numeric values for the payload
    const numericTotal = parseFloat(totalAmount) || 0;
    const numericDiscount = parseFloat(packageDiscount) || 0;

    console.log("Form values before submission:", {
      patientName,
      personInCharge,
      packageName,
      treatment,
      amount: parseFloat(amount) || 0,
      packageDiscount: numericDiscount,
      totalAmount: numericTotal,
      paymentMethod,
      dateOfSession,
      timeOfSession,
      consentFormSigned
    });

    // Construct payload matching the server's expected field names and data types
    const payload = {
      patient_name: patientName,
      person_in_charge: personInCharge,
      package_name: packageName,
      treatment: treatment,
      amount: parseFloat(amount) || 0,
      package_discount: numericDiscount,
      total_amount: numericTotal,
      payment_method: paymentMethod,
      date_of_session: dateOfSession,
      time_of_session: timeOfSession,
      consent_form_signed: consentFormSigned
    };

    console.log("Payload being sent to API:", payload);

    try {
      const response = await fetch("http://localhost:4000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Patient record created:", data);
        onClose(); // Close modal upon success
      } else {
        const errorData = await response.text();
        console.error("Failed to create patient record:", errorData);
      }
    } catch (error) {
      console.error("Error during patient record creation:", error);
    }
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <UserIcon />
        </ModalIcon>
        <ModalTitle>CREATE PATIENT RECORD</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* PATIENT NAME */}
            <InputContainer>
              <InputLabel>PATIENT NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input
                  placeholder="Full name of the patient"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="bg-[#F5F3F0]"
                />
              </InputTextField>
            </InputContainer>

            {/* PERSON IN CHARGE */}
            <InputContainer>
              <InputLabel>PERSON IN CHARGE</InputLabel>

              <ModalSelect
                placeholder="Person in charge of the session"
                icon={<UserIDIcon className="w-4 h-4" />}
                value={personInCharge}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  console.log(
                    "Selected person in charge (direct):",
                    selectedValue
                  );
                  setPersonInCharge(selectedValue);
                  setFormErrors({ ...formErrors, personInCharge: null });
                }}
              >
                <SelectItem value="Jessica">Jessica</SelectItem>
                <SelectItem value="Jimmy">Jimmy</SelectItem>
              </ModalSelect>
              {formSubmitAttempted && formErrors.personInCharge && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.personInCharge}
                </p>
              )}
            </InputContainer>

            {/* PACKAGE */}
            <InputContainer>
              <InputLabel>PACKAGE</InputLabel>
              <ModalSelect
                placeholder="Select Package"
                icon={<PackageIcon className="w-4 h-4" />}
                value={packageName}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  console.log("Selected package (direct):", selectedValue);
                  setPackageName(selectedValue);
                  setFormErrors({ ...formErrors, packageName: null });
                }}
              >
                <SelectItem value="Package 1">Package 1</SelectItem>
                <SelectItem value="Package 2">Package 2</SelectItem>
                <SelectItem value="Package 3">Package 3</SelectItem>
              </ModalSelect>
              {formSubmitAttempted && formErrors.packageName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.packageName}
                </p>
              )}
            </InputContainer>

            {/* TREATMENT */}
            <InputContainer>
              <InputLabel>TREATMENT</InputLabel>
              <ModalSelect
                placeholder="Select Package"
                icon={<TreatmentIcon className="w-4 h-4" />}
                value={treatment}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  console.log("Selected treatment (direct):", selectedValue);
                  setTreatment(selectedValue);
                  setFormErrors({ ...formErrors, treatment: null });
                }}
              >
                <SelectItem value="Treatment 1">Treatment 1</SelectItem>
                <SelectItem value="Treatment 2">Treatment 2</SelectItem>
                <SelectItem value="Treatment 3">Treatment 3</SelectItem>
              </ModalSelect>
              {formSubmitAttempted && formErrors.treatment && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.treatment}
                </p>
              )}
            </InputContainer>

            {/* TOTAL AMOUNT (CURRENCY) - Computed */}
            <InputContainer>
              <InputLabel>TOTAL AMOUNT</InputLabel>
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
                  value={totalAmount}
                  readOnly
                />
              </InputTextField>
            </InputContainer>

            {/* PACKAGE DISCOUNT (PERCENTAGE) */}
            <InputContainer>
              <InputLabel>PACKAGE DISCOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PercentageIcon />
                </InputIcon>
                <CurrencyInput
                  className="outline-none flex-1 bg-[#F5F3F0]"
                  suffix="%"
                  placeholder="0%"
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  value={packageDiscount}
                  onValueChange={(value) => setPackageDiscount(value || "")}
                />
              </InputTextField>
            </InputContainer>

            {/* AMOUNT (CURRENCY) */}
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
                  onValueChange={(value) => setAmount(value || "")}
                />
              </InputTextField>
            </InputContainer>
          </div>

          {/* PAYMENT METHOD RADIO */}
          <div className="flex flex-col my-4">
            <h5 className="text-xl leading-8 font-semibold">PAYMENT METHOD</h5>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(val) => setPaymentMethod(val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-payment" id="full-payment" />
                <label htmlFor="full-payment">FULL PAYMENT</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="installment" id="installment" />
                <label htmlFor="installment">INSTALLMENT</label>
              </div>
            </RadioGroup>
          </div>

          {/* DATE AND TIME OF SESSION */}
          <div className="flex flex-row w-full gap-4">
            <InputContainer className="flex-1">
              <InputLabel>DATE OF SESSION</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  type="date"
                  className="text-input bg-[#F5F3F0]"
                  placeholder="Date of Session"
                  value={dateOfSession}
                  onChange={(e) => setDateOfSession(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>

            <InputContainer className="flex-1">
              <InputLabel>TIME OF SESSION</InputLabel>
              <InputTextField className="flex-1">
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  type="time"
                  className="text-input bg-[#F5F3F0]"
                  placeholder="Time of Session"
                  value={timeOfSession}
                  onChange={(e) => setTimeOfSession(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>
          </div>

          {/* CONSENT FORM CHECKBOX */}
          <div className="flex flex-col gap-4 my-4">
            <h5 className="text-xl leading-8 font-semibold">
              PATIENT CONSENT FORM
            </h5>
            <div className="flex flex-row gap-3 items-center justify-start">
              <Checkbox
                id="consent"
                checked={consentFormSigned}
                onCheckedChange={(checked) => setConsentFormSigned(!!checked)}
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                CONSENT FORM HAS BEEN SIGNED
              </label>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button
              type="button"
              variant="outline"
              className="w-1/2"
              onClick={onClose}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button type="submit" className="w-1/2">
              <PlusIcon />
              ADD ENTRY
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreatePatientEntry;
