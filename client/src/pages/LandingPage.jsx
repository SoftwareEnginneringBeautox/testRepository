import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import BeautoxLogo from "@/assets/logos/BeautoxLogo";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import LoginIcon from "@/assets/icons/LoginIcon";
import LocationIcon from "@/assets/icons/LocationIcon";
import FacebookIcon from "@/assets/icons/FacebookIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import EmailIcon from "@/assets/icons/EmailIcon";

import ScheduleAppointmentModal from "../components/modals/ScheduleAppointment";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";

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
      {/* Header - Fixed at top */}
      <header className="fixed w-full flex justify-end p-2 sm:p-4 bg-transparent z-50">
        <Button
          onClick={() => navigate("/login")}
          variant="outline"
          className="border-none text-xs sm:text-sm md:text-base"
        >
          <LoginIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-1">LOGIN AS STAFF</span>
        </Button>
      </header>

      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center gap-16 sm:gap-24 md:gap-32 lg:gap-40 min-h-screen py-16 px-4">
        {/* Hero Section */}
        <section
          id="hero"
          className="w-full sm:w-11/12 md:w-5/6 lg:w-3/4 flex flex-col md:flex-row justify-center items-center my-12 sm:my-16 md:my-24 lg:my-60 pt-12"
        >
          <div className="w-full md:w-1/2 flex flex-col gap-4 sm:gap-6 mb-8 md:mb-0">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl leading-tight font-bold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
                WELCOME TO BEAUTOX
              </h2>
              <h3 className="font-semibold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text">
                Where Beauty meets Innovation
              </h3>
            </div>
            <p className="text-sm sm:text-base">
              Discover personalized skincare, non-invasive treatments, and
              advanced beauty solutions designed to enhance your natural glow.
              Experience expert care and cutting-edge technology tailored to
              your unique beauty goals.
            </p>
            <Button
              fullWidth="true"
              onClick={() => setIsScheduleModalOpen(true)}
              className="text-sm sm:text-base py-2 sm:py-3"
            >
              SET AN APPOINTMENT
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <BeautoxLogo className="h-full w-2/3 md:w-1/2 text-lavender-400 opacity-90" />
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full sm:w-11/12 md:w-5/6 lg:w-3/4 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1043.644141889592!2d121.03651836623278!3d14.614630075990188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7656817cb95%3A0xc3a3721da76b89!2sSonema%20Square!5e0!3m2!1sen!2sph!4v1741322385811!5m2!1sen!2sph"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-3xl w-full min-h-64"
              height={300}
              title="Beautox Location"
            ></iframe>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-end mt-4 md:mt-0">
            <div className="flex flex-row gap-2 justify-center md:justify-end pb-2">
              <h3 className="flex flex-row justify-center items-center font-semibold text-xl sm:text-2xl bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
                <div className="text-lavender-400 h-full pr-1 flex items-center">
                  <LocationIcon className="w-5 h-5" />
                </div>
                DON'T KNOW WHERE TO FIND US?
              </h3>
            </div>
            <p className="text-sm sm:text-base">
              We are located at{" "}
              <span className="font-bold">
                J26P+XXR, N. Domingo, Quezon City, 1112 Metro Manila
              </span>
              , near Robinson's Magnolia.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="w-full sm:w-11/12 md:w-5/6 lg:w-3/4 flex flex-col items-center justify-center gap-4 my-12 sm:my-16 md:my-24 lg:my-60">
          <div className="w-full">
            <h2 className="text-center md:text-start font-semibold text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text py-2 sm:py-4">
              HERE'S WHAT WE HAVE IN STORE FOR YOU
            </h2>
            <Tabs defaultValue={services[0].category} className="w-full mt-4">
              <TabsList className="flex flex-wrap justify-center rounded-md shadow-md bg-white/5 backdrop-blur-[3.5px] overflow-x-auto">
                {services.map((service) => (
                  <TabsTrigger
                    key={service.category}
                    value={service.category}
                    className="px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm md:text-md font-semibold transition-all rounded-md data-[state=active]:bg-lavender-600 data-[state=active]:text-customNeutral-100"
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
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {service.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 sm:p-4 bg-ash-200 shadow-md rounded-md text-sm sm:text-base"
                      >
                        <h4 className="font-semibold text-base sm:text-lg">
                          {item.name.toUpperCase()}
                        </h4>
                        <p className="text-lavender-400 font-bold">
                          {item.price}
                        </p>
                        {item.details && (
                          <ul className="text-xs sm:text-sm text-reflexBlue-300 list-disc pl-4">
                            {item.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        )}
                        {item.perSession && (
                          <div className="text-xs sm:text-sm text-lavender-400">
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
                          <p className="text-xs sm:text-sm text-red-500 italic">
                            {item.note}
                          </p>
                        )}
                        {item.discount && (
                          <p className="text-xs sm:text-sm text-reflexBlue-400 font-bold">
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
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {sub.details.join(", ")}
                                </p>
                              )}
                              {sub.perSession && (
                                <p className="text-xs sm:text-sm text-gray-600">
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

        {/* test section */}
        <section className=" w-3/4 flex flex-col items-center justify-center gap-4 my-12 sm:my-16 md:my-24 lg:my-60">
          <div className="w-full">
            <h2 className="text-center md:text-start font-semibold text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text py-2 sm:py-4">
              HERE'S WHAT WE HAVE IN STORE FOR YOU
            </h2>
            <Tabs defaultValue={services[0].category} className="w-full mt-4">
              <TabsList className="flex flex-wrap justify-center rounded-md shadow-md bg-white/5 backdrop-blur-[3.5px] overflow-x-auto">
                {services.map((service) => (
                  <TabsTrigger
                    key={service.category}
                    value={service.category}
                    className="px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm md:text-md font-semibold transition-all rounded-md data-[state=active]:bg-lavender-600 data-[state=active]:text-customNeutral-100"
                  >
                    {service.category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Carousel>
              <CarouselContent>
                <CarouselItem>1</CarouselItem>
                <CarouselItem>2</CarouselItem>
                <CarouselItem>3</CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full sm:w-11/12 md:w-5/6 lg:w-3/4 flex flex-col-reverse md:flex-row gap-8 justify-center my-12 sm:my-16 md:my-24 lg:my-60">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm sm:text-base md:text-lg w-full md:w-1/2 mt-6 md:mt-0">
            <li className="flex gap-2 justify-center sm:justify-start">
              <FacebookIcon fill="#002B7F" className="w-5 h-5" />
              <a
                href="https://www.facebook.com/BeautoxAestheticClinicNewManila"
                target="_blank"
                rel="noreferrer"
                className="hover:text-faintingLight-400 transition-colors"
              >
                FACEBOOK
              </a>
            </li>

            <li className="flex gap-2 justify-center sm:justify-start">
              <PhoneIcon className="w-5 h-5" />
              0917-895-8825
            </li>
            <li className="flex gap-2 justify-center sm:justify-start">
              <InstagramIcon fill="#E1306C" className="w-5 h-5" />
              <a
                href="https://www.instagram.com/beautoxnewmanila/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-faintingLight-400 transition-colors"
              >
                INSTAGRAM
              </a>
            </li>
            <li className="flex gap-2 justify-center sm:justify-start">
              <EmailIcon className="w-5 h-5" />
              beautoxph@gmail.com
            </li>
          </ul>
          <h3 className="w-full md:w-1/2 text-xl sm:text-2xl md:text-3xl text-center md:text-end font-bold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
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
