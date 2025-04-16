import { useState } from "preact/hooks";
import SERVICIOS from "@/data/servicios.json";

import { getI18N } from "@/i18n";

export default function Servicios({ currentLocale }) {
  const i18n = getI18N({ currentLocale });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div id="areas" className="bg-primary">
      <div className="py-10 lg:py-20 max-w-screen-xl mx-auto px-4">
        <h2 className="badge font-semibold">{i18n.AREAS_TITLE}</h2>
        <div className="pt-10 flex flex-col lg:grid lg:grid-cols-2 lg:gap-10">
          <figure>
            <img
              src={SERVICIOS[activeIndex].image}
              alt="areas Asancus Legal"
              decoding="async"
              loading="lazy"
              className="aspect-auto w-full h-96 hidden lg:block rounded-sm object-cover object-center transition-opacity duration-300 ease-in"
              width="484"
              height="384"
            />
          </figure>
          <div className="flex flex-col gap-4">
            {SERVICIOS.map(({ number, title }, index) => {

              const serviceKey = title.split(".")[1];
              const service = i18n.SERVICES[serviceKey];

              return (
                <div key={number} className={`flex flex-col ${activeIndex === index ? 'gap-4' : ''} border-t-1 lg:border-t-white`}>
                  <button
                    type="button"
                    className="hover:scale-95 transition duration-300 ease-in cursor-pointer dark:bg-primary pt-5 flex items-center gap-3 justify-start w-full"
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="text-slate-300 text-sm">{number}</span>
                    <h2 class="text-white text-xl lg:text-2xl">
                      {service?.title || title}
                    </h2>
                  </button>
                  <div
                    className={`transition duration-500 ease-in overflow-hidden ${activeIndex === index ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 -translate-y-4 h-0'
                      }`}
                  >
                    <figure>
                      <img
                        src={SERVICIOS[activeIndex].image}
                        alt="areas Asancus Legal"
                        decoding="async"
                        loading="lazy"
                        className="aspect-auto rounded-sm w-full md:mx-auto md:w-2xs lg:hidden transition-opacity duration-500 ease-in"
                        width="343"
                        height="147" />
                    </figure>
                    <div className="flex flex-col gap-3 px-4 lg:px-7 max-lg:mt-4">
                      {service?.description?.map((description, i) => (
                        <p key={i} className="text-white text-xs md:text-sm">{description}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}
