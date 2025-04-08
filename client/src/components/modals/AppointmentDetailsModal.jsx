import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import CircleUserIcon from "@/assets/icons/CircleUserIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import { format } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function AppointmentDetailsModal({ 
  isOpen, 
  onClose, 
  appointmentData,
  onConfirm,
  onReject 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !appointmentData) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Create a minimal patient record
      const patientPayload = {
        patient_name: appointmentData.full_name,
        contact_number: appointmentData.contact_number,
        age: appointmentData.age,
        email: appointmentData.email,
        date_of_session: appointmentData.date_of_session,
        time_of_session: appointmentData.time_of_session,
        // Additional required fields with default values
        person_in_charge: "Pending Assignment",
        payment_method: "Not Specified",
        total_amount: 0,
        consent_form_signed: false,
        archived: false,
        reference_number: `REF${Date.now()}`
      };
      
      // Add to patient_records
      const patientResponse = await axios.post(
        `${API_BASE_URL}/api/patients`, 
        patientPayload,
        { withCredentials: true }
      );
      
      // 2. Update the staged appointment status
      await axios.post(
        `${API_BASE_URL}/api/staged-appointments/${appointmentData.id}/confirm`,
        {},
        { withCredentials: true }
      );
      
      // 3. Send confirmation email
      await axios.post(
        `${API_BASE_URL}/send-email`,
        {
          to: appointmentData.email,
          subject: "Appointment Confirmation",
          text: `Dear ${appointmentData.full_name},\n\nYour appointment on ${format(new Date(appointmentData.date_of_session), "MMMM dd, yyyy")} at ${format(new Date(`1970-01-01T${appointmentData.time_of_session}`), "hh:mm a")} has been confirmed.\n\nThank you for choosing our services.\n\nThis is an automated email, please do not reply.`
        },
        { withCredentials: true }
      );
      
      // Call the parent component's onConfirm handler
      onConfirm(appointmentData.id);
    } catch (err) {
      console.error("Error confirming appointment:", err);
      setError("Failed to confirm appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleReject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Update the staged appointment status
      await axios.post(
        `${API_BASE_URL}/api/staged-appointments/${appointmentData.id}/reject`,
        {},
        { withCredentials: true }
      );
      
      // 2. Send rejection email
      await axios.post(
        `${API_BASE_URL}/send-email`,
        {
          to: appointmentData.email,
          subject: "Appointment Request Update",
          text: `Dear ${appointmentData.full_name},\n\nWe regret to inform you that your requested appointment on ${format(new Date(appointmentData.date_of_session), "MMMM dd, yyyy")} at ${format(new Date(`1970-01-01T${appointmentData.time_of_session}`), "hh:mm a")} is not available.\n\nPlease contact us to schedule a different time or date.\n\nThis is an automated email, please do not reply.`
        },
        { withCredentials: true }
      );
      
      // Call the parent component's onReject handler
      onReject(appointmentData.id);
    } catch (err) {
      console.error("Error rejecting appointment:", err);
      setError("Failed to reject appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer className="max-w-md w-full mx-auto p-4">
      <ModalHeader className="flex items-center justify-between">
        <div className="flex items-center">
          <ModalIcon>
            <CircleUserIcon className="text-reflexBlue-400" />
          </ModalIcon>
          <ModalTitle className="ml-2">
            {appointmentData.full_name
              ? appointmentData.full_name.toUpperCase() + "'S APPOINTMENT"
              : "CLIENT'S APPOINTMENT"}
          </ModalTitle>
        </div>
        <button className="text-xl rotate-45" onClick={onClose}>
          <PlusIcon />
        </button>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          {[
            { label: "FULL NAME", value: appointmentData.full_name },
            { label: "CONTACT NUMBER", value: appointmentData.contact_number },
            { label: "AGE", value: appointmentData.age },
            { label: "EMAIL", value: appointmentData.email },
            { 
              label: "DATE OF SESSION", 
              value: appointmentData.date_of_session 
                ? format(new Date(appointmentData.date_of_session), "MMMM dd, yyyy")
                : "N/A"
            },
            { 
              label: "TIME OF SESSION", 
              value: appointmentData.time_of_session
                ? format(new Date(`1970-01-01T${appointmentData.time_of_session}`), "hh:mm a")
                : "N/A"
            }
          ].map(({ label, value }) => (
            <p key={label} className="text-xl leading-8 font-semibold">
              {label}: <span className="font-normal">{value || "N/A"}</span>
            </p>
          ))}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
          <Button 
            variant="destructive" 
            onClick={handleReject}
            disabled={loading}
            className="w-full sm:w-[48%]"
          >
            {loading ? "PROCESSING..." : "REJECT"}
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-[48%]"
          >
            {loading ? "PROCESSING..." : "CONFIRM"}
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

AppointmentDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointmentData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    full_name: PropTypes.string,
    contact_number: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    email: PropTypes.string,
    date_of_session: PropTypes.string,
    time_of_session: PropTypes.string
  }),
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

export default AppointmentDetailsModal;