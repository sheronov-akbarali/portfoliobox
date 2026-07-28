import { plural } from "./plural";
import type { Locale } from "./config";

export function getDictionary(locale: Locale) {
  const t = {
    nav: {
      postProject: { uz: "Loyiha joylash", en: "Post a project", ru: "Добавить проект" }[locale],
      signIn: { uz: "Kirish", en: "Sign in", ru: "Войти" }[locale],
      signUp: { uz: "Roʻyxatdan oʻtish", en: "Sign up", ru: "Регистрация" }[locale],
    },
    home: {
      heroEyebrow: {
        uz: "Dasturchilar hamjamiyati",
        en: "A community for developers",
        ru: "Сообщество разработчиков",
      }[locale],
      heroTitle: {
        uz: "Loyihangizni dunyoga koʻrsating",
        en: "Show your work to the world",
        ru: "Покажите свой проект миру",
      }[locale],
      heroSubtitle: {
        uz: "Oʻz loyihangizni joylang, boshqa dasturchilarning ishlarini koʻring, baholang va fikringizni yozing.",
        en: "Publish your project, explore what other developers are building, rate their work, and leave feedback.",
        ru: "Публикуйте свой проект, изучайте работы других разработчиков, оценивайте их и оставляйте отзывы.",
      }[locale],
      heroCta: {
        uz: "Loyihangizni joylang",
        en: "Post your project",
        ru: "Опубликовать проект",
      }[locale],
      statsProjects: {
        uz: "loyiha",
        en: "projects",
        ru: "проектов",
      }[locale],
      statsDevelopers: {
        uz: "dasturchi",
        en: "developers",
        ru: "разработчиков",
      }[locale],
      statsRating: {
        uz: "oʻrtacha baho",
        en: "average rating",
        ru: "средний рейтинг",
      }[locale],
      emptyState: {
        uz: "Hozircha loyihalar yoʻq. Birinchi boʻlib joylang!",
        en: "No projects yet. Be the first to post one!",
        ru: "Пока нет проектов. Станьте первым!",
      }[locale],
      recentHeading: {
        uz: "Soʻnggi loyihalar",
        en: "Recent projects",
        ru: "Недавние проекты",
      }[locale],
    },
    card: {
      noImage: { uz: "Rasm yoʻq", en: "No image", ru: "Нет изображения" }[locale],
    },
    form: {
      heading: {
        uz: "Yangi loyiha joylash",
        en: "Post a new project",
        ru: "Добавить новый проект",
      }[locale],
      titleLabel: { uz: "Loyiha nomi", en: "Project name", ru: "Название проекта" }[locale],
      titlePlaceholder: {
        uz: "Masalan: TaskFlow — vazifalarni boshqarish",
        en: "e.g. TaskFlow — task management",
        ru: "Например: TaskFlow — управление задачами",
      }[locale],
      descriptionLabel: { uz: "Tavsif", en: "Description", ru: "Описание" }[locale],
      descriptionPlaceholder: {
        uz: "Loyiha nima qiladi, qanday muammoni yechadi...",
        en: "What does it do, what problem does it solve...",
        ru: "Что делает проект, какую проблему решает...",
      }[locale],
      repoLabel: { uz: "GitHub havolasi", en: "GitHub link", ru: "Ссылка на GitHub" }[locale],
      demoLabel: { uz: "Demo havolasi", en: "Demo link", ru: "Ссылка на демо" }[locale],
      techLabel: {
        uz: "Texnologiyalar (vergul bilan ajrating)",
        en: "Tech stack (comma-separated)",
        ru: "Технологии (через запятую)",
      }[locale],
      techPlaceholder: {
        uz: "Next.js, TypeScript, Postgres",
        en: "Next.js, TypeScript, Postgres",
        ru: "Next.js, TypeScript, Postgres",
      }[locale],
      coverLabel: { uz: "Muqova rasmi", en: "Cover image", ru: "Обложка" }[locale],
      submit: { uz: "Loyihani joylash", en: "Post project", ru: "Опубликовать" }[locale],
      submitting: { uz: "Joylanmoqda...", en: "Posting...", ru: "Публикация..." }[locale],
      errorRequired: {
        uz: "Sarlavha va tavsif majburiy",
        en: "Title and description are required",
        ru: "Название и описание обязательны",
      }[locale],
      errorGeneric: {
        uz: "Xatolik yuz berdi, qayta urinib koʻring",
        en: "Something went wrong, please try again",
        ru: "Произошла ошибка, попробуйте снова",
      }[locale],
    },
    project: {
      author: { uz: "Muallif", en: "Author", ru: "Автор" }[locale],
      avgRating: { uz: "Oʻrtacha baho", en: "Average rating", ru: "Средняя оценка" }[locale],
      ratingsCount: (n: number) =>
        `${n} ${plural(locale, n, {
          uz: "ta baho",
          en: ["rating", "ratings"],
          ru: ["оценка", "оценки", "оценок"],
        })}`,
      yourRating: { uz: "Sizning bahoyingiz", en: "Your rating", ru: "Ваша оценка" }[locale],
      signInToRate: {
        uz: "Baholash uchun kiring",
        en: "Sign in to rate",
        ru: "Войдите, чтобы оценить",
      }[locale],
      viewRepo: { uz: "GitHub", en: "GitHub", ru: "GitHub" }[locale],
      viewDemo: { uz: "Demo koʻrish", en: "View demo", ru: "Смотреть демо" }[locale],
      rateAria: (n: number) =>
        ({
          uz: `${n} yulduz baholash`,
          en: `Rate ${n} star${n === 1 ? "" : "s"}`,
          ru: `Оценить на ${n} ${plural(locale, n, {
            uz: "",
            en: ["", ""],
            ru: ["звезду", "звезды", "звёзд"],
          })}`,
        })[locale],
    },
    comments: {
      title: (n: number) =>
        `${{ uz: "Izohlar", en: "Comments", ru: "Комментарии" }[locale]} (${n})`,
      placeholder: {
        uz: "Loyiha haqida fikringizni yozing...",
        en: "Share your thoughts about this project...",
        ru: "Напишите, что вы думаете об этом проекте...",
      }[locale],
      submit: { uz: "Izoh qoldirish", en: "Post comment", ru: "Оставить комментарий" }[locale],
      submitting: { uz: "Yuborilmoqda...", en: "Posting...", ru: "Публикация..." }[locale],
      signInPrompt: {
        uz: "Izoh qoldirish uchun tizimga kiring.",
        en: "Sign in to leave a comment.",
        ru: "Войдите, чтобы оставить комментарий.",
      }[locale],
      delete: { uz: "oʻchirish", en: "delete", ru: "удалить" }[locale],
      empty: {
        uz: "Hozircha izohlar yoʻq. Birinchi boʻlib fikr bildiring!",
        en: "No comments yet. Be the first to share your thoughts!",
        ru: "Пока нет комментариев. Будьте первым!",
      }[locale],
    },
    time: {
      now: { uz: "hozir", en: "just now", ru: "только что" }[locale],
      minutesAgo: (n: number) =>
        `${n} ${plural(locale, n, {
          uz: "daqiqa oldin",
          en: ["minute ago", "minutes ago"],
          ru: ["минуту назад", "минуты назад", "минут назад"],
        })}`,
      hoursAgo: (n: number) =>
        `${n} ${plural(locale, n, {
          uz: "soat oldin",
          en: ["hour ago", "hours ago"],
          ru: ["час назад", "часа назад", "часов назад"],
        })}`,
      daysAgo: (n: number) =>
        `${n} ${plural(locale, n, {
          uz: "kun oldin",
          en: ["day ago", "days ago"],
          ru: ["день назад", "дня назад", "дней назад"],
        })}`,
    },
    footer: {
      tagline: {
        uz: "PortfolioBox — dasturchilar uchun loyihalar platformasi",
        en: "PortfolioBox — a project showcase platform for developers",
        ru: "PortfolioBox — платформа для проектов разработчиков",
      }[locale],
    },
  };

  return t;
}

export type Dictionary = ReturnType<typeof getDictionary>;
