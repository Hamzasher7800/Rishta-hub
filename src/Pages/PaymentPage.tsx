import Footer from "../Component/layout/Footer";
import Header from "../Component/layout/Header";

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:py-8 lg:py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Complete Your Payment
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
            Choose your preferred payment method. We accept payments through
            JazzCash and Bank Transfer. Select the option that works best for
            you.
          </p>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Choose Your Payment Method
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2 sm:px-0">
              You can pay through your preferred partner like JazzCash or Bank
              Transfer
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* JazzCash Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-green-200 hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-white font-bold text-lg sm:text-xl lg:text-xl">
                    J
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                    JazzCash
                  </h3>
                  <p className="text-green-600 font-medium text-sm sm:text-base">
                    Instant Transfer
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-300">
                  <p className="text-xs sm:text-sm text-gray-800 mb-2">
                    Send payment to this{" "}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-800 mb-2">
                    Account Tiltle: <strong>MUBASHAR ALI</strong>{" "}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-800 mb-2">
                    {" "}
                    JazzCash number:
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <p className="text-base sm:text-lg lg:text-xl font-mono font-bold text-gray-800 break-all">
                      0321 8800 544
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("030498503485");
                        alert("Number copied to clipboard!");
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition duration-200 w-full sm:w-auto"
                    >
                      Copy Number
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    <strong>Note:</strong> Use the exact number above for
                    JazzCash payment
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Transfer Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-blue-200 hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-white font-bold text-lg sm:text-xl lg:text-xl">
                    B
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                    Bank Transfer
                  </h3>
                  <p className="text-blue-600 font-medium text-sm sm:text-base">
                    Secure Banking
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-300 space-y-3">
                  {/* Bank Info Row */}
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-4">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                        Bank
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        Meezan Bank
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                        Account Holder
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        MUBASHAR ALI
                      </p>
                    </div>
                  </div>

                  {/* IBAN Section */}
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      IBAN Number
                    </p>
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-mono font-semibold text-gray-800 break-all bg-gray-50 p-2 rounded border">
                        PK87MEZN0000300112140728
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "PK87MEZN0000300112140728"
                          );
                          alert("IBAN copied to clipboard!");
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium transition duration-200 w-full xs:w-auto xs:flex-shrink-0"
                      >
                        Copy IBAN
                      </button>
                    </div>
                  </div>

                  {/* Account Number Section */}
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Account Number
                    </p>
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-mono font-semibold text-gray-800 break-all bg-gray-50 p-2 rounded border">
                        00300112140728
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("00300112140728");
                          alert("Account number copied to clipboard!");
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium transition duration-200 w-full xs:w-auto xs:flex-shrink-0"
                      >
                        Copy Account
                      </button>
                    </div>
                  </div>
                </div>

                {/* Note Section */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed">
                    <strong className="font-semibold">Note:</strong> Include
                    your name and contact number in transaction remarks for
                    quick verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Next Steps After Payment
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2 sm:px-0">
              Follow these simple steps to complete your payment process
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-rose-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-rose-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 mr-2 sm:mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Important Instructions
              </h3>

              <div className="bg-white rounded-lg p-4 sm:p-6 border border-rose-300">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <div className="bg-rose-100 text-rose-600 rounded-full p-1 sm:p-2 mr-3 sm:mr-4 flex-shrink-0 mt-1">
                      <span className="font-bold text-sm sm:text-base">1</span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base pt-1">
                      Complete your payment using either JazzCash or Bank
                      Transfer method mentioned above
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-rose-100 text-rose-600 rounded-full p-1 sm:p-2 mr-3 sm:mr-4 flex-shrink-0 mt-1">
                      <span className="font-bold text-sm sm:text-base">2</span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base pt-1">
                      Take a clear screenshot of your successful payment
                      transaction
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-rose-100 text-rose-600 rounded-full p-1 sm:p-2 mr-3 sm:mr-4 flex-shrink-0 mt-1">
                      <span className="font-bold text-sm sm:text-base">3</span>
                    </div>
                    <div className="pt-1 flex-1">
                      <p className="text-gray-700 text-sm sm:text-base mb-2">
                        Send the screenshot to our WhatsApp number:
                      </p>
                      <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-300">
                        <p className="text-center">
                          <span className="font-bold text-lg sm:text-xl lg:text-2xl text-green-700 block">
                            0321 8800 544
                          </span>
                          <span className="text-xs sm:text-sm text-green-600 block mt-1">
                            (Click the button below to open WhatsApp directly)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 flex justify-center">
                  <a
                    href="https://wa.me/923218800544"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 sm:py-3 sm:px-8 rounded-lg flex items-center justify-center transition duration-200 transform hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.464" />
                    </svg>
                    Send Screenshot on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              If you face any issues during payment process, feel free to
              contact us
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-sm sm:text-base">Call Us</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  +92 321 7748360
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <p className="font-semibold text-sm sm:text-base">
                  Fast Confirmation
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Within 24 Hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
