import React from "react";
import { Button } from "@/components/ui/Button";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import SortIcon from "@/assets/icons/SortIcon";
import MagnifyingGlassIcon from "@/assets/icons/MagnifyingGlassIcon";
import EditIcon from "@/assets/icons/EditIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

import {
  Select,
  SelectIcon,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
        <div className="flex items-center justify-center gap-4">
          <InputTextField>
            <Input type="text" id="password" />
            <MagnifyingGlassIcon />
          </InputTextField>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="SORT BY" />
              <SelectIcon>
                <SortIcon />
              </SelectIcon>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">ALPHABETICAL </SelectItem>
              <SelectItem value="dark">DATE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-4">CLIENT</TableHead>
            <TableHead className="py-4 text-center">DATE TRANSACTED</TableHead>
            <TableHead className="py-4 text-center">
              NEXT SESSION DATE
            </TableHead>
            <TableHead className="py-4 text-center">
              NEXT SESSION TIME
            </TableHead>
            <TableHead className="py-4 text-center">PERSON IN CHARGE</TableHead>
            <TableHead className="py-4">PACKAGE</TableHead>
            <TableHead className="py-4">TREATMENT</TableHead>
            <TableHead className="py-4 text-center">
              REMAINING SESSIONS
            </TableHead>
            <TableHead className="py-4 text-center">CONSENT STATUS</TableHead>
            <TableHead className="py-4 text-center">PAYMENT METHOD</TableHead>
            <TableHead className="py-4 text-center">TOTAL AMOUNT</TableHead>
            <TableHead className="py-4 text-center">AMOUNT PAID </TableHead>
            <TableHead className="py-4 text-center">
              REMAINING BALANCE
            </TableHead>
            <TableHead className="py-4 text-center">REFERENCE NO.</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyRecords.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.client.toUpperCase()}</TableCell>
              <TableCell className="text-center">
                {record.dateTransacted}
              </TableCell>
              <TableCell className="text-center">
                {record.nextSessionDate}
              </TableCell>
              <TableCell className="text-center">
                {record.nextSessionTime}
              </TableCell>
              <TableCell>{record.personInCharge.toUpperCase()}</TableCell>
              <TableCell>{record.package.toUpperCase()}</TableCell>
              <TableCell className="text-center">
                {record.treatment.toUpperCase()}
              </TableCell>
              <TableCell className="text-center">
                {record.remainingSessions}
              </TableCell>
              <TableCell className="text-center">
                {record.consentStatus.toUpperCase()}
              </TableCell>
              <TableCell>{record.paymentMethod.toUpperCase()}</TableCell>
              <TableCell className="text-center">
                PHP {record.totalAmount}
              </TableCell>
              <TableCell className="text-center">
                PHP {record.amountPaid}
              </TableCell>
              <TableCell className="text-center">
                {record.remainingBalance}
              </TableCell>
              <TableCell className="text-center">
                {record.referenceNo}
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <button className="text-reflexBlue-400">
                    <EditIcon />
                  </button>
                  <button className="text-reflexBlue-400">
                    <ArchiveIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <table className="table-fixed rounded-md text-center w-full shadow-custom overflow-hidden">
        <thead className="bg-lavender-400">
          <tr className="text-customNeutral-100 leading-5 font-semibold text-[clamp(0.4rem,0.75vw,1rem)] text-center">
            <th className="font-semibold p-4">CLIENT</th>
            <th className="font-semibold p-4">DATE TRANSACTED</th>
            <th className="font-semibold p-4">NEXT SESSION DATE</th>
            <th className="font-semibold p-4">NEXT SESSION TIME</th>
            <th className="font-semibold p-4">PERSON IN CHARGE</th>
            <th className="font-semibold p-4">PACKAGE</th>
            <th className="font-semibold p-4">TREATMENT</th>
            <th className="font-semibold p-4">REMAINING SESSIONS</th>
            <th className="font-semibold p-4">CONSENT STATUS</th>
            <th className="font-semibold p-4">PAYMENT METHOD</th>
            <th className="font-semibold p-4">TOTAL AMOUNT</th>
            <th className="font-semibold p-4">AMOUNT PAID</th>
            <th className="font-semibold p-4">REMAINING BALANCE</th>
            <th className="font-semibold p-4">REFERENCE NO.</th>
            <th className="font-semibold p-4"></th>
          </tr>
        </thead>
        <tbody>
          {dummyRecords.map((record, index) => (
            <tr
              key={index}
              className="odd:bg-reflexBlue-100 even:bg-faintingLight-100 text-[clamp(0.5rem,0.75vw,1rem)]"
            >
              <td className="p-5">{record.client.toUpperCase()}</td>
              <td className="p-5">{record.dateTransacted}</td>
              <td className="p-5">{record.nextSessionDate}</td>
              <td className="p-5">{record.nextSessionTime}</td>
              <td className="p-5">{record.personInCharge.toUpperCase()}</td>
              <td className="p-5">{record.package.toUpperCase()}</td>
              <td className="p-5">{record.treatment.toUpperCase()}</td>
              <td className="p-5">{record.remainingSessions}</td>
              <td className="p-5">{record.consentStatus.toUpperCase()}</td>
              <td className="p-5">{record.paymentMethod.toUpperCase()}</td>
              <td className="p-5">{record.totalAmount}</td>
              <td className="p-5">{record.amountPaid}</td>
              <td className="p-5">{record.remainingBalance}</td>
              <td className="p-5">{record.referenceNo}</td>
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
      </table> */}
      <div className="flex flex-row gap-4 justify-end">
        <Button variant="outline">
          <ChevronLeftIcon />
          RETURN
        </Button>
        <Button>
          <PlusIcon />
          ADD NEW ENTRY
        </Button>
      </div>

      <br />
      <br />
    </div>
  );
}

export default PatientRecordsDatabase;
