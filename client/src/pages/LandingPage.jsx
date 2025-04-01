import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import BeautoxLogo from "../assets/logos/Beautox.svg";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import LoginIcon from "@/assets/icons/LoginIcon";
import LocationIcon from "@/assets/icons/LocationIcon";
import FacebookIcon from "@/assets/icons/FacebookIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";

import ScheduleAppointmentModal from "../components/modals/ScheduleAppointment";
import EmailIcon from "@/assets/icons/EmailIcon";

function LandingPage() {
  const navigate = useNavigate();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const services = [
    {
      category: "BEST-SELLER",
      items: [
        {
          name: "40 Sessions Package",
          price: "₱6,999",
          details: [
            "Slimming Bed",
            "Lipo Cavitation",
            "RF Face & Body Contouring",
            "Slimming Injection",
            "IPL Hair Removal Laser",
            "IPL Whitening Laser",
            "Diamond Peel",
            "Bleaching"
          ],
          note: "*If no package: ₱499/session"
        },
        {
          name: "Diode Laser",
          subcategories: [
            {
              name: "Underarm Package",
              price: "₱5,999",
              details: ["Total of 8 Sessions"]
            },
            {
              name: "Brazilian Package",
              price: "₱11,999",
              details: ["Total of 8 Sessions"]
            },
            {
              name: "Full Arms or Legs Package",
              price: "₱14,999",
              details: ["Total of 8 Sessions"]
            }
          ],
          perSession: [
            { area: "Underarms", price: "₱1,500 / Session" },
            { area: "Brazilian", price: "₱2,500 / Session" },
            { area: "Full Legs", price: "₱3,000 / Session" },
            { area: "Full Arms", price: "₱3,000 / Session" }
          ]
        },
        {
          name: "Intimate Secret",
          discount: "20% OFF if you avail any Diode Package",
          subcategories: [
            {
              name: "Brazilian, Bikini, or Butt",
              price: "₱24,999 (5 Sessions)",
              perSession: "₱6,000"
            },
            {
              name: "Underarms, Knees, Elbows, Nape, or Nipples",
              price: "₱14,999 (5 Sessions)",
              perSession: "₱4,000"
            }
          ]
        }
      ]
    },
    {
      category: "FACIAL",
      items: [
        {
          name: "Signature Hydrafacial",
          price: "₱9,999 (5 Sessions)",
          perSession: "₱2,500",
          details: ["Cleansing", "Exfoliation", "Extraction", "Hydration"]
        },
        {
          name: "Signature Facial",
          price: "₱7,500 (5 Sessions)",
          perSession: "₱2,000",
          details: [
            "Steaming",
            "Pricking",
            "Diamond Peel",
            "Acne Laser",
            "Collagen Mask",
            "LED Mask"
          ]
        },
        {
          name: "Pico Laser Package",
          price: "₱9,999 (4 Sessions)",
          perSession: "₱3,500"
        },
        {
          name: "Vampire Facial Package",
          price:
            "₱19,999 (5 Sessions) / ₱9,999 (2 Sessions) / ₱6,999 (1 Session)",
          details: ["Includes FREE Basic Facial"]
        },
        {
          name: "Carbon Laser Package",
          price: "₱4,999 (4 Sessions)",
          perSession: "₱2,500",
          note: "*Add-On: Basic Facial for ₱499"
        },
        {
          name: "Warts Removal",
          price: "Starts at ₱3,999",
          details: ["Face or Neck"]
        }
      ]
    },
    {
      category: "DOCTOR'S PROCEDURE",
      items: [
        {
          name: "Profhilo Face Package",
          price: "₱24,999 (Discounted from ₱34,999)"
        },
        {
          name: "Botox",
          price: "₱150/unit (100 units) | Regular: ₱300/unit"
        },
        {
          name: "Filler",
          price: "Price on Application"
        }
      ]
    },
    {
      category: "GLUTA DRIPS",
      items: [
        { name: "Duchess", price: "₱4,999 (5+1 Sessions)", perSession: "₱999" },
        { name: "Queen", price: "₱9,999 (5+1 Sessions)", perSession: "₱1,999" },
        {
          name: "Empress",
          price: "₱14,999 (5+1 Sessions)",
          perSession: "₱2,999"
        }
      ]
    },
    {
      category: "SLIMMING TREATMENTS",
      items: [
        {
          name: "Me-So Sexy Package",
          price: "₱14,999",
          details: [
            "30 Sessions (10 + 10 + 10)",
            "10 Mesolipo Sessions (w/ 5 min RF)",
            "10 RF Sessions",
            "10 L-Carnitine Push"
          ]
        },
        {
          name: "HIFU 7D Package",
          price: "₱9,999 (4 Sessions)",
          perSession: "₱4,000"
        },
        {
          name: "Mesolipo Micro Package",
          price: "₱4,999 (4 Sessions)",
          perSession: "₱2,500"
        }
      ]
    }
  ];

  return (
    <div className="w-full bg-[linear-gradient(135deg,_rgba(242,239,238,1)_0%,_rgba(239,218,192,1)_34%,_rgba(201,180,206,1)_67%,_rgba(241,234,228,1)_100%)]">
      <header className="fixed w-full flex justify-end items-center p-4 bg-transparent z-50">
        <div className="flex items-center gap-8 mr-8">
          <a
            href="#services"
            className="relative inline-block px-2 py-1 font-semibold overflow-hidden group text-gray-800"
          >
            Services
            <span className="absolute left-0 bottom-0 block w-0 h-0.5 bg-lavender-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#about"
            className="relative inline-block px-2 py-1 font-semibold overflow-hidden group text-gray-800"
          >
            About Us
            <span className="absolute left-0 bottom-0 block w-0 h-0.5 bg-lavender-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
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
          className="relative w-full h-[100vh] flex items-center px-8 md:px-16 lg:px-24"
          style={{
            background:
              "linear-gradient(to right, rgba(221, 213, 225, 0.8) 40%, rgba(230, 210, 240, 0.5) 60%, rgba(240, 230, 250, 0.3) 75%, rgba(255, 255, 255, 0) 100%), url('/images/LandingImage.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="md:w-1/4 lg:w-6/12 flex flex-col gap-2 relative z-8">
            <img
              src={BeautoxLogo}
              alt="Beautox Logo"
              className="mb-4 w-32 sm:w-36 md:w-40 lg:w-44 h-auto block mx-auto"
            />

            <div className="flex flex-col gap-2">
              <h3 className="text-[30px] md:text-[80px] lg:text-[50px] leading-none bg-gradient-to-r from-purple-800 to-reflexBlue-400 text-transparent bg-clip-text font-semibold drop-shadow-lg">
                Welcome to Beautox
              </h3>
              <p className="font-semibold text-2xl bg-gradient-to-r from-reflexBlue-400 to-lavender-200 text-transparent bg-clip-text">
                Where Beauty meets Innovation
              </p>
            </div>

            <p className="text-lg text-gray-800 leading-relaxed">
              Experience the pinnacle of skincare luxury with our <br />
              personalized treatments. Whether you're seeking a <br />{" "}
              rejuvenating facial, targeted acne treatment, or a relaxing
              massage, our expert team is here to pamper you and address your
              unique skincare needs.
            </p>
          </div>

          <button
            className="absolute bottom-16 left-8 md:left-16 lg:left-24 flex items-center justify-center gap-2 px-6 py-3 bg-purple-950 text-white rounded-lg text-lg font-semibold hover:bg-purple-900 transition w-full md:w-auto shadow-md"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <CalendarIcon className="h-5 w-5" />
            SET AN APPOINTMENT
          </button>
        </section>

        <section className="w-3/4 flex flex-row items-center justify-center gap-4">
          {/* Google Map */}
          <div className="w-1/2 flex items-center justify-center rounded-half">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1043.644141889592!2d121.03651836623278!3d14.614630075990188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7656817cb95%3A0xc3a3721da76b89!2sSonema%20Square!5e0!3m2!1sen!2sph!4v1741322385811!5m2!1sen!2sph"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-3xl w-full min-h-10"
              height={300}
            ></iframe>
          </div>

          {/* Location & Info - Now Left Justified */}
          <div className="w-1/2 text-left flex flex-row gap-4">
            <div className="flex flex-row gap-2 items-center pb-2">
              <div className="text-lavender-400 h-full pr-1 flex items-center">
                <LocationIcon />
              </div>
              <h3 className="font-semibold text-2xl bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
                DON'T KNOW WHERE TO FIND US?
              </h3>
            </div>

            <p className="text-gray-700">
              Your journey to radiant skin starts here. <br />
              Let us pamper you with expert care.
            </p>

            {/* Address */}
            <div className="mt-3">
              <p className="text-lg font-semibold">Address:</p>
              <p className="text-gray-600">
                J26P+XXR, N. Domingo, Quezon City, 1112 Metro Manila <br />
                Near Robinson's Magnolia
              </p>
            </div>

            {/* Operating Hours */}
            <div className="mt-3">
              <p className="text-lg font-semibold">Operating Hours:</p>
              <p className="text-gray-600">
                Mon - Fri: <span className="font-semibold">9am - 6pm</span>,
                Sat: <span className="font-semibold">10am - 4pm</span>
              </p>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="w-3/4 flex flex-col items-center justify-center gap-4 my-60"
        >
          <div className="w-full">
            <h2 className="text-start font-semibold text-3xl bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text py-4">
              HERE'S WHAT WE HAVE IN STORE FOR YOU
            </h2>
            <Tabs defaultValue={services[0].category} className="w-full">
              <TabsList className="flex rounded-md shadow-md bg-white/5 backdrop-blur-[3.5px] ">
                {services.map((service) => (
                  <TabsTrigger
                    key={service.category}
                    value={service.category}
                    className="px-3 py-3 text-md font-semibold transition-all rounded-md data-[state=active]:bg-lavender-600 data-[state=active]:text-customNeutral-100"
                  >
                    {service.category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {services.map((service) => (
                <TabsContent
                  key={service.category}
                  value={service.category}
                  className="mt-4"
                >
                  <div className="grid gap-4">
                    {service.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-ash-200 shadow-md rounded-md"
                      >
                        <h4 className="font-semibold text-lg">
                          {item.name.toUpperCase()}
                        </h4>
                        <p className="text-lavender-400 font-bold">
                          {item.price}
                        </p>
                        {item.details && (
                          <ul className="text-sm text-reflexBlue-300 list-disc pl-4">
                            {item.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        )}
                        {item.perSession && (
                          <div className="text-sm text-lavender-400">
                            <p className="font-medium">Per Session:</p>
                            <ul className="list-disc pl-4">
                              {Array.isArray(item.perSession) ? (
                                item.perSession.map((session, i) => (
                                  <li key={i}>
                                    {session.area}:{" "}
                                    <span className="font-semibold">
                                      {session.price}
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li>{item.perSession}</li>
                              )}
                            </ul>
                          </div>
                        )}
                        {item.note && (
                          <p className="text-sm text-red-500 italic">
                            {item.note}
                          </p>
                        )}
                        {item.discount && (
                          <p className="text-sm text-reflexBlue-400 font-bold">
                            {item.discount}
                          </p>
                        )}
                        {item.subcategories &&
                          item.subcategories.map((sub, i) => (
                            <div key={i} className="mt-3">
                              <h5 className="font-medium">{sub.name}</h5>
                              <p className="text-lavender-400 font-bold">
                                {sub.price}
                              </p>
                              {sub.details && (
                                <p className="text-sm text-gray-600">
                                  {sub.details.join(", ")}
                                </p>
                              )}
                              {sub.perSession && (
                                <p className="text-sm text-gray-600">
                                  Per Session: {sub.perSession}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        <section className="w-3/4 flex flex-row gap-8 justify-center my-60">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 text-lg w-1/2 ">
            <li className="flex gap-2 justify-center">
              <FacebookIcon fill="#002B7F" />
              <a
                href="https://www.facebook.com/BeautoxAestheticClinicNewManila"
                target="_blank"
                rel="noreferrer"
                className="hover:text-faintingLight-400 transition-colors"
              >
                FACEBOOK
              </a>
            </li>

            <li className="flex gap-2 justify-center">
              <PhoneIcon />
              0917-895-8825
            </li>
            <li className="flex gap-2 justify-center">
              <InstagramIcon fill="#E1306C" />
              <a
                href="https://www.instagram.com/beautoxnewmanila/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-faintingLight-400 transition-colors"
              >
                INSTAGRAM
              </a>
            </li>
            <li className="flex gap-2 justify-center">
              <EmailIcon />
              beautoxph@gmail.com
            </li>
          </ul>
          <h3 className="w-1/2 text-3xl text-end font-bold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
            WANT TO LEARN MORE ABOUT US? FIND US HERE
          </h3>
        </section>
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
