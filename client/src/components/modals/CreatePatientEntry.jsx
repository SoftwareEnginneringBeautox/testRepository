import React, { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Checkbox } from "@/components/ui/Checkbox";

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
  Input
} from "@/components/ui/Input";

import {
  Select,
  SelectItem,
  ModalSelectTrigger,
  ModalSelectContent
} from "@/components/ui/Select";

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

import axios from "axios";

function CreatePatientEntry({ isOpen, onClose }) {
  const [patientName, setPatientName] = useState("");
  const [personInCharge, setPersonInCharge] = useState("");
  const [packageName, setPackageName] = useState("");
  const [treatment, setTreatment] = useState("");

  const [amount, setAmount] = useState(""); // Original amount input by the user
  const [packageDiscount, setPackageDiscount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState(""); // Amount paid by the patient
  const [referenceNumber, setReferenceNumber] = useState("");

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

  // List of aestheticians for "person in charge"
  const [aestheticianList, setAestheticianList] = useState([]);
  // List for packages and treatments fetched from the database
  const [packagesList, setPackagesList] = useState([]);
  const [treatmentsList, setTreatmentsList] = useState([]);

  // Compute total amount automatically whenever amount or discount changes
  useEffect(() => {
    const numericAmount = parseFloat(amount) || 0;
    const numericDiscount = parseFloat(packageDiscount) || 0;
    const computedTotal =
      numericAmount - (numericAmount * numericDiscount) / 100;
    setTotalAmount(computedTotal.toFixed(2));
  }, [amount, packageDiscount]);

  // Fetch the list of aestheticians for "person in charge"
  useEffect(() => {
    async function fetchAestheticians() {
      try {
        const response = await axios.get(`${API_BASE_URL}/getusers`, {
          withCredentials: true
        });
        const aestheticians = response.data.filter(
          (user) => user.role && user.role.toLowerCase() === "aesthetician"
        );
        setAestheticianList(aestheticians);
      } catch (error) {
        console.error("Error fetching aestheticians:", error);
      }
    }
    fetchAestheticians();
  }, []);

  // Fetch packages list from the database
  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/packages?archived=false`, {
          withCredentials: true
        });
        setPackagesList(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    }
    fetchPackages();
  }, []);

  // Fetch treatments list from the database
  useEffect(() => {
    async function fetchTreatments() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/treatments?archived=false`, {
          withCredentials: true
        });
        setTreatmentsList(response.data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
    }
    fetchTreatments();
  }, []);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const ref = now
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 17); // YYYYMMDDHHMMSSmmm
      setReferenceNumber(`REF${ref}`);
    }
  }, [isOpen]);
  

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

    // Stop submission if there are errors
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
      amountPaid: parseFloat(amountPaid) || 0,
      paymentMethod,
      dateOfSession,
      timeOfSession,
      consent_form_signed: consentFormSigned
    });

    // Construct payload matching the server's expected field names and data types
    const payload = {
      patient_name: patientName,
      person_in_charge: personInCharge,
      package_name: packageName,
      treatment: treatment,
      amount: parseFloat(amount) || 0,
      amount_paid: parseFloat(amountPaid) || 0,
      package_discount: numericDiscount,
      total_amount: numericTotal,
      payment_method: paymentMethod,
      date_of_session: dateOfSession,
      time_of_session: timeOfSession,
      consent_form_signed: consentFormSigned,
      reference_number: referenceNumber
    };

    console.log("Payload being sent to API:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/api/patients`, {
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

  const numericTotalAmount = parseFloat(totalAmount) || 0;
  const numericAmountPaid = parseFloat(amountPaid) || 0;
  const remainingBalance = numericTotalAmount - numericAmountPaid;

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
              <Select
                value={personInCharge}
                onValueChange={(value) => {
                  console.log("Selected person in charge:", value);
                  setPersonInCharge(value);
                }}
              >
                <ModalSelectTrigger
                  icon={<UserIDIcon className="w-4 h-4" />}
                  placeholder="Select person in charge"
                  className={
                    formSubmitAttempted && formErrors.personInCharge
                      ? "border-red-500"
                      : ""
                  }
                />
                <ModalSelectContent>
                  {aestheticianList.map((user) => (
                    <SelectItem key={user.id} value={user.username}>
                      {user.username}
                    </SelectItem>
                  ))}
                </ModalSelectContent>
              </Select>
              {formSubmitAttempted && formErrors.personInCharge && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.personInCharge}
                </p>
              )}
            </InputContainer>

            {/* PACKAGE */}
            <InputContainer>
              <InputLabel>PACKAGE</InputLabel>

              <Select
                value={packageName}
                onValueChange={(value) => {
                  console.log("Selected package:", value);
                  setPackageName(value);
                }}
              >
                <ModalSelectTrigger
                  icon={<PackageIcon className="w-4 h-4" />}
                  placeholder="Select package"
                  className={
                    formSubmitAttempted && formErrors.packageName
                      ? "border-red-500"
                      : ""
                  }
                />
                <ModalSelectContent>
                  {packagesList.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.package_name}>
                      {pkg.package_name} - ₱{pkg.price}
                    </SelectItem>
                  ))}
                </ModalSelectContent>
              </Select>
              {formSubmitAttempted && formErrors.packageName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.packageName}
                </p>
              )}
            </InputContainer>

            {/* TREATMENT */}
            <InputContainer>
              <InputLabel>TREATMENT</InputLabel>

              <Select
                value={treatment}
                onValueChange={(value) => {
                  console.log("Selected treatment:", value);
                  setTreatment(value);
                }}
              >
                <ModalSelectTrigger
                  icon={<TreatmentIcon className="w-4 h-4" />}
                  placeholder="Select treatment"
                  className={
                    formSubmitAttempted && formErrors.treatment
                      ? "border-red-500"
                      : ""
                  }
                />
                <ModalSelectContent>
                  {treatmentsList.map((t) => (
                    <SelectItem key={t.id} value={t.treatment_name}>
                      {t.treatment_name} - ₱{t.price}
                    </SelectItem>
                  ))}
                </ModalSelectContent>
              </Select>
              {formSubmitAttempted && formErrors.treatment && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.treatment}
                </p>
              )}
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

            <InputContainer>
              <InputLabel>AMOUNT PAID</InputLabel>
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
                  value={amountPaid}
                  onValueChange={(value) => setAmountPaid(value || "")}
                />
              </InputTextField>
            </InputContainer>

            {/* REMAINING BALANCE */}
            <InputContainer>
              <InputLabel>REMAINING BALANCE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <Input
                  readOnly
                  className="bg-[#F5F3F0] text-gray-500"
                  value={
                    isNaN(remainingBalance)
                      ? ""
                      : new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP"
                        }).format(remainingBalance)
                  }
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

            <InputContainer>
            <InputLabel>REFERENCE NUMBER</InputLabel>
            <InputTextField>
              <Input readOnly value={referenceNumber} className="bg-[#F5F3F0] text-gray-500" />
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
                Consent form has been signed
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
