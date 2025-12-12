// Notification helper utilities
import { createNotification, type User } from "./storage"

export function sendNotification(
  userId: string,
  notification: {
    type: "submission" | "update" | "newsletter"
    title: string
    message: string
    articleId?: string
    actionUrl?: string
  },
) {
  createNotification({
    userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    articleId: notification.articleId,
    actionUrl: notification.actionUrl,
  })
}

export function notifyArticleStatusChange(userId: string, articleTitle: string, newStatus: string, language: string) {
  const messages = {
    uz: {
      approved: {
        title: "Maqola tasdiqlandi",
        message: `Sizning "${articleTitle}" maqolangiz tasdiqlandi va tez orada nashr etiladi.`,
      },
      rejected: {
        title: "Maqola rad etildi",
        message: `Sizning "${articleTitle}" maqolangiz rad etildi. Iltimos, adminstratsiya bilan bog'laning.`,
      },
      revision: {
        title: "Qayta ko'rib chiqish talab qilinadi",
        message: `Sizning "${articleTitle}" maqolangiz uchun qayta ko'rib chiqish talab qilinadi.`,
      },
      published: {
        title: "Maqola nashr etildi",
        message: `Tabriklaymiz! Sizning "${articleTitle}" maqolangiz nashr etildi.`,
      },
    },
    ru: {
      approved: {
        title: "Статья одобрена",
        message: `Ваша статья "${articleTitle}" одобрена и скоро будет опубликована.`,
      },
      rejected: {
        title: "Статья отклонена",
        message: `Ваша статья "${articleTitle}" была отклонена. Пожалуйста, свяжитесь с администрацией.`,
      },
      revision: {
        title: "Требуется доработка",
        message: `Для вашей статьи "${articleTitle}" требуется доработка.`,
      },
      published: {
        title: "Статья опубликована",
        message: `Поздравляем! Ваша статья "${articleTitle}" опубликована.`,
      },
    },
    en: {
      approved: {
        title: "Article Approved",
        message: `Your article "${articleTitle}" has been approved and will be published soon.`,
      },
      rejected: {
        title: "Article Rejected",
        message: `Your article "${articleTitle}" has been rejected. Please contact administration.`,
      },
      revision: {
        title: "Revision Required",
        message: `Your article "${articleTitle}" requires revision.`,
      },
      published: {
        title: "Article Published",
        message: `Congratulations! Your article "${articleTitle}" has been published.`,
      },
    },
    ky: {
      approved: {
        title: "Макала бекитилди",
        message: `Сиздин "${articleTitle}" макалаңыз бекитилди жана жакында жарыяланат.`,
      },
      rejected: {
        title: "Макала четке кагылды",
        message: `Сиздин "${articleTitle}" макалаңыз четке кагылды. Администрация менен байланышыңыз.`,
      },
      revision: {
        title: "Кайра карап чыгуу талап кылынат",
        message: `Сиздин "${articleTitle}" макалаңыз үчүн кайра карап чыгуу талап кылынат.`,
      },
      published: {
        title: "Макала жарыяланды",
        message: `Куттуктайбыз! Сиздин "${articleTitle}" макалаңыз жарыяланды.`,
      },
    },
    kk: {
      approved: {
        title: "Мақала бекітілді",
        message: `Сіздің "${articleTitle}" мақалаңыз бекітілді және жақында жарияланады.`,
      },
      rejected: {
        title: "Мақала қабылданбады",
        message: `Сіздің "${articleTitle}" мақалаңыз қабылданбады. Әкімшілікпен байланысыңыз.`,
      },
      revision: {
        title: "Қайта қарау қажет",
        message: `Сіздің "${articleTitle}" мақалаңыз үшін қайта қарау қажет.`,
      },
      published: {
        title: "Мақала жарияланды",
        message: `Құттықтаймыз! Сіздің "${articleTitle}" мақалаңыз жарияланды.`,
      },
    },
    tg: {
      approved: {
        title: "Мақола тасдиқ шуд",
        message: `Мақолаи шумо "${articleTitle}" тасдиқ шуд ва ба зудӣ нашр мешавад.`,
      },
      rejected: {
        title: "Мақола рад шуд",
        message: `Мақолаи шумо "${articleTitle}" рад шуд. Лутфан бо маъмурият тамос гиред.`,
      },
      revision: {
        title: "Ислоҳ талаб карда мешавад",
        message: `Барои мақолаи шумо "${articleTitle}" ислоҳ талаб карда мешавад.`,
      },
      published: {
        title: "Мақола нашр шуд",
        message: `Табрик! Мақолаи шумо "${articleTitle}" нашр шуд.`,
      },
    },
  }

  const lang = language as keyof typeof messages
  const statusKey = newStatus as keyof (typeof messages)["en"]
  const content = messages[lang]?.[statusKey] || messages.en[statusKey]

  createNotification({
    userId,
    type: "submission",
    title: content.title,
    message: content.message,
  })
}

export function notifyNewSubmission(adminUsers: User[], authorName: string, articleTitle: string) {
  adminUsers.forEach((admin) => {
    createNotification({
      userId: admin.id,
      type: "submission",
      title: "New Article Submission",
      message: `${authorName} submitted a new article: "${articleTitle}"`,
      actionUrl: "/admin/submissions",
    })
  })
}
