import { motion } from "framer-motion";
import CustomInput from "../Component/Common/CustomInput";
import Header from "../Component/layout/Header";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify"; // ✅ Changed from react-hot-toast
import Footer from "../Component/layout/Footer";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Full Name is required")
    .min(3, "Full Name must be at least 3 characters"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address (e.g. name@example.com)")
    .required("Email is required"),
  phone: Yup.string()
    .min(7, "Phone must be at least 7 digits")
    .max(15, "Phone cannot be longer than 15 digits")
    .required("Phone number is required")
    .matches(
      /^\+?\d+$/,
      "Enter a valid phone number (e.g. 03001234567 or +923001234567)"
    ),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // 🔹 Create FormData to send to Web3Forms API
        const formData = new FormData();
        formData.append("access_key", "29f83d9c-6acb-4d4e-925b-6fc0544718c5"); // 🔑 Your Web3Forms Access Key
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("subject", values.subject);
        formData.append("message", values.message);

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Message sent successfully!");
          resetForm();
        } else {
          toast.error("Error submitting form. Please try again.");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  // WhatsApp contact function
  const handleWhatsAppClick = () => {
    const phoneNumber = "+923218800544";
    const message = "Hello! I'm interested in learning more about PartnerFinder.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 text-[110%]">
      <Header />
      <div className="flex items-center justify-center flex-grow px-4 sm:px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-6xl w-full">
          <motion.div
            className="flex flex-col justify-center text-white p-2 md:p-6 text-center md:text-left"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-black">
              Get in <span className="text-secondary">Touch With Us</span>
            </h1>
            
            {/* WhatsApp Button - Added above the description */}
            <motion.button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg mb-6 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg mx-auto md:mx-0 w-full max-w-xs text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.464"/>
              </svg>
              Contact on WhatsApp
            </motion.button>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-black">
              Have questions or want to learn more? Fill out the form and our
              team will get back to you as soon as possible. We're here to help
              you on your journey!
            </p>
          </motion.div>

          <div className="bg-white text-black rounded-2xl p-6 sm:p-8 shadow-lg w-full">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
              Contact Us
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <CustomInput
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  placeholder="Your Name"
                  className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.errors.name && formik.touched.name && (
                  <div className="text-sm text-red-500 ml-2">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div>
                <CustomInput
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="Email Address"
                  className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-sm text-red-500 ml-2">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div>
                <CustomInput
                  type="tel"
                  name="phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  placeholder="Phone Number"
                  className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.errors.phone && formik.touched.phone && (
                  <div className="text-sm text-red-500 ml-2">
                    {formik.errors.phone}
                  </div>
                )}
              </div>

              <div>
                <CustomInput
                  type="text"
                  name="subject"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.subject}
                  placeholder="Subject"
                  className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.errors.subject && formik.touched.subject && (
                  <div className="text-sm text-red-500 ml-2">
                    {formik.errors.subject}
                  </div>
                )}
              </div>

              <div>
                <CustomInput
                  variant="textarea"
                  name="message"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                  placeholder="Your Message"
                  className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.errors.message && formik.touched.message && (
                  <div className="text-sm text-red-500 ml-2">
                    {formik.errors.message}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-secondary text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-primary/90 transition cursor-pointer text-sm sm:text-base"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;