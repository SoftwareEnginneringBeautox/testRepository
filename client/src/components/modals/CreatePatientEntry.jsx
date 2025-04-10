import React, { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Checkbox } from "@/components/ui/Checkbox";
import { TreatmentMultiSelect } from "@/components/ui/TreatmentMultiSelect";

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
import EmailIcon from "@/assets/icons/EmailIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import AgeIcon from "@/assets/icons/AgeIcon";

import axios from "axios";

function CreatePatientEntry({ isOpen, onClose }) {
  const [patientName, setPatientName] = useState("");
  const [personInCharge, setPersonInCharge] = useState("");
  const [packageName, setPackageName] = useState("");
  const [treatment, setTreatment] = useState("");
  const [sessionsLeft, setSessionsLeft] = useState(0);

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

  const [contactNumber, setContactNumber] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");

  // Effect for setting amount based on package or treatments
  useEffect(() => {
    if (packageName) {
      const pkg = packagesList.find((p) => p.package_name === packageName);
      if (pkg && !isNaN(parseFloat(pkg.price))) {
        setAmount(parseFloat(pkg.price).toFixed(2));
        // Set sessions left based on package
        setSessionsLeft(pkg.sessions || 0);
      } else {
        setAmount(""); // fallback if price is not a number
        setSessionsLeft(0);
      }
    } else if (Array.isArray(treatment) && treatment.length > 0) {
      const selected = treatmentsList.filter((t) => treatment.includes(t.id));
      const total = selected.reduce((sum, t) => {
        const price = parseFloat(t.price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
      setAmount(total.toFixed(2));
      // For treatments, default to 1 session left for each treatment
      setSessionsLeft(treatment.length);
    } else {
      setAmount("");
      setSessionsLeft(0);
    }
  }, [packageName, treatment, treatmentsList, packagesList]);

  // Effect for full payment
  useEffect(() => {
    if (paymentMethod === "full-payment" && totalAmount) {
      setAmountPaid(totalAmount);
    }
  }, [paymentMethod, totalAmount]);

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
          (user) =>
            user.role &&
            user.role.toLowerCase() === "aesthetician" &&
            !user.archived // assuming 'archived' is a boolean field
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
        const response = await axios.get(
          `${API_BASE_URL}/api/packages?archived=false`,
          {
            withCredentials: true
          }
        );
        setPackagesList(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    }
    fetchPackages();
  }, []);

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
        setTreatmentsList(data);
      } catch (err) {
        console.error("Error fetching treatments:", err);
      }
    };

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

    const errors = {};
    if (!personInCharge) {
      errors.personInCharge = "Person in charge is required";
    }

    if (!packageName && (!treatment || treatment.length === 0)) {
      errors.packageOrTreatment =
        "Select either a package or at least one treatment";
    }

    // Contact number validation - make required
    if (!contactNumber) {
      errors.contactNumber = "Contact number is required";
    } else {
      const phoneRegex = /^09\d{9}$/; // Philippine format: 09XXXXXXXXX
      if (!phoneRegex.test(contactNumber)) {
        errors.contactNumber = "Contact number should be in 09XXXXXXXXX format";
      }
    }

    // Age validation - make required
    if (!age) {
      errors.age = "Age is required";
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        errors.age = "Age must be between 0 and 120";
      }
    }

    // Email validation - make required
    if (!email) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (packageName && dateOfSession) {
      const selectedPackage = packagesList.find(
        (p) => p.package_name === packageName
      );
      const weeks = selectedPackage?.expiration;

      if (weeks && !isNaN(weeks)) {
        const createdAt = new Date(); // form creation time
        const sessionDate = new Date(dateOfSession);
        const expirationLimit = new Date(createdAt);
        expirationLimit.setDate(expirationLimit.getDate() + weeks * 7); // add weeks

        if (sessionDate > expirationLimit) {
          errors.dateOfSession = `Session date exceeds package expiration limit of ${weeks} week(s) from today (${expirationLimit
            .toISOString()
            .slice(0, 10)})`;
        }
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const numericTotal = parseFloat(totalAmount) || 0;
    const numericDiscount = parseFloat(packageDiscount) || 0;
    const numericAmount = parseFloat(amount) || 0;
    const numericAmountPaid = parseFloat(amountPaid) || 0;
    const remainingBalance = numericTotal - numericAmountPaid;

    const selectedTreatmentIds = Array.isArray(treatment)
      ? treatment.map(Number)
      : [];

    const selectedTreatmentNames = treatmentsList
      .filter((t) => selectedTreatmentIds.includes(t.id))
      .map((t) => t.treatment_name);


    // Patient Records Payload
    const patientPayload = {
      patient_name: patientName,
      contact_number: contactNumber,
      age: age ? parseInt(age) : null,
      email,
      person_in_charge: personInCharge,
      package_name: packageName,
      treatments: selectedTreatmentNames,
      treatment_ids: selectedTreatmentIds,
      amount: numericAmount,
      amount_paid: numericAmountPaid,
      package_discount: numericDiscount,
      total_amount: numericTotal,
      payment_method: paymentMethod,
      date_of_session: dateOfSession,
      time_of_session: timeOfSession,
      consent_form_signed: consentFormSigned,
      reference_number: referenceNumber,
      remaining_balance: remainingBalance,
      sessions_left: sessionsLeft,

    };

    try {
      // Submit to patient records
      const response = await fetch(`${API_BASE_URL}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patientPayload)
      });

      if (response.ok) {
        const patientData = await response.json();
        const patientId = patientData.patientId;

        // Submit to appointments
        try {
          const appointmentPayload = {
            patient_record_id: patientId,
            full_name: patientName,
            contact_number: contactNumber,
            age: age ? parseInt(age) : null,
            email,
            date_of_session: dateOfSession,
            time_of_session: timeOfSession,
            archived: false
          };

          const appointmentRes = await fetch(
            `${API_BASE_URL}/api/appointments`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(appointmentPayload)
            }
          );

          if (!appointmentRes.ok) {
            const errText = await appointmentRes.text();
            console.error("❌ Failed to insert appointment:", errText);
          } else {
            console.log("✅ Appointment successfully inserted");
          }
        } catch (err) {
          console.error("❌ Error inserting into appointments:", err);
        }

        // Submit to sales if payment was made
        if (numericAmountPaid > 0) {
          try {
            const salesPayload = {
              client: patientName,
              person_in_charge: personInCharge,
              date_transacted: new Date().toISOString().split('T')[0],
              payment_method: paymentMethod === "full-payment" ? "Full Payment" : "Installment",
              packages: packageName,
              treatment: selectedTreatmentNames.join(", "),
              payment: numericAmountPaid,
              reference_no: referenceNumber
            };

            const salesRes = await fetch(`${API_BASE_URL}/sales`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(salesPayload)
            });

            if (!salesRes.ok) {
              const errText = await salesRes.text();
              console.error("❌ Failed to insert sales record:", errText);
            } else {
              console.log("✅ Sales record successfully inserted");
            }
          } catch (err) {
            console.error("❌ Error inserting into sales:", err);
          }
        }

        onClose();
      } else {
        const errorText = await response.text();
        console.error("Submission failed:", errorText);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const numericTotalAmount = parseFloat(totalAmount) || 0;
  const numericAmountPaid = parseFloat(amountPaid) || 0;
  const remainingBalance = numericTotalAmount - numericAmountPaid;

  return (
    <ModalContainer data-cy="create-patient-entry-modal">
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
                  data-cy="patient-name-input"
                  placeholder="Full name of the patient"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>

            {/* CONTACT NUMBER */}
            <InputContainer>
              <InputLabel>CONTACT NUMBER</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PhoneIcon />
                </InputIcon>
                <Input
                  data-cy="contact-number-input"
                  placeholder="e.g. 09XXXXXXXXX"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className={` ${
                    formSubmitAttempted && formErrors.contactNumber
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.contactNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.contactNumber}
                </p>
              )}
            </InputContainer>

            {/* AGE */}
            <InputContainer>
              <InputLabel>AGE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <AgeIcon />
                </InputIcon>
                <Input
                  data-cy="age-input"
                  type="number"
                  min="0"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={` ${
                    formSubmitAttempted && formErrors.age
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.age && (
                <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>
              )}
            </InputContainer>

            {/* EMAIL */}
            <InputContainer>
              <InputLabel>EMAIL</InputLabel>
              <InputTextField>
                <InputIcon>
                  <EmailIcon />
                </InputIcon>
                <Input
                  data-cy="email-input"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={` ${
                    formSubmitAttempted && formErrors.email
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
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
                  data-cy="person-in-charge-select"
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
                    <SelectItem
                      data-cy="person-in-charge-option"
                      key={user.id}
                      value={user.username}
                    >
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
                  if (value === "CLEAR") {
                    setPackageName("");
                  } else {
                    setPackageName(value);
                    setTreatment(""); // Clear treatment if package is selected
                  }
                }}
              >
                <ModalSelectTrigger
                  data-cy="package-select"
                  icon={<PackageIcon className="w-4 h-4" />}
                  placeholder="Select package"
                  className={
                    formSubmitAttempted && formErrors.packageOrTreatment
                      ? "border-red-500"
                      : ""
                  }
                />
                <ModalSelectContent>
                  <SelectItem data-cy="package-option" value="CLEAR">
                    Clear Selection
                  </SelectItem>
                  {packagesList.map((pkg) => (
                    <SelectItem
                      data-cy="package-option"
                      key={pkg.id}
                      value={pkg.package_name}
                    >
                      {pkg.package_name} - ₱{pkg.price} - {pkg.sessions} sessions
                    </SelectItem>
                  ))}
                </ModalSelectContent>
              </Select>
              {formSubmitAttempted && formErrors.packageOrTreatment && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.packageOrTreatment}
                </p>
              )}
            </InputContainer>

            {/* TREATMENTS */}
            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>
              <TreatmentMultiSelect
                data-cy="treatment-select"
                options={[
                  { value: "CLEAR", label: "Clear Selection" },
                  ...treatmentsList.map((t) => ({
                    value: t.id,
                    label: `${t.treatment_name} - ₱${t.price}`
                  }))
                ]}
                value={Array.isArray(treatment) ? treatment : []}
                onChange={(selected) => {
                  if (selected.includes("CLEAR")) {
                    setTreatment([]);
                  } else {
                    setTreatment(selected);
                  }
                  setPackageName(""); // <-- always clear package here
                }}
                placeholder="Select treatments"
                className={
                  formSubmitAttempted && formErrors.packageOrTreatment
                    ? "border-red-500"
                    : ""
                }
              />

              {formSubmitAttempted && formErrors.packageOrTreatment && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.packageOrTreatment}
                </p>
              )}
            </InputContainer>

            {/* SESSIONS LEFT */}
            <InputContainer>
              <InputLabel>SESSIONS LEFT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PackageIcon />
                </InputIcon>
                <Input
                  data-cy="sessions-left-input"
                  type="number"
                  min="0"
                  value={sessionsLeft}
                  onChange={(e) => setSessionsLeft(parseInt(e.target.value) || 0)}
                  readOnly
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
                  data-cy="amount-input"
                  className="outline-none flex-1 bg-transparent dark:text-customNeutral-100 dark:placeholder-customNeutral-300"
                  prefix="₱"
                  placeholder="₱0.00"
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  value={amount}
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
                  data-cy="package-discount-input"
                  className="outline-none flex-1 bg-transparent dark:text-customNeutral-100 dark:placeholder-customNeutral-300"
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
                  data-cy="total-amount-input"
                  className="outline-none flex-1 bg-transparent dark:text-customNeutral-100 dark:placeholder-customNeutral-300"
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
                  data-cy="amount-paid-input"
                  className="outline-none flex-1 bg-transparent dark:text-customNeutral-100 dark:placeholder-customNeutral-300"
                  prefix="₱"
                  placeholder="₱0.00"
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  value={amountPaid}
                  onValueChange={(value) => setAmountPaid(value || "")}
                  readOnly={paymentMethod === "full-payment"}
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
          <div className="flex flex-col gap-2 mt-4">
            <InputContainer>
              <InputLabel>PAYMENT METHOD</InputLabel>

              <RadioGroup
                value={paymentMethod}
                onValueChange={(val) => {
                  setPaymentMethod(val);
                  if (val === "full-payment") {
                    setAmountPaid(totalAmount);
                  } else {
                    setAmountPaid(""); // reset if switching to installment
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    data-cy="payment-method-radio-full-payment"
                    value="full-payment"
                    id="full-payment"
                  />
                  <label htmlFor="full-payment" className="text-sm">
                    FULL PAYMENT
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    data-cy="payment-method-radio-installment"
                    value="installment"
                    id="installment"
                  />
                  <label htmlFor="installment" className="text-sm">
                    INSTALLMENT
                  </label>
                </div>
              </RadioGroup>
            </InputContainer>
          </div>

          {/* DATE AND TIME OF SESSION */}
          <div className="flex flex-row w-full gap-4 mt-4">
            <InputContainer className="flex-1">
              <InputLabel>DATE OF SESSION</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  data-cy="date-of-session-input"
                  type="date"
                  placeholder="Date of Session"
                  value={dateOfSession}
                  onChange={(e) => setDateOfSession(e.target.value)}
                  required
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.dateOfSession && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.dateOfSession}
                </p>
              )}
            </InputContainer>

            <InputContainer className="flex-1">
              <InputLabel>TIME OF SESSION</InputLabel>
              <InputTextField className="flex-1">
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  data-cy="time-of-session-input"
                  type="time"
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
                Consent form has been signed
              </label>
            </div>
          </div>

          <InputContainer>
            <InputLabel>REFERENCE NUMBER</InputLabel>
            <p>{referenceNumber}</p>
          </InputContainer>

          {/* ACTION BUTTONS */}
          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="submit-create-patient"
              type="button"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button type="submit" className="md:w-1/2">
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