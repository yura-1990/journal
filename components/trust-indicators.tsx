"use client"

import { Shield, Award, Users, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function TrustIndicators() {
  const { language } = useLanguage()

  const translations = {
    uz: {
      title: "Nima uchun bizni tanlashadi",
      quality: "Yuqori sifat",
      qualityDesc: "Barcha maqolalar taqrizdan o'tadi",
      fast: "Tez jarayon",
      fastDesc: "10 kun ichida qayta ko'rib chiqiladi",
      trusted: "Ishonchli",
      trustedDesc: "312+ mualliflar ishonadi",
      recognized: "Tan olingan",
      recognizedDesc: "Xalqaro indekslarda",
    },
    ru: {
      title: "Почему выбирают нас",
      quality: "Высокое качество",
      qualityDesc: "Все статьи проходят рецензирование",
      fast: "Быстрый процесс",
      fastDesc: "Рассмотрение в течение 10 дней",
      trusted: "Надежность",
      trustedDesc: "312+ авторов доверяют нам",
      recognized: "Признание",
      recognizedDesc: "В международных индексах",
    },
    en: {
      title: "Why Choose Us",
      quality: "High Quality",
      qualityDesc: "All articles undergo peer review",
      fast: "Fast Process",
      fastDesc: "Review within 10 days",
      trusted: "Trusted",
      trustedDesc: "312+ authors trust us",
      recognized: "Recognized",
      recognizedDesc: "In international indexes",
    },
    ky: {
      title: "Эмне үчүн бизди тандашат",
      quality: "Жогорку сапат",
      qualityDesc: "Бардык макалалар рецензиялоодон өтөт",
      fast: "Тез процесс",
      fastDesc: "10 күн ичинде карап чыгуу",
      trusted: "Ишенимдүү",
      trustedDesc: "312+ авторлор бизге ишенет",
      recognized: "Таанылган",
      recognizedDesc: "Эл аралык индекстерде",
    },
    kk: {
      title: "Бізді неге таңдайды",
      quality: "Жоғары сапа",
      qualityDesc: "Барлық мақалалар рецензиялаудан өтеді",
      fast: "Жылдам процесс",
      fastDesc: "10 күн ішінде қарау",
      trusted: "Сенімді",
      trustedDesc: "312+ авторлар бізге сенеді",
      recognized: "Таанылған",
      recognizedDesc: "Халықаралық индекстерде",
    },
    tg: {
      title: "Чаро моро интихоб мекунанд",
      quality: "Сифати баланд",
      qualityDesc: "Ҳамаи мақолаҳо аз тақриз мегузаранд",
      fast: "Раванди тез",
      fastDesc: "Баррасӣ дар давоми 10 рӯз",
      trusted: "Боэътимод",
      trustedDesc: "312+ муаллифон ба мо эътимод доранд",
      recognized: "Эътироф шуда",
      recognizedDesc: "Дар индексҳои байналмилалӣ",
    },
  }

  const t = translations[language]

  const features = [
    { icon: Shield, title: t.quality, desc: t.qualityDesc },
    { icon: Zap, title: t.fast, desc: t.fastDesc },
    { icon: Users, title: t.trusted, desc: t.trustedDesc },
    { icon: Award, title: t.recognized, desc: t.recognizedDesc },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-balance">{t.title}</h2>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
