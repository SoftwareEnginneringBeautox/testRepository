import React from "react";
import { CTAButton, OutlineButton } from "@/Components";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import SortIcon from "@/assets/icons/SortIcon";
import MagnifyingGlassIcon from "@/assets/icons/MagnifyingGlassIcon";
import EditIcon from "@/assets/icons/EditIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";

function PatientRecordsDatabase() {
  //dummy data

  const dummyRecords = [
    {
      client: "william wallace",
      dateTransacted: "2021-09-01",
      nextSessionDate: "2021-09-01",
      nextSessionTime: "09:00",
      personInCharge: "Dr. John Doe",
      package: "Botox",
      treatment: "Botox",
      remainingSessions: 5,
      consentStatus: "Yes",
      paymentMethod: "Cash",
      totalAmount: 500,
      amountPaid: 500,
      remainingBalance: 0,
      referenceNo: "123456"
    },
    {
      client: "jane doe",
      dateTransacted: "2021-08-15",
      nextSessionDate: "2021-08-22",
      nextSessionTime: "10:00",
      personInCharge: "Dr. Jane Smith",
      package: "Laser Hair Removal",
      treatment: "Laser",
      remainingSessions: 3,
      consentStatus: "Yes",
      paymentMethod: "Credit Card",
      totalAmount: 300,
      amountPaid: 150,
      remainingBalance: 150,
      referenceNo: "654321"
    },
    {
      client: "john smith",
      dateTransacted: "2021-07-20",
      nextSessionDate: "2021-07-27",
      nextSessionTime: "11:00",
      personInCharge: "Dr. Emily Johnson",
      package: "Chemical Peel",
      treatment: "Peel",
      remainingSessions: 2,
      consentStatus: "Yes",
      paymentMethod: "Debit Card",
      totalAmount: 200,
      amountPaid: 100,
      remainingBalance: 100,
      referenceNo: "789012"
    },
    {
      client: "alice johnson",
      dateTransacted: "2021-06-10",
      nextSessionDate: "2021-06-17",
      nextSessionTime: "12:00",
      personInCharge: "Dr. Michael Brown",
      package: "Microdermabrasion",
      treatment: "Microderm",
      remainingSessions: 4,
      consentStatus: "Yes",
      paymentMethod: "Cash",
      totalAmount: 400,
      amountPaid: 200,
      remainingBalance: 200,
      referenceNo: "345678"
    }
  ];

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-[2rem] leading-[2.8rem]">
          PATIENT RECORDS
        </h4>
        <div className="flex gap-4">
          <div className="input-field">
            <input type="text" className="text-input" />
            <button>
              <MagnifyingGlassIcon />
            </button>
          </div>
          <CTAButton text="SORT BY" rightIcon={<SortIcon />} />
        </div>
      </div>
      <table className="PRISM-table">
        <thead>
          <tr>
            <th>CLIENT</th>
            <th>DATE TRANSACTED</th>
            <th>NEXT SESSION DATE</th>
            <th>NEXT SESSION TIME</th>
            <th>PERSON IN CHARGE</th>
            <th>PACKAGE</th>
            <th>TREATMENT</th>
            <th>REMAINING SESSIONS</th>
            <th>CONSENT STATUS</th>
            <th>PAYMENT METHOD</th>
            <th>TOTAL AMOUNT</th>
            <th>AMOUNT PAID</th>
            <th>REMAINING BALANCE</th>
            <th>REFERENCE NO.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dummyRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.client}</td>
              <td>{record.dateTransacted}</td>
              <td>{record.nextSessionDate}</td>
              <td>{record.nextSessionTime}</td>
              <td>{record.personInCharge}</td>
              <td>{record.package}</td>
              <td>{record.treatment}</td>
              <td>{record.remainingSessions}</td>
              <td>{record.consentStatus}</td>
              <td>{record.paymentMethod}</td>
              <td>{record.totalAmount}</td>
              <td>{record.amountPaid}</td>
              <td>{record.remainingBalance}</td>
              <td>{record.referenceNo}</td>
              <td>
                <div className="flex justify-center gap-2">
                  <button className="text-reflexBlue-400">
                    <EditIcon />
                  </button>
                  <button className="text-reflexBlue-400">
                    <ArchiveIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-row gap-4 justify-end">
        <OutlineButton text="RETURN" leftIcon={<ChevronLeftIcon />} />
        <CTAButton text="ADD NEW ENTRY" leftIcon={<PlusIcon />} />
      </div>
    </div>
  );
}

export default PatientRecordsDatabase;
