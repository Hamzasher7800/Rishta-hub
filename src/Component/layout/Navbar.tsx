// import React, { useEffect, useRef, useState } from "react";
// import Sales from "../Sections/Sales";
// import Inventory from "../Sections/Inventory";
// import Checkouts from "../Sections/Checkouts";
// import Reports from "../Sections/Reports";
// import Vendors from "../Sections/Vendors";

// interface Section {
//   id: string;
//   label: string;
//   Component: React.FC;
// }

// const sections: Section[] = [
//   { id: "inventory", label: "Inventory", Component: Inventory },
//   { id: "sales", label: "Sales", Component: Sales },
//   { id: "vendors", label: "Vendors", Component: Vendors },
//   { id: "checkouts", label: "Checkouts", Component: Checkouts },
//   { id: "reports", label: "Reports", Component: Reports },
// ];

// const App: React.FC = () => {
//   const [active, setActive] = useState<string | null>(null);
//   const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // IntersectionObserver to track visible section
//   useEffect(() => {
//     const observerOptions = { threshold: 0.5 };

//     const observer = new IntersectionObserver(
//       (entries: IntersectionObserverEntry[]) => {
//         let best: { id: string; ratio: number } | null = null;

//         entries.forEach((entry) => {
//           const target = entry.target as HTMLElement;
//           if (entry.isIntersecting) {
//             const ratio = entry.intersectionRatio;
//             if (!best || ratio > best.ratio) {
//               best = { id: target.id, ratio };
//             }
//           }
//         });

//         if (best) {
//           setActive(best.id); // show navbar when a section is visible
//         } else {
//           setActive(null); // hide navbar if no section visible
//         }
//       },
//       observerOptions
//     );

//     sections.forEach((s) => {
//       const el = sectionRefs.current[s.id];
//       if (el) observer.observe(el);
//     });

//     return () => observer.disconnect();
//   }, []);

//   const handleClick = (id: string) => {
//     const el = sectionRefs.current[id];
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   return (
//     <div className="w-full relative">
//       {/* Navbar: only show when a section is visible */}
//       {active && (
//         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-200 shadow-lg rounded-full px-6 py-2 z-50 flex space-x-6">
//           {sections.map((s) => (
//             <button
//               key={s.id}
//               onClick={() => handleClick(s.id)}
//               className={`px-3 py-1 rounded-full font-medium transition ${
//                 active === s.id
//                   ? "bg-black text-white"
//                   : "text-gray-600 hover:text-black"
//               }`}
//             >
//               {s.label}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Sections */}
//       {sections.map(({ id, Component }) => (
//         <div
//           key={id}
//           id={id}
//           ref={(el) => (sectionRefs.current[id] = el)}
//           className="relative min-h-screen flex flex-col items-center justify-center scroll-mt-28"
//         >
//           <Component />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default App;
