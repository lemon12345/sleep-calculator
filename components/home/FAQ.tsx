import { SectionBG2 } from "@/components/sectionBG";
import { FAQItem, FAQItemType } from "@/components/shared/FAQItem";
import { useTranslations } from "next-intl";

export default function FAQ() {
  const t = useTranslations("SleepCalculator.faq");

  const faqs: FAQItemType[] = [
    {
      question: t("question1"),
      answer: t("answer1")
    },
    {
      question: t("question2"),
      answer: t("answer2")
    },
    {
      question: t("question3"),
      answer: t("answer3")
    },
    {
      question: t("question4"),
      answer: t("answer4")
    },
    {
      question: t("question5"),
      answer: t("answer5")
    }
  ];

  return (
    <section className="py-20">
      <SectionBG2 />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}