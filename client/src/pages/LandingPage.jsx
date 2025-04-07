import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import BeautoxLogo from "../assets/logos/Beautox.svg";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import LoginIcon from "@/assets/icons/LoginIcon";
import MenuIcon from "@/assets/icons/MenuIcon";
import FacebookIcon from "@/assets/icons/FacebookIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";

import ProductCard from "@/components/ProductCard";
import ScheduleAppointmentModal from "../components/modals/ScheduleAppointment";
import EmailIcon from "@/assets/icons/EmailIcon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

function LandingPage() {
  const navigate = useNavigate();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              perSession: "₱1,500",
              details: ["8 Sessions"]
            },
            {
              name: "Brazilian Package",
              price: "₱11,999",
              perSession: "₱2,500",
              details: ["8 Sessions"]
            },
            {
              name: "Full Arms or Legs Package",
              price: "₱14,999",
              perSession: "₱3,000",
              details: ["8 Sessions"]
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
          note: "*20% OFF on Diode Packages", 
          subcategories: [
            {
              name: "Brazilian, Bikini, or Butt",
              price: "₱24,999",
              perSession: "₱6,000"
            },
            {
              name: "Underarms, Knees, Elbows, Nape, or Nipples",
              price: "₱14,999",
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
          perSession: [
            { price: "₱19,999 (5 Sessions)" },
            { price: "₱9,999 (2 Sessions)" },
            { price: "₱6,999 (1 Session)" }
          ],
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
          price: "₱24,999",
          discountedFrom: "₱34,999"
        },
        {
          name: "Botox",
          price: "₱150/unit (100 units)",
          perSession: "₱300/unit"
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

  const handleScroll = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // Add wrapper with data-cy attribute
    <div className="w-full bg-white" data-cy="landing-page">
      {/* Header navigation */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="flex items-center justify-end w-full max-w-6xl mx-auto gap-4">
          {/* Main Navigation with Login */}
          <nav className="hidden md:block bg-white/30 backdrop-blur-2xl rounded-full px-3 py-2 shadow-sm">
            <div className="flex items-center gap-5">
              {/* Logo */}
              <img src={BeautoxLogo} alt="Beautox Logo" className="h-6 w-auto" />
              <ul className="flex items-center gap-4">
                {[
                  { label: "About Us", href: "hero" },
                  { label: "Services", href: "services" },
                  { label: "Find Us", href: "about-clinic" },
                  { label: "Testimonials", href: "testimonials" },
                ].map(({ label, href }) => (
                  <li key={href} className="relative group">
                    <a
                      href={`#${href}`}
                      onClick={(e) => handleScroll(e, href)}
                      className="text-purple-900 text-base font-semibold"
                    >
                      {label}
                      <span className="absolute left-0 bottom-0 block h-0.5 bg-lavender-400 transition-all duration-300 w-0 group-hover:w-full" />
                    </a>
                  </li>
                ))}
                <li className="relative group">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-purple-900 text-base font-semibold flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-purple-950 hover:text-white transition-all duration-300"
                  >
                    <LoginIcon className="h-3 w-3" />
                    Login
                  </button>
                </li>
              </ul>
            </div>
          </nav>
  
          {/* Mobile menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <MenuIcon className="text-white" size={24} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-2 mt-2 w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="px-4 py-2 text-gray-800 hover:bg-purple-50 rounded-md cursor-pointer text-sm"
                    onClick={(e) => handleScroll(e, "hero")}
                  >
                    About Us
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-2 text-gray-800 hover:bg-purple-50 rounded-md cursor-pointer text-sm"
                    onClick={(e) => handleScroll(e, "services")}
                  >
                    Services
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-2 text-gray-800 hover:bg-purple-50 rounded-md cursor-pointer text-sm"
                    onClick={(e) => handleScroll(e, "about-clinic")}
                  >
                    Find Us
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-2 text-gray-800 hover:bg-purple-50 rounded-md cursor-pointer text-sm"
                    onClick={(e) => handleScroll(e, "testimonials")}
                  >
                    Testimonials
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-2 mt-2 bg-purple-950 text-white hover:bg-purple-900 rounded-md cursor-pointer flex items-center gap-2 text-sm"
                    onClick={() => navigate("/login")}
                  >
                    <LoginIcon className="text-white" /> Login
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center">
        {/* Hero section */}
        <section
          id="hero"
          className="relative w-full min-h-[100vh] flex items-center bg-cover bg-center bg-no-repeat bg-[url('/images/BeautoxLoginImage.png')] md:bg-[url('/images/NewLanding.png')]"
          data-cy="hero-section"
        >
          {/* Mobile card container */}
          <div className="md:hidden w-[80%] sm:w-[70%] max-w-[350px] mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4">
            <div className="flex flex-col items-center gap-3">
              <img
                src={BeautoxLogo}
                alt="Beautox Logo"
                className="w-20 h-auto"
                data-cy="hero-logo"
              />

              <div className="text-center space-y-2">
                <h3 
                  className="text-lg sm:text-xl leading-tight text-[#4A3B89] font-bold whitespace-nowrap"
                  data-cy="hero-title"
                >
                  Welcome to Beautox
                </h3>

                <p 
                  className="font-semibold text-base sm:text-lg bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text whitespace-nowrap"
                  data-cy="hero-subtitle"
                >
                  Where Beauty meets Innovation
                </p>

                <p 
                  className="text-xs sm:text-sm text-gray-800 leading-relaxed px-1 max-w-[280px] mx-auto"
                  data-cy="hero-description"
                >
                  Experience the pinnacle of skincare luxury with our personalized
                  treatments. Whether you're seeking a rejuvenating facial, targeted
                  acne treatment, or a relaxing massage, our expert team is here to
                  pamper you and address your unique skincare needs.
                </p>

                <button
                  className="flex items-center justify-center gap-1.5 px-4 py-2 mt-2 bg-purple-950 text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-purple-900 transition shadow-md mx-auto"
                  onClick={() => setIsScheduleModalOpen(true)}
                  data-cy="appointment-btn"
                >
                  <CalendarIcon className="h-3 w-3" />
                  Set an Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Desktop content */}
          <div className="hidden md:flex w-full max-w-[450px] flex-col gap-3 relative z-8 pl-8 sm:pl-12 md:pl-16 lg:pl-24">
            <img
              src={BeautoxLogo}
              alt="Beautox Logo"
              className="mb-2 w-36 h-auto mx-auto"
              data-cy="hero-logo"
            />

            <h3 
              className="text-2xl sm:text-3xl md:text-5xl lg:text-4xl leading-none text-[#4A3B89] font-bold w-fit whitespace-nowrap"
              data-cy="hero-title"
            >
              Welcome to Beautox
            </h3>

            <div className="flex flex-col gap-3">
              <p 
                className="font-semibold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text whitespace-nowrap w-fit"
                data-cy="hero-subtitle"
              >
                Where Beauty meets Innovation
              </p>

              <p 
                className="text-base sm:text-lg text-gray-800 leading-relaxed max-w-[28ch] mb-3"
                data-cy="hero-description"
              >
                Experience the pinnacle of skincare luxury with our personalized treatments. Whether you're seeking a rejuvenating facial, targeted acne treatment, or a relaxing massage, our expert team is here to pamper you and address your unique skincare needs.
              </p>

              <button
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-purple-950 text-white rounded-full text-base sm:text-lg font-semibold hover:bg-purple-900 transition shadow-md w-fit"
                onClick={() => setIsScheduleModalOpen(true)}
                data-cy="appointment-btn"
              >
                <CalendarIcon className="h-3 w-3" />
                Set an Appointment
              </button>
            </div>
          </div>
        </section>

        <div className="w-[85%] sm:w-[80%] mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        {/* Featured services section */}
        <section 
          className="w-[85%] sm:w-[80%] mx-auto py-8 sm:py-16"
          data-cy="featured-services-section"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 
              className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text text-center sm:text-left"
              data-cy="featured-services-title"
            >
              FEATURED SERVICES
            </h2>
            <Button
              onClick={(e) => handleScroll(e, "services")}
              className="bg-purple-950 hover:bg-purple-900 text-white w-full sm:w-auto rounded-full"
              data-cy="see-all-services-btn"
            >
              See all
            </Button>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            data-cy="featured-services-grid"
          >
             {/* 40 Sessions Package Card */}
             <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-shadow duration-300 relative">
              <div className="h-[400px] relative">
                <img
                  src="/images/BeautoxModel1.png"
                  alt="40 Sessions Package"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-purple-950/90 via-purple-900/60 to-transparent">
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white via-purple-100 to-purple-200 text-transparent bg-clip-text drop-shadow-sm">
                      40 Sessions Package
                    </h3>
                    <p className="text-xs leading-tight text-gray-200 max-w-[90%]">
                      Get the ultimate beauty and wellness experience with 40
                      sessions of treatments, including slimming, skin
                      rejuvenation, and hair removal.
                    </p>
                  </div>
                </div>
              </div>
                  </div>

            {/* Diode Laser Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-shadow duration-300 relative">
              <div className="h-[400px] relative">
                <img
                  src="/images/BeautoxModel2.png"
                  alt="Diode Laser"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-purple-950/90 via-purple-900/60 to-transparent">
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white via-purple-100 to-purple-200 text-transparent bg-clip-text drop-shadow-sm">
                      Diode Laser
                    </h3>
                    <p className="text-xs leading-tight text-gray-200 max-w-[90%]">
                      Achieve long-lasting smoothness with our Diode Laser
                      treatments, offering precise and effective hair removal
                      for underarms, legs, and intimate areas.
                    </p>
                  </div>
                </div>
              </div>
                  </div>

            {/* Intimate Secret Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-shadow duration-300 relative">
              <div className="h-[400px] relative">
                <img
                  src="/images/BeautoxModel3.png"
                  alt="Intimate Secret"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-purple-950/90 via-purple-900/60 to-transparent">
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white via-purple-100 to-purple-200 text-transparent bg-clip-text drop-shadow-sm">
                      Intimate Secret
                    </h3>
                    <p className="text-xs leading-tight text-gray-200 max-w-[90%]">
                      Feel confident in your own skin with our Intimate Secret
                      package, designed for gentle yet effective hair removal in
                      delicate areas.
                    </p>
                  </div>
                </div>
                </div>
              </div>
          </div>
        </section>

        <div className="w-[85%] sm:w-[80%] mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        {/* Services section */}
        <section
          id="services"
          className="w-[85%] sm:w-[80%] mx-auto my-8 sm:my-12"
          data-cy="service-selection-section"
        >
          <div className="text-center mb-8">
            <h2 
              className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text mb-4"
              data-cy="services-title"
            >
              HERE'S WHAT WE HAVE IN STORE FOR YOU
            </h2>
            <p 
              className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4"
              data-cy="services-subtitle"
            >
              Discover our beauty and wellness services, designed to highlight
              your natural glow and give you the ultimate self-care experience.
            </p>
          </div>
          <Tabs 
            defaultValue={services[0].category} 
            className="w-full"
            data-cy="services-tabs"
          >
            <TabsList className="flex flex-row overflow-x-auto rounded-md shadow-md bg-white/5 backdrop-blur-[3.5px] p-1 no-scrollbar">
                {services.map((service) => (
                  <TabsTrigger
                    key={service.category}
                    value={service.category}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-md font-semibold whitespace-nowrap transition-all rounded-md data-[state=active]:bg-[#4A3B89] data-[state=active]:text-white hover:bg-purple-100"
                  data-cy={`service-tab-${service.category.toLowerCase().replace(' ', '-')}`}
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
                data-cy={`service-tab-content-${service.category.toLowerCase().replace(' ', '-')}`}
              >
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  data-cy={`service-grid-${service.category.toLowerCase().replace(' ', '-')}`}
                >
                    {service.items.map((item, idx) => (
                      <ProductCard
                        key={idx}
                        product={item}
                        category={service.category}
                      data-cy={`service-card-${idx}`}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
        </section>

        <div className="w-[85%] sm:w-[80%] mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        {/* About clinic section */}
        <section
          id="about-clinic"
          className="w-[85%] sm:w-[80%] flex flex-col items-center justify-center gap-4 mx-auto"
          data-cy="about-clinic"
        >
          <h2 
            className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text mb-8 text-center"
            data-cy="about-clinic-title"
          >
            FIND OUR CLINIC
          </h2>

          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* Main Image and Details */}
            <div 
              className="w-full lg:w-1/2"
              data-cy="clinic-images"
            >
              <img
                src="/images/ClinicImage1.jpg"
                alt="Beautox Clinic Main"
                className="w-full h-[300px] sm:h-[400px] object-cover rounded-2xl mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300"
                data-cy="clinic-main-image"
              />
              <div className="flex gap-2">
                <img
                  src="/images/ClinicImage2.jpg"
                  alt="Beautox Clinic Interior"
                  className="w-1/2 h-20 sm:h-24 object-cover rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300"
                  data-cy="clinic-image-1"
                />
                <img
                  src="/images/ClinicImage3.jpg"
                  alt="Beautox Clinic Treatment Room"
                  className="w-1/2 h-20 sm:h-24 object-cover rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300"
                  data-cy="clinic-image-2"
                />
              </div>
            </div>

            {/* Clinic Information */}
            <div 
              className="w-full lg:w-1/2 flex flex-col gap-6 bg-gray-100/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-md"
              data-cy="clinic-info"
            >
              <div>
                <h3 
                  className="text-xl sm:text-2xl font-semibold text-[#4A3B89] mb-2"
                  data-cy="clinic-name"
                >
                  Beautox Aesthetic Clinic
                </h3>
                <p 
                  className="text-gray-600 text-base sm:text-lg"
                  data-cy="clinic-address"
                >
                  42 Sonema Square, N. Domingo Street, Unit 5 Brgy. Valencia, Quezon City, 1112 Metro Manila <br />
                  Near Robinson's Magnolia
                </p>
              </div>

              <div>
                <h4 
                  className="text-lg sm:text-xl font-semibold text-[#4A3B89] mb-2"
                  data-cy="clinic-hours-title"
                >
                  Operations Days
                </h4>
                <p 
                  className="text-gray-600"
                  data-cy="clinic-hours"
                >
                  Mon - Sun:{" "}
                  <span className="font-semibold text-gray-700">12pm - 9pm</span>{" "}
                </p>
              </div>

              <div>
                <h4 
                  className="text-lg sm:text-xl font-semibold text-[#4A3B89] mb-2"
                  data-cy="clinic-contact-title"
                >
                  Contact Number
                </h4>
                <div 
                  className="flex flex-col gap-1 text-gray-600"
                  data-cy="clinic-contact-info"
                >
                  <p>
                    Landline:{" "}
                    <span className="text-gray-700" data-cy="clinic-phone">0917-895-8825</span>
                  </p>
                  <p>
                    Mobile:{" "}
                    <span className="text-gray-700" data-cy="clinic-email">beautoxph@gmail.com</span>
                  </p>
                </div>
              </div>

              <Button
                onClick={(e) => handleScroll(e, "location")}
                className="bg-purple-950 hover:bg-purple-900 text-white w-full sm:w-fit px-6 sm:px-8 py-3 rounded-full flex items-center justify-center gap-2"
                data-cy="view-map-btn"
              >
                View Map
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Google Map */}
          <div 
            id="location" 
            className="w-full mt-8"
            data-cy="location"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1043.644141889592!2d121.03651836623278!3d14.614630075990188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7656817cb95%3A0xc3a3721da76b89!2sSonema%20Square!5e0!3m2!1sen!2sph!4v1741322385811!5m2!1sen!2sph"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-3xl w-full"
              height={400}
              data-cy="google-map"
            ></iframe>
          </div>
        </section>

        <div className="w-[85%] sm:w-[80%] mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

          {/* Testimonials Section */}
          <section 
          id="testimonials" 
          className="w-[85%] sm:w-[80%] mx-auto mb-8 bg-white py-8"
          data-cy="testimonials"
        >
          <div className="text-center mb-8">
            <p className="text-purple-600 font-medium mb-2">Testimonials</p>
            <h2 
              className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text"
              data-cy="testimonials-title"
            >
              Our Clients Review
            </h2>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            data-cy="testimonials-grid"
          >
            {/* Testimonial 1 */}
            <div className="bg-purple-100/70 rounded-2xl p-8 relative" data-cy="testimonial-1">
              <div className="absolute top-0 left-8 transform -translate-y-1/2">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white bg-purple-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-center pt-10">
                <h4 className="text-xl font-semibold text-gray-800 mb-1">Mae Angeles (Alias) </h4>
                <p className="text-purple-600 text-sm mb-6">Regular Client</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  "Highly recommended! Staffs are very nice, they're also very
                  accommodating! Ain't gonna lie… mano-notice agad ang improvement
                  sa body. I also wanna mention that the clinic is always clean
                  and very pretty."
                </p>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-purple-100/70 rounded-2xl p-8 relative" data-cy="testimonial-2">
              <div className="absolute top-0 left-8 transform -translate-y-1/2">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white bg-purple-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-center pt-10">
                <h4 className="text-xl font-semibold text-gray-800 mb-1"> Ali Rodriguez (Alias) </h4>
                <p className="text-purple-600 text-sm mb-6">Me-So Sexy Package Client</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  "Highly recommended! I love the service here. The mesolipo is
                  really effective. My arms have gotten noticeably thinner even
                  after just 1 session, even my friends noticed it."
                </p>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-purple-100/70 rounded-2xl p-8 relative" data-cy="testimonial-3">
              <div className="absolute top-0 left-8 transform -translate-y-1/2">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white bg-purple-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-center pt-10">
                <h4 className="text-xl font-semibold text-gray-800 mb-1">Jane Almario (Alias) </h4>
                <p className="text-purple-600 text-sm mb-6">Gluta Drips Package Client</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  "Third Empress Gluta Drip ko na dito, and super happy ako! After a few
                  sessions, pumantay na skin tone ko at nag-lighten dark spots ko.
                  Super worth it! Babalik ako for more!"
                </p>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
            

        <div className="w-[85%] sm:w-[80%] mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        {/* Contact Section */}
        <section
          id="contact"
          className="w-full bg-purple-950 py-16 mt-8"
          data-cy="contact"
        >
          <div className="w-[85%] sm:w-[80%] mx-auto flex flex-col-reverse lg:flex-row gap-8 justify-center">
            <ul 
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-base sm:text-lg w-full lg:w-1/2"
              data-cy="contact-links"
            >
              <li 
                className="flex gap-2 justify-center"
                data-cy="facebook-link"
              >
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href="httpsk://www.facebook.com/BeautoxAestheticClinicNewManila"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  FACEBOOK
                </a>
              </li>

              <li 
                className="flex gap-2 justify-center text-white"
                data-cy="phone-contact"
              >
                <PhoneIcon className="text-white" />
                0917-895-8825
              </li>
              
              <li 
                className="flex gap-2 justify-center"
                data-cy="instagram-link"
              >
                <InstagramIcon fill="#FFFFFF" />
                <a
                  href="https://www.instagram.com/beautoxnewmanila/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  INSTAGRAM
                </a>
              </li>
              
              <li 
                className="flex gap-2 justify-center text-white"
                data-cy="email-contact"
              >
                <EmailIcon className="text-white" />
                beautoxph@gmail.com
              </li>
            </ul>
            <h3 
              className="w-full lg:w-1/2 text-2xl sm:text-3xl text-center lg:text-end font-bold text-white"
              data-cy="find-us-title"
            >
              WANT TO LEARN MORE ABOUT US? CONTACT US HERE
            </h3>
          </div>
        </section>

        {/* Schedule Appointment Modal */}
        <ScheduleAppointmentModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          data-cy="schedule-appointment-modal"
        />
      </div>
    </div>
  );
}

export default LandingPage;
