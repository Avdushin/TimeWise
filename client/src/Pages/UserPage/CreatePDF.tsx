//@ts-nocheck
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "@/assets/fonts/Roboto-Medium-normal.js";

export const createPdf = (user) => {
  if (!user || !user.auth || !user.backtest) {
    console.error("User data or test results are incomplete or undefined.");
    return;
  }

  const doc = new jsPDF();
  doc.setFont("Roboto-Medium", "normal");
  doc.text(`Профиль пользователя: ${user.auth.username || "Нет данных"}`, 14, 16);

  const bodyContent = [
    ["Имя пользователя", user.auth.username || "Нет данных"],
    ["Email", user.auth.email || "Нет данных"],
    ["Роль", user.auth.role || "Нет данных"],
    ["Имя", user.personal.name || "Нет данных"],
    ["Фамилия", user.personal.surname || "Нет данных"],
    ["Телефон", user.personal.phone || "Нет данных"],
    ["Должность", user.position || "Нет данных"],
    ["Страна", user.location.country || "Нет данных"],
    ["Город", user.location.city || "Нет данных"],
    ["Тип MBTI", user.mbti.type || "Отсутствует"],
    [{ content: 'Тест Струпа', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [211, 211, 211] } }],
    ["Кол-во правильных ответов", user.stroop.correct || "Отсутствует"],
    ["Кол-во неправильных ответов", user.stroop.incorrect || "Отсутствует"],
    [{ content: 'Тест СМИЛ', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [211, 211, 211] } }],
    ["Результат", user.smil && user.smil.url ? "Смотреть результаты" : "Не пройден"],
  ];

  doc.autoTable({
    head: [["Поле", "Значение"]],
    body: bodyContent,
    startY: 30,
    styles: { font: "Roboto-Medium" },
  });

  let finalY = doc.lastAutoTable.finalY || 70;
  if (user.smil && user.smil.url) {
    finalY += 10;
    doc.textWithLink("Ссылка на результаты СМИЛ:", 14, finalY, { url: user.smil.url });
  }

  doc.text("Последний результат теста Бека:", 14, finalY + 20);
  const totalScore = user.backtest.totalScore;
  const depressionLevel = calculateDepressionLevel(totalScore);

  doc.text(`Общий балл: ${totalScore}`, 14, finalY + 30);
  doc.setTextColor(depressionLevel.color);
  doc.text(depressionLevel.label, 14, finalY + 40);
  doc.setTextColor(0); // Сброс цвета текста на черный

  finalY += 50;
  if (!user.backtest || !user.backtest.answers || typeof user.backtest.answers !== 'object') {
    console.error("Ответы на тест Бека отсутствуют или имеют неверный формат.");
  } else {
    Object.entries(user.backtest.answers).forEach(([questionId, { text, score }], index) => {
      const lines = doc.splitTextToSize(`Вопрос ${questionId}: ${text} (Баллы: ${score})`, 180);
      lines.forEach(line => {
        if (finalY > 280) {
          doc.addPage();
          finalY = 20;
        }
        doc.text(line, 14, finalY);
        finalY += 10;
      });
    });
  }


  doc.save(`Профиль-${user.auth.username}.pdf`);
};

const calculateDepressionLevel = (score) => {
  switch (true) {
    case score <= 13:
      return { label: "Минимальная или отсутствующая депрессия", color: "#00FF00" };
    case score <= 19:
      return { label: "Легкая депрессия", color: "#FFFF00" };
    case score <= 28:
      return { label: "Умеренная депрессия", color: "#FFA500" };
    case score >= 29:
      return { label: "Тяжелая депрессия", color: "#FF0000" };
    default:
      return { label: "Неопределенный уровень депрессии", color: "#808080" };
  }
};
