import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#d86c6c] text-gray-300 py-4 pt-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1 - About */}
        <div>
          <h2 className="text-3xl font-semibold text-white mb-4">About Us</h2>
          <p className="text-base leading-relaxed text-white">
            Welcome to our RishtaHub platform! We connect people based on shared
            interests, values, and goals. Join us today and discover your
            perfect match.
          </p>
        </div>

        {/* Column 2 - Contact Info */}
        <div className="text-white">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Contact Info
          </h2>
          <ul className="space-y-3 text-base">
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-pink-900" />
              <span> support@rishtahub.online</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-pink-900" />
              <span>+92 329 7748360</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-pink-900" />
              <span>5-F, Wockland Homes, Ali Town, Raiwind Road, Lahore</span>
            </li>
          </ul>
        </div>

        {/* Column 3 - Social Links */}
        <div className="text-white">
          <h2 className="text-3xl font-semibold text-white mb-4">Follow Us</h2>
          <div className="flex items-center space-x-5">
            <a href="#" className="hover:text-pink-500 transition-colors">
              <Facebook size={26} />
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              <Instagram size={26} />
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              <Twitter size={26} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-2 text-center text-sm sm:text-base text-white">
        © Copyright {new Date().getFullYear()} RishtaHub. All rights reserved |
        Dessign by{" "}
        <a
          href="https://www.google.com/search?q=mushahid+buttar&rlz=1C1UEAD_enPK1153PK1153&oq=mushahid+buttar&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQLhgNGIAEMgYIAhBFGDwyBggDEEUYQTIGCAQQRRhBMgYIBRBFGD0yBggGEEUYPTIGCAcQRRhB0gEINDMxMmowajeoAgiwAgHxBS8FnQhZ7Z14&sourceid=chrome&ie=UTF-8"
          className="font-semibold text-black  hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
          aria-label="Visit Mushahid Buttar profile"
        >
          Mushahid Buttar
        </a>
      </div>
    </footer>
  );
};

export default Footer;
