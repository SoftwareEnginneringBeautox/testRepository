import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import BeautoxLogo from "@/assets/logos/BeautoxLogo";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import LoginIcon from "@/assets/icons/LoginIcon";
import LocationIcon from "@/assets/icons/LocationIcon";
import ScheduleAppointmentModal from "../components/modals/ScheduleAppointment"; // Adjust the import path as needed

function LandingPage() {
  const navigate = useNavigate();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <div className="w-full bg-[linear-gradient(135deg,_rgba(242,239,238,1)_0%,_rgba(239,218,192,1)_34%,_rgba(201,180,206,1)_67%,_rgba(241,234,228,1)_100%)]">
      <header className="fixed w-full flex justify-end p-4 bg-transparent z-50">
        <Button
          onClick={() => navigate("/login")}
          variant="outline"
          className="border-none"
        >
          <LoginIcon />
          LOGIN AS STAFF
        </Button>
      </header>
      <div className="flex flex-col items-center justify-center gap-40 min-h-screen">
        <section
          id="hero"
          className="w-3/4 flex flex-row justify-center items-center my-60"
        >
          <div className="w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl leading-2 font-bold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
                WELCOME TO BEAUTOX
              </h2>
              <h3 className="font-semibold text-2xl bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text">
                Where Beauty meets Innovation
              </h3>
            </div>
            <p>
              Discover personalized skincare, non-invasive treatments, and
              advanced beauty solutions designed to enhance your natural glow.
              Experience expert care and cutting-edge technology tailored to
              your unique beauty goals.
            </p>
            <Button
              fullWidth="true"
              onClick={() => setIsScheduleModalOpen(true)}
            >
              SET AN APPOINTMENT
              <CalendarIcon />
            </Button>
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <BeautoxLogo className="h-full w-1/2 text-lavender-400 opacity-90" />
          </div>
        </section>
        <section className="w-3/4 flex flex-row items-center justify-center gap-4">
          <div className="w-1/2 flex items-center justify-center rounded-half">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1043.644141889592!2d121.03651836623278!3d14.614630075990188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7656817cb95%3A0xc3a3721da76b89!2sSonema%20Square!5e0!3m2!1sen!2sph!4v1741322385811!5m2!1sen!2sph"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-3xl w-full min-h-10"
              height={300}
            ></iframe>
          </div>
          <div className="w-1/2 text-end">
            <div className="flex flex-row gap-2 text-end justify-end pb-2">
              <h3 className="flex flex-row justify-center items-center font-semibold text-2xl bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
                <div className="text-lavender-400 h-full pr-1 flex items-center">
                  <LocationIcon />
                </div>
                DON'T KNOW WHERE TO FIND US?
              </h3>
            </div>
            <p>
              We are located at{" "}
              <span className="font-bold">
                J26P+XXR, N. Domingo, Quezon City, 1112 Metro Manila
              </span>
              , near Robinson's Magnolia.
            </p>
          </div>
        </section>
        <section className="w-3/4 flex flex-col items-center justify-center gap-4">
          [PRODUCT SECTION]
        </section>
        <footer className="w-full">
          <h3 className="text-3xl font-bold text-lavender-400">
            WANT TO LEARN MORE ABOUT US? FIND US HERE
          </h3>
          <ul>
            <li>fb</li>
            <li>twt</li>
            <li>?</li>
          </ul>
        </footer>
      </div>
      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}

export default LandingPage;
