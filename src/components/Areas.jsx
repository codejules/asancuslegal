import { useState } from "preact/hooks";

import { ACCORDIONS } from "@/types/accordion";

const title = "Nuestras principales Áreas";

export default function AccordionSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-primary">
      <div className="py-10 max-w-screen-xl mx-auto px-4">
        <h2 className="text-white text-center text-2xl lg:text-4xl lg:text-left">{title}</h2>
        <div className="pt-10 flex flex-col lg:grid lg:grid-cols-2 lg:gap-10">
          <img
            src={ACCORDIONS[activeIndex].image}
            alt=""
            className="hidden lg:block rounded-xl object-cover object-center transition-opacity duration-300 ease-in"
          />
          <div className="flex flex-col gap-4">
            {ACCORDIONS.map(({ number, title, description }, index) => (
              <div key={number} className={`flex flex-col ${activeIndex === index ? 'gap-4' : ''} border-t-1 lg:border-t-white `}>
                <button
                  type="button"
                  className="hover:scale-95 transition duration-300 ease-in cursor-pointer dark:bg-primary pt-5 flex items-center gap-3 justify-start w-full font-medium"
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="text-slate-400 text-sm">{number}</span>
                  <h2 className="text-white text-xl lg:text-2xl">{title}</h2>
                </button>
                <div
                  className={`transition duration-500 ease-in overflow-hidden ${activeIndex === index ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 -translate-y-4 h-0'}`}
                >
                  <img
                    src={ACCORDIONS[activeIndex].image}
                    alt=""
                    className="rounded-xl w-full md:mx-auto md:w-2xs lg:hidden transition-opacity duration-500 ease-in"
                  />
                  <p className="text-white text-xs md:text-sm mt-3">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
