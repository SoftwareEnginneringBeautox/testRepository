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
 const [formErrors, setFormErrors] = useState({});
 const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

 const [packagesList, setPackagesList] = useState([]);
 const [treatmentsList, setTreatmentsList] = useState([]);
 const [aestheticianList, setAestheticianList] = useState([]);

 const API_BASE_URL = import.meta.env.VITE_API_URL;

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
     
     setFormData(prev => ({
       ...prev,
       date_of_session: nextSessionDate
     }));
   }
 }, [entryData, formData.date_of_session]);

 if (!isOpen) return null;
 
 // Calculate total and remaining balance
 const total = parseFloat(originalData.total_amount || "0");
 const initialPaid = parseFloat(originalData.amount_paid || "0");
 const additionalPayment = parseFloat(formData.additional_payment || "0");
 const totalPaid = initialPaid + additionalPayment;
 const remainingBalance = total - totalPaid;

 // Is the payment complete?


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

   // If additional payment is entered, update remaining balance
   if (formData.additional_payment && parseFloat(formData.additional_payment) > 0) {
     // Validate payment amount doesn't exceed remaining balance
     if (parseFloat(formData.additional_payment) > (total - initialPaid)) {
       errors.additional_payment = "Payment exceeds remaining balance";
     }
   }

   setFormErrors(errors);
   if (Object.keys(errors).length > 0) return;

   // Prepare data for submission
   const updatedData = {
     id: entryData.id,
     date_of_session: formData.date_of_session,
     time_of_session: formData.time_of_session,
     consent_form_signed: formData.consent_form_signed,
     amount_paid: totalPaid.toString(), // Update total amount paid
     sessions_left: formData.sessions_left,// Update paid status based on remaining balance
   };

   // Submit to server
   await onSubmit(updatedData);

   // If additional payment made, add to sales records
   if (additionalPayment > 0) {
     try {
       const salesPayload = {
         client: entryData.patient_name,
         person_in_charge: entryData.person_in_charge,
         date_transacted: new Date().toISOString().split('T')[0],
         payment_method: entryData.payment_method || "Installment",
         packages: entryData.package_name || "",
         treatment: Array.isArray(entryData.treatment_ids) ? 
           treatmentsList.filter(t => entryData.treatment_ids.includes(t.id))
                        .map(t => t.treatment_name)
                        .join(", ") : 
           "",
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

   // If there are remaining sessions, create a new appointment
   if (formData.sessions_left > 0) {
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

           {/* PACKAGE */}
           <InputContainer>
             <InputLabel>PACKAGE</InputLabel>
             <p data-cy="package-display">{originalData.package_name}</p>
           </InputContainer>

           {/* TREATMENT */}
           <InputContainer>
             <InputLabel>TREATMENT</InputLabel>
             <p data-cy="treatment-display">
               {Array.isArray(originalData.treatment_ids) ? 
                 treatmentsList.filter(t => originalData.treatment_ids.includes(t.id))
                              .map(t => t.treatment_name)
                              .join(", ") : 
                 "N/A"}
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
                 value={formData.sessions_left ?? 0}
                 onChange={(e) => 
                   setFormData({
                     ...formData, 
                     sessions_left: Math.max(0, parseInt(e.target.value) || 0)
                   })
                 }
               />
             </InputTextField>
             <p className="text-sm text-gray-500 mt-1">
               Sessions left after this visit
             </p>
           </InputContainer>

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
                 <p className="text-red-500 text-sm mt-1">{formErrors.additional_payment}</p>
               )}
             </InputContainer>
           )}

           <InputContainer>
             <InputLabel>REMAINING BALANCE</InputLabel>
             <p data-cy="remaining-balance-display" className={remainingBalance <= 0 ? "text-green-500 font-bold" : ""}>
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
               <p className="text-red-500 text-sm mt-1">{formErrors.date_of_session}</p>
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
                 className="text-input"
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