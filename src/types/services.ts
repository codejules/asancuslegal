export type Services = {
    background: string;
    position: string;
    title: string;
    description: string;
    colorDescription?: string;
    titleColor?: string;
};

export const SERVICES: Services[] = [
    {
        background: "src/assets/img/sandra-serra-asancus-legal.webp",
        position: "01",
        title: "Sandra Serra",
        titleColor: "text-black",
        colorDescription: "text-white",
        description: `<p class="text-sm mb-2">Es Licenciada en Derecho por la Universidad de Valencia (2007), abogada en ejercicio perteneciente al 
        Ilustre Colegio de Abogados de Valencia (2009).</p> <p class="text-sm mb-2">Master en Asesoría Jurídica de Empresas por la Fundación de Estudios 
        Bursátiles de Valencia (2008-2009), Curso de Administrador Concursal (2009) y Curso de Planificación Fiscal 
        Internacional CEF (2015) y de Contratos Mercantiles CEF (2020).</p>
        <p><a href="mailto:sandra.serra@asancuslegal.com">sandra.serra@asancuslegal.com</a></p>
        `,
    },
    {
        background: "src/assets/img/alejandro-toledo-asancus-legal.webp",
        position: "02",
        title: "Alejandro Toledo",
        titleColor: "text-black",
        colorDescription: "text-white",
        description: `<p class="text-sm mb-2">Es Licenciado en Derecho por la Universidad de Valencia (2001), abogado en 
        ejercicio perteneciente al Ilustre Colegio de Abogados de Valencia (2004).</p> <p class="text-sm mb-2"> Master en 
        Tributación y Asesoría Fiscal impartido por Centro de Estudios Financieros (CEF), 2005; Master de Dirección 
        Jurídico-Financiera de la Empresa, impartido por la Universidad Politécnica de Valencia (UPV) y el Ilustre 
        Colegio de Abogados de Valencia (ICAV), 2011; y Master Profesional en Dirección de Negocios Internacionales, 
        impartido por la U.D.I.M.A, 2015.</p>
        <p><a href="mailto:alejandro.toledo@asancuslegal.com">alejandro.toledo@asancuslegal.com</a></p>
        `,
    },
];