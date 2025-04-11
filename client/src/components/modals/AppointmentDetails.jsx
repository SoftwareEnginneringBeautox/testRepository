import React, { useState } from "react";
import PropTypes from "prop-types";
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
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function AppointmentDetails({
  isOpen,
  onClose,
  appointmentData,
  onConfirm,
  onReject
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen || !appointmentData) return null;

  // Handle confirm action
  const handleConfirm = async (id) => {
    try {
      setIsProcessing(true);
      setStatusMessage({ type: "info", text: "Processing confirmation..." });

      const response = await axios.post(
        `${API_BASE_URL}/api/staged-appointments/${id}/confirm`
      );

      if (response.data.success) {
        setStatusMessage({
          type: "success",
          text: "Appointment confirmed successfully!"
        });
        // Call the onConfirm callback to update UI
        onConfirm(id);
        // Close the modal after a short delay
        setTimeout(() => onClose(), 1500);
      } else {
        setStatusMessage({
          type: "error",
          text: response.data.message || "Failed to confirm appointment"
        });
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      setStatusMessage({
        type: "error",
        text: "Error confirming appointment. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject action
  const handleReject = async (id) => {
    try {
      setIsProcessing(true);
      setStatusMessage({ type: "info", text: "Processing rejection..." });

      const response = await axios.post(
        `${API_BASE_URL}/api/staged-appointments/${id}/reject`
      );

      if (response.data.success) {
        setStatusMessage({
          type: "success",
          text: "Appointment rejected successfully!"
        });
        // Call the onReject callback to update UI
        onReject(id);
        // Close the modal after a short delay
        setTimeout(() => onClose(), 1500);
      } else {
        setStatusMessage({
          type: "error",
          text: response.data.message || "Failed to reject appointment"
        });
      }
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      setStatusMessage({
        type: "error",
        text: "Error rejecting appointment. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <CircleUserIcon className="text-reflexBlue-400" />
        </ModalIcon>
        <ModalTitle>
          {appointmentData.full_name
            ? appointmentData.full_name.toUpperCase() + "'S APPOINTMENT"
            : "CLIENT'S APPOINTMENT"}
        </ModalTitle>
        <button className="font-xl rotate-45 ml-auto" onClick={onClose}>
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
                ? format(
                    new Date(appointmentData.date_of_session),
                    "MMMM dd, yyyy"
                  )
                : "N/A"
            },
            {
              label: "TIME OF SESSION",
              value: appointmentData.time_of_session
                ? format(
                    new Date(`1970-01-01T${appointmentData.time_of_session}`),
                    "hh:mm a"
                  )
                : "N/A"
            }
          ].map(({ label, value }) => (
            <p key={label} className="text-xl leading-8 font-semibold">
              {label}: <span className="font-normal">{value || "N/A"}</span>
            </p>
          ))}

          {statusMessage && (
            <div
              className={`p-3 rounded mb-2 ${
                statusMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : statusMessage.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <div className="flex sm:flex-row flex-col gap-4 w-full">
            <Button
              variant="outline"
              onClick={() => handleReject(appointmentData.id)}
              className="md:w-1/2"
              disabled={isProcessing}
            >
              <ChevronLeftIcon />
              REJECT
            </Button>
            <Button
              onClick={() => handleConfirm(appointmentData.id)}
              className="md:w-1/2"
              disabled={isProcessing}
            >
              CONFIRM
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

AppointmentDetails.propTypes = {
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

export default AppointmentDetails;
