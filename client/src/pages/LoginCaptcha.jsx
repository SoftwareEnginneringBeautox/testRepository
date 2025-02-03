function App() {
  return (
    <div className="min-h-screen grid grid-cols-12">
      <div className="h-screen col-span-7 ">
        <img
          src="/src/assets/images/Beautox Login Image.png"
          alt="Beautox Login Image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="user-login fcc col-span-5  flex flex-row items-center justify-center">
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
            <div className="captcha-container">
              <div className="fcc-r font-semibold p-[2.25rem_12.22rem] bg-neutral-100 rounded-lg gap-2 border-2 border-neutral-200 focus-within:border-lavender-400 text-center">
                [CAPTCHA TEXT HERE]
              </div>
            </div>
            <div className="input-container">
              <label htmlFor="" className="input-field-label">
                Enter the text
              </label>
              <div className="input-field">
                <input
                  type="text"
                  className="text-input"
                  placeholder="Enter the text"
                />
              </div>
            </div>
            <Button>
              <LoginIcon size={24} />
              LOGIN
            </Button>{" "}
          </form>
        </div>
      </div>
    </div>
  );
}
