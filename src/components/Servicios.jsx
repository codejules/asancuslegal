import { getI18N } from "@/i18n";

export default function Servicios({ currentLocale }) {
  const i18n = getI18N({ currentLocale });
  const services = i18n.SERVICES;

  const IMAGE_AREAS = "https://cdn-images.asancuslegal.com/assets/img/asancuslegal-mercantil.webp"

  const SERVICIOS = services.title.map((title, i) => ({
    title,
    number: services.number[i],
    url: services.url[i]
  }));

  return (
    <div id="servicios" className="bg-primary">
      <div className="py-10 lg:py-20 max-w-screen-xl mx-auto px-4">
        <h2 className="badge font-semibold">{i18n.AREAS_TITLE}</h2>
        <div className="pt-10 flex flex-col lg:grid lg:grid-cols-2 lg:gap-10">
          <figure>
            <img
              src={IMAGE_AREAS}
              alt="areas Asancus Legal"
              decoding="async"
              loading="lazy"
              className="aspect-auto w-full h-96 hidden lg:block rounded-sm object-cover object-center transition-opacity duration-300 ease-in"
              width="484"
              height="384"
            />
          </figure>
          <div className="flex flex-col gap-4">
            {SERVICIOS.map(({ number, title, url }) => {
              return (
                <div className={`flex flex-col border-t-1 lg:border-t-white`}>
                  <a href={url} rel="noopener noreferrer">
                    <button
                      type="button"
                      className="hover:scale-95 transition duration-300 ease-in cursor-pointer dark:bg-primary pt-5 flex items-center gap-3 justify-start w-full"
                    >
                      <span className="text-slate-300 text-sm">{number}</span>
                      <h2 class="text-white text-xl lg:text-2xl">
                        {title}
                      </h2>
                    </button>
                  </a>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}
