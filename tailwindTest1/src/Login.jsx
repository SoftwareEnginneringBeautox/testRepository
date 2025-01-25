import { CTAButton } from "./Components";
import UserIcon from "./assets/icons/UserIcon";
import PasswordIcon from "./assets/icons/PasswordIcon";
import LoginIcon from "./assets/icons/LoginIcon";
import BeautoxLogo from "./assets/logos/Beautox.svg";

function Login() {
  return (
    <div className="min-h-screen grid grid-cols-12">
      <div className="h-screen col-span-7 ">
        <img
          src="/src/assets/images/Beautox Login Image.png"
          alt="Beautox Login Image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="user-login fcc col-span-5 flex flex-row items-center justify-center">
        <div className="login-container w-[90%]">
          <img
            src={BeautoxLogo}
            alt="Beautox Logo"
            className="mb-4 m-auto w-2/5"
          />
          <h2 className="font-semibold leading-[67.2px] text-[48px] text-center">
            Welcome to PRISM,
          </h2>
          <p className="leading-8 text-center">
            BEAUTOX’S PATIENT RECORDS, INTEGRATION, SCHEDULING, AND MANAGEMENT
          </p>

          <form action="" className="flex flex-col gap-4 mt-4">
            <div className="input-container">
              <label htmlFor="" className="input-field-label">
                Username
              </label>

              <div className="input-field">
                <UserIcon size={24} />
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. john_doe123"
                  required
                />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="" className="input-field-label">
                Password
              </label>

              <div className="input-field">
                <PasswordIcon size={24} />
                <input
                  type="password"
                  className="text-input"
                  placeholder="e.g. P@ssw0rd123"
                  required
                />
              </div>
            </div>

            <p className="text-customNeutral-300 text-xs font-bold leading-5 text-center">
              FORGOT PASSWORD?{" "}
              <a href="" className="underline">
                CLICK HERE
              </a>
            </p>

            <CTAButton text="LOGIN" leftIcon={<LoginIcon size={24} />} />
          </form>
        </div>
      </div>
    </div>
  );
}
