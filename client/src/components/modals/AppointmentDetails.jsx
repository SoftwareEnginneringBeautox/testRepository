import React from "react";
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

function AppointmentDetails({
  isOpen,
  onClose,
  appointmentData,
  onConfirm,
  onReject
}) {
  if (!isOpen || !appointmentData) return null;

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
          <div className="flex sm:flex-row flex-col gap-4 w-full">
            <Button
              variant="outline"
              onClick={() => onReject(appointmentData.id)}
              className="md:w-1/2"
            >
              <ChevronLeftIcon />
              REJECT
            </Button>
            <Button
              onClick={() => onConfirm(appointmentData.id)}
              className="md:w-1/2"
            >
              CONFIRM
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
