import React, { useState } from "react";
import { format, parse, differenceInDays } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import EvaluateIcon from "@/assets/icons/EvaluateIcon";

function RemindersTable({
  stagedAppointments = [],
  reminders = [],
  isLoading = false,
  error = null,
  onEvaluateAppointment
}) {
  const [remindersExpanded, setRemindersExpanded] = useState(false);

  // Helper Functions
  const formatSafeDate = (date, formatStr) => {
    return date ? format(new Date(date), formatStr) : "N/A";
  };

  const formatSafeTime = (time) => {
    return time
      ? format(parse(time, "HH:mm:ss", new Date()), "hh:mm a")
      : "N/A";
  };

  const getReminderLabel = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    const diffDays = differenceInDays(appointmentDate, today);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return "This Week";
    return "";
  };

  const toggleReminders = () => setRemindersExpanded((prev) => !prev);

  // Filter out any archived reminders that might have slipped through
  const filteredReminders = reminders.filter(item => !item.archived);

  return (
    <div
      className="overflow-x-auto overflow-y-hidden"
      data-cy="reminders-table-container"
    >
      <Table className="min-w-full" data-cy="reminders-table">
        <TableHeader data-cy="reminders-header">
          <TableRow>
            <TableHead
              className="text-left py-8 flex items-center justify-between"
              data-cy="reminders-title"
            >
              <div className="flex flex-row text-xl items-center gap-2">
                REMINDERS
                {(stagedAppointments.length > 0 || reminders.length > 0) && (
                  <span className="text-xs bg-lavender-300 text-white rounded-full px-2 py-0.5">
                    {stagedAppointments.length + reminders.length}
                  </span>
                )}
              </div>
              <button
                onClick={toggleReminders}
                className="flex flex-row gap-2 items-center justify-center rounded-lg focus:outline-none text-sm transition-transform duration-200 border-2 border-customNeutral-100 p-1 pl-3"
                aria-label={
                  remindersExpanded ? "Collapse reminders" : "Expand reminders"
                }
                data-cy="toggle-reminders"
              >
                VIEW ALL
                <ChevronDownIcon
                  className={`transform ${
                    remindersExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>

        {remindersExpanded ? (
          <TableBody data-cy="reminders-body">
            {isLoading ? (
              <TableRow>
                <TableCell>Loading appointments...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell className="text-error-400">{error}</TableCell>
              </TableRow>
            ) : (
              <>
                {stagedAppointments.map((item, index) => (
                  <TableRow key={`staged-${index}`}>
                    <TableCell className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base [&_svg]:shrink-0">
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        <strong>{item.full_name}</strong> has scheduled an
                        appointment on{" "}
                        <strong>
                          {formatSafeDate(
                            item.date_of_session,
                            "MMMM dd, yyyy"
                          )}
                        </strong>{" "}
                        at{" "}
                        <strong>{formatSafeTime(item.time_of_session)}</strong>
                      </span>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-lavender-300 text-white font-semibold">
                        Needs Confirmation
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto"
                        onClick={() => onEvaluateAppointment(item)}
                      >
                        EVALUATE
                        <EvaluateIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredReminders.map((item, index) => (
                  <TableRow key={`reminder-${index}`}>
                    <TableCell className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base [&_svg]:shrink-0">
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        {item.full_name} has an appointment on{" "}
                        <strong>
                          {formatSafeDate(
                            item.date_of_session,
                            "MMMM dd, yyyy"
                          )}
                        </strong>{" "}
                        at{" "}
                        <strong>{formatSafeTime(item.time_of_session)}</strong>
                      </span>
                      {getReminderLabel(item.date_of_session) && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-lavender-300 text-white font-semibold">
                          {getReminderLabel(item.date_of_session)}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {stagedAppointments.length === 0 && reminders.length === 0 && (
                  <TableRow>
                    <TableCell className="text-sm sm:text-base">
                      No recent appointments needing reminders.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        ) : (
          <TableBody data-cy="reminders-summary">
            <TableRow>
              <TableCell className="text-sm sm:text-base py-2">
                {isLoading ? (
                  "Loading appointments..."
                ) : error ? (
                  <span className="text-error-400">{error}</span>
                ) : stagedAppointments.length > 0 || reminders.length > 0 ? (
                  <div className="flex items-center justify-between">
                    <span>
                      {stagedAppointments.length > 0 && (
                        <span className="font-medium">
                          {stagedAppointments.length} pending{" "}
                          {stagedAppointments.length === 1
                            ? "confirmation"
                            : "confirmations"}
                        </span>
                      )}
                      {stagedAppointments.length > 0 && reminders.length > 0
                        ? " • "
                        : ""}
                      {reminders.length > 0 && (
                        <span>
                          {reminders.length} upcoming{" "}
                          {reminders.length === 1
                            ? "appointment"
                            : "appointments"}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      Click arrow to view details
                    </span>
                  </div>
                ) : (
                  "No upcoming appointments"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
}

export default RemindersTable;
