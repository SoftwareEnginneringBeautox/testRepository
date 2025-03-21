import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import BeautoxLogo from "@/assets/logos/BeautoxLogo";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import LoginIcon from "@/assets/icons/LoginIcon";
import LocationIcon from "@/assets/icons/LocationIcon";

import ScheduleAppointmentModal from "../components/modals/ScheduleAppointment";

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
          className="w-3/4 flex flex-row justify-center items-center my-6 0"
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

        <section className="w-3/4 flex flex-col items-center justify-center gap-4 my-60">
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
