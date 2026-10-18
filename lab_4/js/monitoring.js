/**
 * Лабораторна робота №4
 * Дисципліна: WEB-програмування
 * Тема: Робота з циклами, функціями та функціональними виразами в JavaScript. Консоль браузера.
 */

// 1. ВИХІДНІ ДАНІ ТА ПОРОГИ
const noiseLevels = [
  42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76,
  53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63,
  79, 39, 141, 86
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;

// 2. СТРІЛКОВІ ФУНКЦІЇ (Arrow Functions)
// Перевірка допустимого діапазону [30, 130] dB
const isValidLevel = (level, min = minValidLevel, max = maxValidLevel) =>
  typeof level === "number" && Number.isFinite(level) && level >= min && level <= max;

// Форматування підпису dB
const formatDb = value => `${value} dB`;

// 3. ОГОЛОШЕННЯ ФУНКЦІЙ (Function Declarations)
// Пошук першого коректного вимірювання за допомогою do...while
function findFirstValid(levels, min, max) {
  if (!levels || levels.length === 0) return null;

  let i = 0;
  do {
    if (isValidLevel(levels[i], min, max)) {
      return { value: levels[i], position: i + 1 };
    }
    i++;
  } while (i < levels.length);

  return null;
}

// Пошук першого критичного вимірювання за допомогою циклу for та break
function findFirstCritical(levels, critLimit, min, max) {
  if (!levels || levels.length === 0) return null;

  for (let i = 0; i < levels.length; i++) {
    const val = levels[i];
    if (isValidLevel(val, min, max) && val > critLimit) {
      return { value: val, position: i + 1, index: i };
    }
  }
  return null;
}

// Пошук відновлення (3 безпечні виміри <= warningLevel поспіль) за допомогою while
function findRecovery(levels, startAfterIndex, safeLimit, min, max) {
  if (!levels || startAfterIndex === null || startAfterIndex >= levels.length - 1) {
    return null;
  }

  let i = startAfterIndex + 1;
  let consecutiveSafe = 0;

  while (i < levels.length) {
    const val = levels[i];
    if (isValidLevel(val, min, max) && val <= safeLimit) {
      consecutiveSafe++;
      if (consecutiveSafe === 3) {
        return { position: i + 1, value: val };
      }
    } else {
      consecutiveSafe = 0;
    }
    i++;
  }

  return null;
}

// 4. ФУНКЦІОНАЛЬНІ ВИРАЗИ (Function Expressions)
// Підрахунок за категоріями за допомогою for...of та continue
const countByCategory = function(levels, warnLimit, critLimit, min, max) {
  let safeCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  for (const level of levels) {
    if (!isValidLevel(level, min, max)) {
      continue; // Пропускаємо некоректні вимірювання
    }

    if (level <= warnLimit) {
      safeCount++;
    } else if (level <= critLimit) {
      warningCount++;
    } else {
      criticalCount++;
    }
  }

  return { safeCount, warningCount, criticalCount };
};

// Зведені розрахунки (сума, середнє, min/max, некоректні записи)
const analyzeDataset = function(levels, min, max) {
  let validCount = 0;
  let sum = 0;
  let minVal = null;
  let maxVal = null;
  const invalidEntries = [];

  for (let i = 0; i < levels.length; i++) {
    const val = levels[i];
    if (!isValidLevel(val, min, max)) {
      invalidEntries.push({ position: i + 1, value: val });
      continue;
    }

    validCount++;
    sum += val;

    if (minVal === null || val < minVal) minVal = val;
    if (maxVal === null || val > maxVal) maxVal = val;
  }

  const average = validCount > 0 ? sum / validCount : null;

  return {
    total: levels.length,
    validCount,
    invalidEntries,
    average,
    min: minVal,
    max: maxVal
  };
};

// 5. ТЕСТУВАННЯ ГРАНИЧНИХ НАБОРІВ
function runEdgeCaseTests() {
  console.groupCollapsed("🧪 Граничні тести (порожній масив, некоректні дані, межі)");
  console.log("Тест 1 (Порожній масив []):", analyzeDataset([], minValidLevel, maxValidLevel));
  console.log("Тест 2 (Некоректні [-1, 141]):", analyzeDataset([-1, 141], minValidLevel, maxValidLevel));
  console.log("Тест 3 (Межові [70, 85, 86]):", countByCategory([70, 85, 86], warningLevel, criticalLevel, minValidLevel, maxValidLevel));
  console.groupEnd();
}

// 6. ГОЛОВНИЙ ЗВІТ У КОНСОЛІ
function generateReport() {
  const stats = analyzeDataset(noiseLevels, minValidLevel, maxValidLevel);
  const categories = countByCategory(noiseLevels, warningLevel, criticalLevel, minValidLevel, maxValidLevel);
  const firstCritical = findFirstCritical(noiseLevels, criticalLevel, minValidLevel, maxValidLevel);

  const recovery = firstCritical
    ? findRecovery(noiseLevels, firstCritical.index, warningLevel, minValidLevel, maxValidLevel)
    : null;

  const totalExceededWarning = categories.warningCount + categories.criticalCount;

  console.group("Акустична варта -- звіт моніторингу");

  console.log(`Пороги: попередження > ${warningLevel} dB; критичний рівень > ${criticalLevel} dB`);
  console.log(`Усього вимірювань: ${stats.total}`);
  console.log(`Коректних: ${stats.validCount}`);
  console.log(`Некоректних: ${stats.invalidEntries.length}`);

  // Форматування таблиці категорій
  console.table([
    { "Категорія": "Без перевищення", "Кількість": categories.safeCount },
    { "Категорія": "Попередження", "Кількість": categories.warningCount },
    { "Категорія": "Критичні", "Кількість": categories.criticalCount }
  ]);

  const avgFormatted = stats.average !== null
    ? stats.average.toFixed(2).replace(".", ",") + " dB"
    : "null";

  console.log(`Середній рівень: ${avgFormatted}`);
  console.log(`Мінімальний рівень: ${stats.min !== null ? formatDb(stats.min) : "null"}`);
  console.log(`Максимальний рівень: ${stats.max !== null ? formatDb(stats.max) : "null"}`);

  if (firstCritical) {
    console.log(`Перше критичне вимірювання: ${formatDb(firstCritical.value)}, позиція ${firstCritical.position}`);
  } else {
    console.log("Перше критичне вимірювання: не зафіксовано");
  }

  if (recovery) {
    console.log(`Відновлення -- три безпечні вимірювання поспіль: зафіксовано на позиції ${recovery.position}`);
  } else {
    console.log("Відновлення -- три безпечні вимірювання поспіль: не знайдено");
  }

  console.warn(`Поріг ${warningLevel} dB перевищено у ${totalExceededWarning} вимірюваннях.`);

  if (stats.invalidEntries.length > 0) {
    const invalidText = stats.invalidEntries
      .map(entry => `позиція ${entry.position} (${formatDb(entry.value)})`)
      .join(", ");
    console.error(`Некоректні дані: ${invalidText}.`);
  }

  const conclusion = `Висновок: зафіксовано ${categories.criticalCount} критичні вимірювання; ` +
    (recovery
      ? `після першого з них відновлення зафіксовано на позиції ${recovery.position}.`
      : `після першого з них стійкого відновлення не виявлено.`);

  console.log(conclusion);

  console.groupEnd();
}

// Запуск
runEdgeCaseTests();
generateReport();