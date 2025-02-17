import { useState } from "preact/hooks";

import { ACCORDIONS } from "@/types/accordion";

const title = "Nuestras principales Áreas";

export default function AccordionSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-primary">
      <div className="py-10 max-w-screen-xl mx-auto">
        <h2 className="text-white text-center text-2xl md:text-4xl md:text-left">{title}</h2>
        <div className="pt-10 px-5 flex flex-col md:grid md:grid-cols-2 md:gap-10">
          <img
            src={ACCORDIONS[activeIndex].image}
            alt=""
            className="hidden md:block rounded-xl object-cover object-center transition-opacity duration-300 ease-in"
          />
          <div className="flex flex-col gap-4">
            {ACCORDIONS.map(({ number, title, description }, index) => (
              <div key={number} className={`flex flex-col ${activeIndex === index ? 'gap-4' : ''}`}>
                <button
                  type="button"
                  className="hover:cursor-pointer dark:bg-primary border-t-1 md:border-t-white pt-5 flex items-center gap-3 justify-start w-full font-medium"
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="text-slate-400 text-sm">{number}</span>
                  <p className="text-white">{title}</p>
                </button>
                <div
                  className={`transition duration-500 ease-in overflow-hidden ${activeIndex === index ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 -translate-y-4 h-0'}`}
                >
                  <img
                    src={ACCORDIONS[activeIndex].image}
                    alt=""
                    className="rounded-xl md:w-3xs xl:w-96 md:hidden transition-opacity duration-500 ease-in"
                  />
                  <p className="text-white text-sm mt-3">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
