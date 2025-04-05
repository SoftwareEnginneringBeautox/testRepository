import React, { useState, useEffect } from "react";

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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectIcon,
  ModalSelectTrigger,
  ModalSelectContent
} from "@/components/ui/Select";

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
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import EditIcon from "@/assets/icons/EditIcon";

function EditPatientEntry({ isOpen, onClose, entryData, onSubmit }) {
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({});
  

  const [packagesList, setPackagesList] = useState([]);
  const [treatmentsList, setTreatmentsList] = useState([]);
  const [aestheticianList, setAestheticianList] = useState([]);
  /*const [formData, setFormData] = useState({
    patient_name: "",
    person_in_charge: "",
    treatment: "",
    total_amount: "",
    payment_method: "",
    date_of_session: "",
    time_of_session: "",
    consent_form_signed: false
  });*/

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
        payment_method: entryData.payment_method || "",
      });
      setFormData({});
    }
    const fetchAestheticians = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/getusers?archived!=notTrue`, {
          credentials: "include"
        });
    
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/packages?archived=notTrue`, {
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/treatments?archived!=notTrue`, {
          credentials: "include"
        });
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
  const total = parseFloat(formData.total_amount ?? originalData.total_amount ?? "0");
  const paid = parseFloat(formData.amount_paid ?? originalData.amount_paid ?? "0");
  const remainingBalance = total - paid;
  const formattedRemainingBalance = isNaN(remainingBalance)
    ? ""
    : new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
      }).format(remainingBalance);

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <CircleUserIcon />
        </ModalIcon>
        <ModalTitle>EDIT PATIENT RECORD</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4">
            <p>
              PATIENT RECORD OF{" "}
              {originalData.patient_name?.toUpperCase() || "UNKNOWN"}
            </p>
            <p>
              <span>CURRENT PACKAGE:</span>{" "}
              {entryData?.package_name?.toUpperCase() || "N/A"}
            </p>
            <InputContainer>
              <InputLabel>PATIENT NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input
                  placeholder={
                    originalData.patient_name || "Full name of the patient"
                  }
                  value={formData.patient_name ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_name: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>PERSON IN CHARGE</InputLabel>

              <Select
                value={
                  formData.person_in_charge ?? originalData.person_in_charge ?? ""
                }
                onValueChange={(value) =>
                  setFormData({ ...formData, person_in_charge: value })
                }
              >
                <ModalSelectTrigger
                  icon={<UserIDIcon className="w-4 h-4" />}
                  placeholder="Person in charge of the session"
                />
                <ModalSelectContent>
                {aestheticianList.map((aesthetician) => (
                  <SelectItem key={aesthetician.id} value={aesthetician.username}>
                    {aesthetician.username}
                  </SelectItem>
                ))}
              </ModalSelectContent>

              </Select>
            </InputContainer>

            {/* PACKAGE */}
            <InputContainer>
              <InputLabel>PACKAGE</InputLabel>
              <Select
                value={formData.package_name ?? originalData.package_name ?? ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    package_name: value === "CLEAR" ? "" : value,
                    treatment: value === "CLEAR" ? prev.treatment : "", // mutually exclusive
                  }));
                }}
                
              >
                <ModalSelectTrigger
                  icon={<PackageIcon className="w-4 h-4" />}
                  placeholder="Select package"
            
                />
                <ModalSelectContent>
                  <SelectItem value="CLEAR">Clear Selection</SelectItem>

                  {!Boolean(formData.treatment ?? originalData.treatment) && 
                    packagesList.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.package_name}>
                      {pkg.package_name} - ₱{pkg.price}
                    </SelectItem>
                  ))}
                </ModalSelectContent>
              </Select>
             
            </InputContainer>

            <InputContainer>
              <InputLabel>TREATMENT</InputLabel>
              <Select
                value={formData.treatment ?? originalData.treatment ?? ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    treatment: value === "CLEAR" ? "" : value,
                    package_name: value === "CLEAR" ? prev.package_name : "", // mutually exclusive
                  }));
                }}
                
              >
                <ModalSelectTrigger
                  icon={<TreatmentIcon className="w-4 h-4" />}
                  placeholder="Chosen treatment"
                />
               <ModalSelectContent>
                  <SelectItem value="CLEAR">Clear Selection</SelectItem>
                  {!Boolean(formData.package_name ?? originalData.package_name) &&
                    treatmentsList.map((treatment) => (
                    <SelectItem
                      key={treatment.id}
                      value={treatment.treatment_name}
                    >
                      {treatment.treatment_name}
                    </SelectItem>
                  ))}
                </ModalSelectContent>
              </Select>
            </InputContainer>

            <InputContainer>
              <InputLabel>TOTAL AMOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <Input
                  prefix="₱"
                  placeholder="₱0.00"
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  value={
                    formData.total_amount ?? originalData.total_amount ?? ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, total_amount: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>AMOUNT PAID</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <Input
                  prefix="₱"
                  placeholder="₱0.00"
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  value={
                    formData.amount_paid ?? originalData.amount_paid ?? ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, amount_paid: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

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


            <InputContainer>
            <InputLabel>PAYMENT METHOD</InputLabel>
            <RadioGroup
              value={formData.payment_method ?? originalData.payment_method ?? ""}
              onValueChange={(value) =>
                setFormData({ ...formData, payment_method: value })
              }
              className="flex flex-col gap-2 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="full-payment"
                  id="full-payment"
                />
                <label htmlFor="full-payment" className="text-sm">
                  FULL PAYMENT
                </label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
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

          <div className="flex flex-row w-full gap-4">
            <InputContainer className="flex-1">
              <InputLabel>DATE OF SESSION</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  type="date"
                  className="text-input"
                  placeholder="Date of Session"
                  required
                  value={
                    formData.date_of_session ??
                    (originalData.date_of_session
                      ? originalData.date_of_session.slice(0, 10) // format: YYYY-MM-DD
                      : "")
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
              <InputLabel>TIME OF SESSION</InputLabel>
              <InputTextField className="flex-1">
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  type="time"
                  className="text-input"
                  required
                  value={
                    formData.time_of_session ??
                    (originalData.time_of_session
                      ? originalData.time_of_session.slice(0, 5) // format: HH:MM
                      : "")
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

          {/* 
          <div className="flex flex-col gap-4 mt-4">
            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>
              <Select
                value={formData.next_treatment ?? originalData.next_treatment}
                onValueChange={(value) =>
                  setFormData({ ...formData, next_treatment: value })
                }
              >
                <ModalSelectTrigger
                  icon={<TreatmentIcon className="w-4 h-4" />}
                  placeholder="Next treatment chosen"
                />
                <ModalSelectContent>
                  <SelectItem value="AESTHETICIAN">AESTHETICIAN</SelectItem>
                  <SelectItem value="RECEPTIONIST">RECEPTIONIST</SelectItem>
                </ModalSelectContent>
              </Select>
            </InputContainer>
          </div> */}

          <div className="flex flex-col gap-4 my-4">
            <h5 className="text-xl leading-8 font-semibold">
              PATIENT CONSENT FORM
            </h5>
            <div className="flex flex-row gap-3 items-center justify-start">
              <Checkbox
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
            <Button
              type="button"
              className="w-1/2"
              onClick={() => {
                const cleanedData = { ...formData };
                Object.keys(cleanedData).forEach((key) => {
                  if (cleanedData[key] === "") {
                    cleanedData[key] = null; // force null to override DB
                  }
                });
                onSubmit({ id: entryData.id, ...cleanedData });
              }}
            >
              <EditIcon />
              EDIT ENTRY
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditPatientEntry;
