"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations("SleepCalculator.features");
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 mb-3">
                  <strong className="text-blue-800">{t("cycle90Minutes")}</strong>
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-700 mb-3">
                  <strong className="text-green-800">{t("fiveCycles")}</strong>
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-700 mb-3">
                  <strong className="text-purple-800">{t("countBack")}</strong>
                </p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <p className="text-gray-700 mb-3">
                  {t("example")}
                </p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                <p className="text-gray-700 mb-3">
                  {t("adjustment")}
                </p>
              </div>

              <div className="space-y-4 ml-6">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-1">1</span>
                  <div>
                    <p className="text-gray-700">
                      {t("tooEarly")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-1">2</span>
                  <div>
                    <p className="text-gray-700">
                      {t("sleepThrough")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-1">3</span>
                  <div>
                    <p className="text-gray-700">
                      {t("increments")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-lg border-2 border-indigo-200 mt-8">
                <p className="text-lg text-center text-gray-800 font-medium">
                  {t("optimization")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}