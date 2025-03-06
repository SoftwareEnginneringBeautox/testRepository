import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import BeautoxLogo from "@/assets/logos/BeautoxLogo";

import CalendarIcon from "@/assets/icons/CalendarIcon";
import LoginIcon from "@/assets/icons/LoginIcon";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[linear-gradient(135deg,_rgba(242,239,238,1)_0%,_rgba(239,218,192,1)_34%,_rgba(201,180,206,1)_67%,_rgba(241,234,228,1)_100%)] ">
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
      <div className=" flex flex-col items-center justify-center gap-4">
        <section
          id="hero"
          className="w-3/4 flex flex-row justify-center items-center min-h-screen"
        >
          <div className="w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-5xl leading-3 font-bold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent  bg-clip-text py-4 ">
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
              onClick={() => navigate("/scheduleAppointment")}
              // className="bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent text-white"
            >
              SET APPOINTMENT
              <CalendarIcon />
            </Button>
          </div>
          <div className="w-1/2 flex items-center justify-center ">
            <BeautoxLogo className="h-full w-1/2 text-lavender-400" />
          </div>
        </section>
        <footer>
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
    </div>
  );
}

export default LandingPage;
