import { getI18N } from "@/i18n";

export type Solutions = {
    percentage: string;
    description: string;
}
export function SOLUTIONS(currentLocale: any): Solutions[] {
    const i18n = getI18N({ currentLocale });

    return [
        { percentage: i18n.SOLUTIONS_PERCENTAGE_1, description: i18n.SOLUTIONS_DESCRIPTION_1 },
        { percentage: i18n.SOLUTIONS_PERCENTAGE_2, description: i18n.SOLUTIONS_DESCRIPTION_2 },
        { percentage: i18n.SOLUTIONS_PERCENTAGE_3, description: i18n.SOLUTIONS_DESCRIPTION_3 },
        { percentage: i18n.SOLUTIONS_PERCENTAGE_4, description: i18n.SOLUTIONS_DESCRIPTION_4 },
    ]
};