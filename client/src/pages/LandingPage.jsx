import { useNavigate } from "react-router-dom";
import BeautoxLogo from "@/assets/logos/Beautox.svg";
import { Button } from "@/components/ui/Button";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/images/Beautox Login Image.png')" }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative text-center text-white px-6">
        <img src={BeautoxLogo} alt="Beautox Logo" className="w-1/4 mx-auto mb-6" />

        <h1 className="text-5xl font-bold">
          Lorem ipsum dolor sit amet
        </h1>
        <p className="mt-4 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate("/scheduleAppointment")}
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3"
          >
            Get Started
          </Button>

          <Button
            onClick={() => navigate("/login")}
            className="bg-gray-800 hover:bg-gray-900 text-white text-lg px-6 py-3"
          >
            Login Staff
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
