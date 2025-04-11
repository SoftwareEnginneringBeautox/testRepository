import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
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

import {
  Select,
  SelectItem,
  ModalSelectTrigger,
  ModalSelectContent
} from "@/components/ui/Select";

import { TreatmentMultiSelect } from "@/components/ui/TreatmentMultiSelect";

import PesoIcon from "@/assets/icons/PesoIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import UserIcon from "@/assets/icons/UserIcon";
import UserIDIcon from "@/assets/icons/UserIDIcon";
import CircleUserIcon from "@/assets/icons/CircleUserIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import PercentageIcon from "@/assets/icons/PercentageIcon";
import UpdateIcon from "@/assets/icons/UpdateIcon";

function UpdatePatientEntry({ isOpen, onClose, entryData, onSubmit }) {
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

  const [packagesList, setPackagesList] = useState([]);
  const [treatmentsList, setTreatmentsList] = useState([]);
  const [aestheticianList, setAestheticianList] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // For handling new package or treatment selection
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [newAmount, setNewAmount] = useState("0");
  const [newPaymentMethod, setNewPaymentMethod] = useState("full-payment");
  const [newAmountPaid, setNewAmountPaid] = useState("0");
  const [packageDiscount, setPackageDiscount] = useState("0");
  const [sessionsLeft, setSessionsLeft] = useState(0);

  useEffect(() => {
    if (entryData) {
      const initialData = {
        ...entryData,
        package_name: entryData.package_name || "",
        treatment_ids: entryData.treatment_ids || [],
        payment_method: entryData.payment_method || "",
        date_of_session: entryData.date_of_session?.slice(0, 10) || "",
        time_of_session: entryData.time_of_session?.slice(0, 5) || "",
        consent_form_signed: entryData.consent_form_signed ?? false,
        additional_payment: "0", // New field for additional payment
        sessions_left: entryData.sessions_left || 0 // Track sessions left
      };

      setOriginalData(initialData);
      setFormData({
        date_of_session: initialData.date_of_session,
        time_of_session: initialData.time_of_session,
        consent_form_signed: initialData.consent_form_signed,
        additional_payment: "0", // Initialize additional payment as 0
        sessions_left: Math.max(0, (initialData.sessions_left || 0) - 1) // Decrement sessions by 1 for this visit
      });

      setSessionsLeft(Math.max(0, (initialData.sessions_left || 0) - 1));
    }

    const fetchAestheticians = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/getusers?archived=false`,
          {
            credentials: "include"
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        const aestheticians = Array.isArray(data)
          ? data.filter(
              (user) =>
                user.role?.toLowerCase() === "aesthetician" &&
                user.archived !== true
            )
          : [];

        setAestheticianList(aestheticians);
      } catch (error) {
        console.error("Error fetching aestheticians:", error);
        setAestheticianList([]); // fallback to empty list
      }
    };

    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/packages?archived=false`, {
          credentials: "include"
        });
        const data = await res.json();
        setPackagesList(data);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      }
    };

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
        console.error("Failed to fetch treatments:", err);
      }
    };

    fetchAestheticians();
    fetchPackages();
    fetchTreatments();
  }, [entryData, API_BASE_URL]);

  // Set default next session date to 7 days from current date
  useEffect(() => {
    if (entryData && !formData.date_of_session) {
      const currentDate = new Date(entryData.date_of_session);
      currentDate.setDate(currentDate.getDate() + 7); // Add 7 days

      const nextSessionDate = currentDate.toISOString().slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        date_of_session: nextSessionDate
      }));
    }
  }, [entryData, formData.date_of_session]);

  // Calculate new amount based on package or treatment selection
  useEffect(() => {
    let calculatedAmount = 0;
    let calculatedSessions = 0;

    if (selectedPackage) {
      const pkg = packagesList.find((p) => p.package_name === selectedPackage);
      if (pkg) {
        calculatedAmount = parseFloat(pkg.price) || 0;
        calculatedSessions = parseInt(pkg.sessions) || 0;
      }
      // Clear treatments when package is selected
      setSelectedTreatments([]);
    } else if (selectedTreatments.length > 0) {
      // Calculate total from selected treatments
      calculatedAmount = selectedTreatments.reduce((sum, treatmentId) => {
        const treatment = treatmentsList.find((t) => t.id === treatmentId);
        return sum + (parseFloat(treatment?.price) || 0);
      }, 0);

      // One session per treatment
      calculatedSessions = selectedTreatments.length;
    }

    // Apply discount if any
    const discount = parseFloat(packageDiscount) || 0;
    if (discount > 0) {
      calculatedAmount = calculatedAmount - (calculatedAmount * discount) / 100;
    }

    setNewAmount(calculatedAmount.toFixed(2));
    setSessionsLeft(calculatedSessions);

    // When payment method changes, update amount paid
    if (newPaymentMethod === "full-payment") {
      setNewAmountPaid(calculatedAmount.toFixed(2));
    }
  }, [
    selectedPackage,
    selectedTreatments,
    packagesList,
    treatmentsList,
    packageDiscount,
    newPaymentMethod
  ]);

  if (!isOpen) return null;

  // Calculate original total and remaining balance
  const total = parseFloat(originalData.total_amount || "0");
  const initialPaid = parseFloat(originalData.amount_paid || "0");
  const additionalPayment = parseFloat(formData.additional_payment || "0");
  const totalPaid = initialPaid + additionalPayment;
  const remainingBalance = total - totalPaid;

  // Calculate new payment details
  const newTotal = parseFloat(newAmount || "0");
  const newPaid = parseFloat(newAmountPaid || "0");
  const newBalance = newTotal - newPaid;

  // Is the payment complete?

  const isNewPaid = newBalance <= 0;

  // Check if current package/treatments are completed
  const hasCompletedCurrentTreatments =
    (!originalData.package_name || originalData.package_name === "") &&
    (!originalData.treatment_ids ||
      originalData.treatment_ids.length === 0 ||
      sessionsLeft <= 0);

  const handleSubmit = async () => {
    setFormSubmitAttempted(true);
    const errors = {};

    // Validate date is not in the past
    const selectedDate = new Date(formData.date_of_session);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time portion for comparison

    if (selectedDate < today) {
      errors.date_of_session = "Next session date cannot be in the past";
    }

    // Validate time is within business hours (9 AM to 6 PM)
    if (formData.time_of_session) {
      const [hours, minutes] = formData.time_of_session.split(':').map(Number);
      const startBusinessHour = 9; // 9 AM
      const endBusinessHour = 18;  // 6 PM
      
      if (hours < startBusinessHour || hours > endBusinessHour || 
          (hours === endBusinessHour && minutes > 0)) {
        errors.time_of_session = "Session time must be between 9:00 AM and 6:00 PM";
      }
    }

    // If additional payment is entered, update remaining balance
    if (
      formData.additional_payment &&
      parseFloat(formData.additional_payment) > 0
    ) {
      // Validate payment amount doesn't exceed remaining balance
      if (parseFloat(formData.additional_payment) > total - initialPaid) {
        errors.additional_payment = "Payment exceeds remaining balance";
      }
    }

    // If adding new package/treatments, validate selection
    if (
      hasCompletedCurrentTreatments &&
      !selectedPackage &&
      selectedTreatments.length === 0
    ) {
      errors.newTreatment = "Please select a new package or treatment";
    }

    // If adding new package/treatments and using installment, validate amount paid
    if (
      (selectedPackage || selectedTreatments.length > 0) &&
      newPaymentMethod === "installment" &&
      (parseFloat(newAmountPaid) <= 0 ||
        parseFloat(newAmountPaid) > parseFloat(newAmount))
    ) {
      errors.newAmountPaid =
        "Please enter a valid amount paid (greater than 0 and not exceeding the total)";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Prepare data for submission
    let updatedData = {
      id: entryData.id,
      date_of_session: formData.date_of_session,
      time_of_session: formData.time_of_session,
      consent_form_signed: formData.consent_form_signed,
      amount_paid: totalPaid.toString(), // Update total amount paid
      sessions_left: sessionsLeft
      // Update paid status based on remaining balance
    };

    // If adding new package/treatments, include them
    if (hasCompletedCurrentTreatments) {
      if (selectedPackage) {
        updatedData.package_name = selectedPackage;
        updatedData.treatment_ids = [];
        updatedData.total_amount = parseFloat(newAmount);
        updatedData.amount_paid = parseFloat(newAmountPaid);
        updatedData.payment_method = newPaymentMethod;
        updatedData.package_discount = parseFloat(packageDiscount);
        updatedData.remaining_balance = newBalance;
      } else if (selectedTreatments.length > 0) {
        updatedData.package_name = "";
        updatedData.treatment_ids = selectedTreatments;
        updatedData.total_amount = parseFloat(newAmount);
        updatedData.amount_paid = parseFloat(newAmountPaid);
        updatedData.payment_method = newPaymentMethod;
        updatedData.package_discount = parseFloat(packageDiscount);
        updatedData.remaining_balance = newBalance;
      }
    }

    // Submit to server
    await onSubmit(updatedData);

    // If additional payment made, add to sales records
    if (additionalPayment > 0) {
      try {
        const salesPayload = {
          client: entryData.patient_name,
          person_in_charge: entryData.person_in_charge,
          date_transacted: new Date().toISOString().split("T")[0],
          payment_method: entryData.payment_method || "Installment",
          packages: entryData.package_name || "",
          treatment: Array.isArray(entryData.treatment_ids)
            ? treatmentsList
                .filter((t) => entryData.treatment_ids.includes(t.id))
                .map((t) => t.treatment_name)
                .join(", ")
            : "",
          payment: additionalPayment,
          reference_no: entryData.reference_number || `REF${Date.now()}`
        };

        await fetch(`${API_BASE_URL}/sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(salesPayload)
        });
      } catch (err) {
        console.error("Error adding sales record:", err);
      }
    }

    // If a new package or treatment is selected, create a new sales record
    if (
      hasCompletedCurrentTreatments &&
      (selectedPackage || selectedTreatments.length > 0)
    ) {
      try {
        const newSalesPayload = {
          client: entryData.patient_name,
          person_in_charge: entryData.person_in_charge,
          date_transacted: new Date().toISOString().split("T")[0],
          payment_method: newPaymentMethod,
          packages: selectedPackage || "",
          treatment:
            selectedTreatments.length > 0
              ? treatmentsList
                  .filter((t) => selectedTreatments.includes(t.id))
                  .map((t) => t.treatment_name)
                  .join(", ")
              : "",
          payment: parseFloat(newAmountPaid),
          reference_no: `NEWSRV${Date.now()}`
        };

        await fetch(`${API_BASE_URL}/sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newSalesPayload)
        });
      } catch (err) {
        console.error("Error adding new service sales record:", err);
      }
    }

    // If there are remaining sessions, create a new appointment
    if (sessionsLeft > 0) {
      try {
        const appointmentPayload = {
          patient_record_id: entryData.id,
          full_name: entryData.patient_name,
          contact_number: entryData.contact_number,
          age: entryData.age ? parseInt(entryData.age) : null,
          email: entryData.email,
          date_of_session: formData.date_of_session,
          time_of_session: formData.time_of_session,
          archived: false
        };

        await fetch(`${API_BASE_URL}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(appointmentPayload)
        });
      } catch (err) {
        console.error("Error creating next appointment:", err);
      }
    }
  };

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

            {/* Current PACKAGE */}
            <InputContainer>
              <InputLabel>CURRENT PACKAGE</InputLabel>
              <p data-cy="package-display">
                {originalData.package_name || "None"}
              </p>
            </InputContainer>

            {/* Current TREATMENT */}
            <InputContainer>
              <InputLabel>CURRENT TREATMENT</InputLabel>
              <p data-cy="treatment-display">
                {Array.isArray(originalData.treatment_ids) &&
                originalData.treatment_ids.length > 0
                  ? treatmentsList
                      .filter((t) => originalData.treatment_ids.includes(t.id))
                      .map((t) => t.treatment_name)
                      .join(", ")
                  : "None"}
              </p>
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
                  readOnly
                />
              </InputTextField>
              <p className="text-sm text-gray-500 mt-1">
                {sessionsLeft > 0
                  ? `${sessionsLeft} sessions left after this visit`
                  : "No sessions left. Consider adding a new package or treatment."}
              </p>
            </InputContainer>

            {/* Current financial status section */}
            {(!hasCompletedCurrentTreatments || total > 0) && (
              <div className="border-t border-b gap-4 border-gray-200 dark:border-gray-700 py-4 my-2">
                <h5 className="text-lg font-semibold mb-3">
                  Current Account Status
                </h5>

                <InputContainer>
                  <InputLabel>TOTAL AMOUNT</InputLabel>
                  <p data-cy="total-amount-display">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP"
                    }).format(total)}
                  </p>
                </InputContainer>

                <InputContainer>
                  <InputLabel>AMOUNT PAID</InputLabel>
                  <p data-cy="amount-paid-display">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP"
                    }).format(initialPaid)}
                  </p>
                </InputContainer>

                {remainingBalance > 0 && (
                  <InputContainer>
                    <InputLabel>ADDITIONAL PAYMENT</InputLabel>
                    <InputTextField>
                      <InputIcon>
                        <PesoIcon />
                      </InputIcon>
                      <CurrencyInput
                        data-cy="additional-payment-input"
                        className="outline-none flex-1 bg-transparent dark:text-customNeutral-100 dark:placeholder-customNeutral-300"
                        prefix="₱"
                        placeholder="₱0.00"
                        decimalsLimit={2}
                        allowNegativeValue={false}
                        value={formData.additional_payment || ""}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            additional_payment: value || "0"
                          })
                        }
                      />
                    </InputTextField>
                    {formSubmitAttempted && formErrors.additional_payment && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.additional_payment}
                      </p>
                    )}
                  </InputContainer>
                )}

                <InputContainer>
                  <InputLabel>REMAINING BALANCE</InputLabel>
                  <p
                    data-cy="remaining-balance-display"
                    className={
                      remainingBalance <= 0 ? "text-green-500 font-bold" : ""
                    }
                  >
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP"
                    }).format(remainingBalance)}
                    {remainingBalance <= 0 && " (PAID)"}
                  </p>
                </InputContainer>

                <InputContainer>
                  <InputLabel>PAYMENT METHOD</InputLabel>
                  <p data-cy="payment-method-display">
                    {originalData.payment_method}
                  </p>
                </InputContainer>
              </div>
            )}

            {/* NEW PACKAGE OR TREATMENT SECTION */}
            {hasCompletedCurrentTreatments && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-2">
                <h5 className="text-lg font-semibold mb-4">
                  Add New Package or Treatment
                </h5>

                {/* NEW PACKAGE */}
                <InputContainer>
                  <InputLabel>SELECT NEW PACKAGE</InputLabel>
                  <Select
                    value={selectedPackage}
                    onValueChange={(value) => {
                      if (value === "CLEAR") {
                        setSelectedPackage("");
                      } else {
                        setSelectedPackage(value);
                      }
                    }}
                  >
                    <ModalSelectTrigger
                      data-cy="new-package-select"
                      icon={<PackageIcon className="w-4 h-4" />}
                      placeholder="Select new package"
                      className={
                        formSubmitAttempted && formErrors.newTreatment
                          ? "border-red-500"
                          : ""
                      }
                    />
                    <ModalSelectContent>
                      <SelectItem value="CLEAR">Clear Selection</SelectItem>
                      {packagesList.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.package_name}>
                          {pkg.package_name} - ₱{pkg.price} - {pkg.sessions}{" "}
                          sessions
                        </SelectItem>
                      ))}
                    </ModalSelectContent>
                  </Select>
                </InputContainer>

                {/* OR text */}
                <div className="my-3 text-center text-gray-500">OR</div>

                {/* NEW TREATMENTS */}
                <InputContainer>
                  <InputLabel>SELECT NEW TREATMENTS</InputLabel>
                  <TreatmentMultiSelect
                    data-cy="new-treatment-select"
                    options={[
                      { value: "CLEAR", label: "Clear Selection" },
                      ...treatmentsList.map((t) => ({
                        value: t.id,
                        label: `${t.treatment_name} - ₱${t.price}`
                      }))
                    ]}
                    value={selectedTreatments}
                    onChange={(selected) => {
                      if (selected.includes("CLEAR")) {
                        setSelectedTreatments([]);
                      } else {
                        setSelectedTreatments(selected);
                        setSelectedPackage("");
                      }
                    }}
                    placeholder="Select new treatments"
                    className={
                      formSubmitAttempted && formErrors.newTreatment
                        ? "border-red-500"
                        : ""
                    }
                  />
                </InputContainer>

                {(selectedPackage || selectedTreatments.length > 0) && (
                  <>
                    {/* PACKAGE DISCOUNT */}
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
                          onValueChange={(value) =>
                            setPackageDiscount(value || "0")
                          }
                        />
                      </InputTextField>
                    </InputContainer>

                    {/* TOTAL AMOUNT */}
                    <InputContainer>
                      <InputLabel>NEW TOTAL AMOUNT</InputLabel>
                      <InputTextField>
                        <InputIcon>
                          <PesoIcon />
                        </InputIcon>
                        <CurrencyInput
                          data-cy="new-amount-input"
                          className="outline-none flex-1 bg-transparent dark:text-customNeutral-100 dark:placeholder-customNeutral-300"
                          prefix="₱"
                          placeholder="₱0.00"
                          decimalsLimit={2}
                          allowNegativeValue={false}
                          value={newAmount}
                          readOnly
                        />
                      </InputTextField>
                    </InputContainer>

                    {/* PAYMENT METHOD */}
                    <InputContainer>
                      <InputLabel>PAYMENT METHOD</InputLabel>
                      <RadioGroup
                        value={newPaymentMethod}
                        onValueChange={(val) => {
                          setNewPaymentMethod(val);
                          if (val === "full-payment") {
                            setNewAmountPaid(newAmount); // Set full amount if full payment
                          } else {
                            setNewAmountPaid("0"); // Reset if installment
                          }
                        }}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value="full-payment"
                            id="new-full-payment"
                          />
                          <label htmlFor="new-full-payment" className="text-sm">
                            FULL PAYMENT
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value="installment"
                            id="new-installment"
                          />
                          <label htmlFor="new-installment" className="text-sm">
                            INSTALLMENT
                          </label>
                        </div>
                      </RadioGroup>
                    </InputContainer>

                    {/* AMOUNT PAID */}
                    <InputContainer>
                      <InputLabel>AMOUNT PAID</InputLabel>
                      <InputTextField>
                        <InputIcon>
                          <PesoIcon />
                        </InputIcon>
                        <CurrencyInput
                          data-cy="new-amount-paid-input"
                          className="outline-none flex-1 bg-transparent dark:text-customNeutral-100 dark:placeholder-customNeutral-300"
                          prefix="₱"
                          placeholder="₱0.00"
                          decimalsLimit={2}
                          allowNegativeValue={false}
                          value={newAmountPaid}
                          onValueChange={(value) =>
                            setNewAmountPaid(value || "0")
                          }
                          readOnly={newPaymentMethod === "full-payment"}
                        />
                      </InputTextField>
                      {formSubmitAttempted && formErrors.newAmountPaid && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.newAmountPaid}
                        </p>
                      )}
                    </InputContainer>

                    {/* REMAINING BALANCE */}
                    <InputContainer>
                      <InputLabel>NEW REMAINING BALANCE</InputLabel>
                      <p
                        className={
                          newBalance <= 0 ? "text-green-500 font-bold" : ""
                        }
                      >
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP"
                        }).format(newBalance)}
                        {newBalance <= 0 && " (PAID)"}
                      </p>
                    </InputContainer>
                  </>
                )}

                {formSubmitAttempted && formErrors.newTreatment && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.newTreatment}
                  </p>
                )}
              </div>
            )}
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
                  value={formData.date_of_session || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date_of_session: e.target.value
                    })
                  }
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.date_of_session && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.date_of_session}
                </p>
              )}
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
                  className={`text-input ${formSubmitAttempted && formErrors.time_of_session ? "border-red-500" : ""}`}
                  required
                  value={formData.time_of_session || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time_of_session: e.target.value
                    })
                  }
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.time_of_session && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.time_of_session}
                </p>
              )}
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
              onClick={handleSubmit}
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
