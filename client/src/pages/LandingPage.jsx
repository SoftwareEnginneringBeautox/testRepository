import React, { useState, useEffect } from "react";
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
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";

import ProductCard from "@/components/ProductCard";
import ScheduleAppointmentModal from "../components/modals/ScheduleAppointment";
import EmailIcon from "@/assets/icons/EmailIcon";

function LandingPage() {
  const navigate = useNavigate();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > heroHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleScroll = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full bg-white">
      <header className={`fixed w-full flex flex-col sm:flex-row justify-end items-center p-4 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-purple-950 shadow-md' : 'bg-transparent'
      }`}>
        <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mr-0 sm:mr-8 w-full sm:w-auto">
          <ul className="flex flex-col sm:flex-row text-base font-semibold gap-4 w-full sm:w-auto text-center">
            <li className="mt-2">
              <a
                href="#hero"
                onClick={(e) => handleScroll(e, "hero")}
                className={`relative inline-block px-2 py-1 font-semibold overflow-hidden group ${
                  isScrolled ? 'text-purple-300 hover:text-purple-800' : 'text-purple-900 hover:text-purple-800'
                }`}
              >
                ABOUT US
                <span className={`absolute left-0 bottom-0 block w-0 h-0.5 ${
                  isScrolled ? 'bg-purple-800' : 'bg-purple-800'
                } transition-all duration-300 group-hover:w-full`}></span>
              </a>
            </li>
            <li className="mt-2">
              <a
                href="#services"
                onClick={(e) => handleScroll(e, "services")}
                className={`relative inline-block px-2 py-1 font-semibold overflow-hidden group ${
                  isScrolled ? 'text-purple-300 hover:text-purple-800' : 'text-purple-900 hover:text-purple-800'
                }`}
              >
                SERVICES
                <span className={`absolute left-0 bottom-0 block w-0 h-0.5 ${
                  isScrolled ? 'bg-purple-800' : 'bg-purple-800'
                } transition-all duration-300 group-hover:w-full`}></span>
              </a>
            </li>
            <li className="mt-2">
              <a
                href="#about-clinic"
                onClick={(e) => handleScroll(e, "about-clinic")}
                className={`relative inline-block px-2 py-1 font-semibold overflow-hidden group ${
                  isScrolled ? 'text-purple-300 hover:text-purple-800' : 'text-purple-900 hover:text-purple-800'
                }`}
              >
                FIND US
                <span className={`absolute left-0 bottom-0 block w-0 h-0.5 ${
                  isScrolled ? 'bg-purple-800' : 'bg-purple-800'
                } transition-all duration-300 group-hover:w-full`}></span>
              </a>
            </li>
            <li className="mt-2">
              <a
                href="#testimonials"
                onClick={(e) => handleScroll(e, "testimonials")}
                className={`relative inline-block px-2 py-1 font-semibold overflow-hidden group ${
                  isScrolled ? 'text-purple-300 hover:text-purple-800' : 'text-purple-900 hover:text-purple-800'
                }`}
              >
                TESTIMONIALS
                <span className={`absolute left-0 bottom-0 block w-0 h-0.5 ${
                  isScrolled ? 'bg-purple-800' : 'bg-purple-800'
                } transition-all duration-300 group-hover:w-full`}></span>
              </a>
            </li>
          </ul>
        </nav>
        <Button
          onClick={() => navigate("/login")}
          variant="outline"
          className={`border-none mt-4 sm:mt-0 ${
            isScrolled ? 'text-purple-300 hover:text-purple-800' : 'text-purple-900 hover:text-purple-800'
          }`}
        >
          <LoginIcon />
          LOGIN 
        </Button>
      </header>

      <div className="flex flex-col items-center justify-center">
        <section
          id="hero"
          className="relative w-full min-h-[100vh] flex items-center px-4 sm:px-8 md:px-16 lg:px-24"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(242, 235, 244, 0.8), rgba(255, 255, 255, 0.5), rgba(234, 206, 241, 0.01)), url('/images/LandingImage.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="w-full md:w-1/2 lg:w-6/12 flex flex-col gap-2 relative z-8">
            <img
              src={BeautoxLogo}
              alt="Beautox Logo"
              className="mb-4 w-28 sm:w-32 md:w-36 lg:w-44 h-auto block mx-auto"
            />

            <div className="flex flex-col gap-2 text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none text-[#4A3B89] font-semibold">
                Welcome to Beautox
              </h3>
              <p className="font-semibold text-xl sm:text-2xl text-[#6B5BA5]">
                Where Beauty meets Innovation
              </p>
            </div>

            <p className="text-base sm:text-lg text-gray-800 leading-relaxed text-left">
              Experience the pinnacle of skincare luxury with our
              personalized treatments. Whether you're seeking a
              rejuvenating facial, targeted acne treatment, or a relaxing
              massage, our expert team is here to pamper you and address your
              unique skincare needs.
            </p>
          </div>

          <button
            className="absolute bottom-8 sm:bottom-16 left-4 sm:left-8 md:left-16 lg:left-24 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-purple-950 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-purple-900 transition w-[calc(100%-2rem)] sm:w-auto shadow-md"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <CalendarIcon className="h-5 w-5" />
            SET AN APPOINTMENT
          </button>
        </section>

        <div className="w-[90%] sm:w-3/4 mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        <section className="w-[90%] sm:w-3/4 mx-auto py-8 sm:py-16">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text text-center sm:text-left">
              FEATURED SERVICES
            </h2>
            <Button
              onClick={(e) => handleScroll(e, "services")}
              className="bg-purple-950 hover:bg-purple-900 text-white w-full sm:w-auto"
            >
              See all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                      Get the ultimate beauty and wellness experience with 40 sessions of treatments, including slimming, skin rejuvenation, and hair removal.
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
                      Achieve long-lasting smoothness with our Diode Laser treatments, offering precise and effective hair removal for underarms, legs, and intimate areas.
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
                      Feel confident in your own skin with our Intimate Secret package, designed for gentle yet effective hair removal in delicate areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-[90%] sm:w-3/4 mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        <section
          id="services"
          className="w-[90%] sm:w-3/4 mx-auto my-8 sm:my-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text mb-4">
              HERE'S WHAT WE HAVE IN STORE FOR YOU
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Discover our beauty and wellness services, designed to highlight your natural glow and give you the ultimate self-care experience.
            </p>
          </div>
          <Tabs defaultValue={services[0].category} className="w-full">
            <TabsList className="flex flex-row overflow-x-auto rounded-md shadow-md bg-white/5 backdrop-blur-[3.5px] p-1 no-scrollbar">
              {services.map((service) => (
                <TabsTrigger
                  key={service.category}
                  value={service.category}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-md font-semibold whitespace-nowrap transition-all rounded-md data-[state=active]:bg-[#4A3B89] data-[state=active]:text-white hover:bg-purple-100"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {service.items.map((item, idx) => (
                    <ProductCard
                      key={idx}
                      product={item}
                      category={service.category}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <div className="w-[90%] sm:w-3/4 mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        <section 
          id="about-clinic" 
          className="w-[90%] sm:w-3/4 flex flex-col items-center justify-center gap-4 mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text mb-8 text-center">
            FIND OUR CLINIC
          </h2>
          
          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* Main Image and Details */}
            <div className="w-full lg:w-1/2">
              <img
                src="/images/ClinicImage1.jpg"
                alt="Beautox Clinic Main"
                className="w-full h-[300px] sm:h-[400px] object-cover rounded-2xl mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-shadow duration-300"
              />
              <div className="flex gap-2">
                <img
                  src="/images/ClinicImage2.jpg"
                  alt="Beautox Clinic Interior"
                  className="w-1/2 h-20 sm:h-24 object-cover rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-shadow duration-300"
                />
                <img
                  src="/images/ClinicImage3.jpg"
                  alt="Beautox Clinic Treatment Room"
                  className="w-1/2 h-20 sm:h-24 object-cover rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-shadow duration-300"
                />
              </div>
            </div>

            {/* Clinic Information */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 bg-gray-100/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-md">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#4A3B89] mb-2">
                  Beautox Aesthetic Clinic
                </h3>
                <p className="text-gray-600 text-base sm:text-lg">
                42 Sonema Square, N. Domingo Street, Unit 5 Brgy. Valencia, Quezon City, 1112 Metro Manila <br />
                  Near Robinson's Magnolia
                </p>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-[#4A3B89] mb-2">Operating Days</h4>
                <p className="text-gray-600">
                  Mon - Sun: <span className="font-semibold text-gray-700">12pm - 9pm</span> <br />
                </p>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-[#4A3B89] mb-2">Contact Number</h4>
                <div className="flex flex-col gap-1 text-gray-600">
                  <p>Landline: <span className="text-gray-700">0917-895-8825</span></p>
                  <p>Mobile: <span className="text-gray-700">beautoxph@gmail.com</span></p>
                </div>
              </div>

              <Button 
                onClick={(e) => handleScroll(e, "location")}
                className="bg-purple-950 hover:bg-purple-900 text-white w-full sm:w-fit px-6 sm:px-8 py-3 rounded-full flex items-center justify-center gap-2"
              >
                View Map
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Google Map */}
          <div id="location" className="w-full mt-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1043.644141889592!2d121.03651836623278!3d14.614630075990188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7656817cb95%3A0xc3a3721da76b89!2sSonema%20Square!5e0!3m2!1sen!2sph!4v1741322385811!5m2!1sen!2sph"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-3xl w-full"
              height={400}
            ></iframe>
          </div>
        </section>

        <div className="w-[90%] sm:w-3/4 mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-[90%] sm:w-3/4 mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-reflexBlue-300 to-lavender-300 text-transparent bg-clip-text mb-8 text-center">
            WHAT OUR CLIENTS SAY
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-800 font-semibold text-lg">MA</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Maria Angeles</h4>
                  <p className="text-sm text-purple-600">Regular Client</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Highly recommended! Staffs are very nice, they're also very accommodating! Ain't gonna lie... mano-notice agad ang improvement sa body. I also wanna mention that the clinic is always clean and very pretty. "
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-800 font-semibold text-lg">SR</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Sarah Rodriguez</h4>
                  <p className="text-sm text-purple-600">Me-So Sexy Package Client</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Highly recommended! I love the service here. The mesolipo is really effective. My arms have gotten noticeably thinner even after just 1 session, even my friends noticed it. So I'm definitely availing more sessions and I'm eyeing other services, as well."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-800 font-semibold text-lg">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Jane Dela Cruz</h4>
                  <p className="text-sm text-purple-600">Gluta Drips Package Client</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Third Empress Gluta Drip ko na dito, and super happy ako! Ang accommodating ng staff, ang ganda at bango ng clinic, at ang gaan ng kamay ng nurse—hindi nakaka-intimidate. After a few sessions, pumantay na skin tone ko at nag-lighten dark spots ko. Super worth it! Babalik ako for more!"
              </p>
            </div>
          </div>
        </section>

        <div className="w-[90%] sm:w-3/4 mx-auto">
          <div className="h-0.5 bg-purple-900 my-8 sm:my-16"></div>
        </div>

        <section
          id="contact"
          className="w-[90%] sm:w-3/4 flex flex-col-reverse lg:flex-row gap-8 justify-center mt-8 sm:mt-16 mb-12 sm:mb-20"
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-base sm:text-lg w-full lg:w-1/2">
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
          <h3 className="w-full lg:w-1/2 text-2xl sm:text-3xl text-center lg:text-end font-bold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
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
