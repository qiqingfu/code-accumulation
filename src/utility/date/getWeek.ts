const startDateOfWeekDefaultValue = 0;

interface Options {
  startDateOfWeek?: number;
  startDateOfFirstWeekOfYear?: number;
}

const cloneDate = (value: Date) => {
  return new Date(value.getTime());
};

/**
 * 获取当前周的开始日期
 */
const getStartDateOfWeek = (
  value: Date,
  startDateOfWeek: Options['startDateOfWeek'] = 0
) => {
  const date = cloneDate(value);
  /**
   * 星期天为 0
   * 星期一到星期六分别用 1-6 表示
   */
  const dayOfWeek = date.getDay();
  // 重要
  const diff = (dayOfWeek + 7 - startDateOfWeek) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);

  return date;
};

/**
 * 获取年第一周的第一天日期
 */
const getStartDateOfFirstWeekOfYear = (
  value: Date,
  {
    startDateOfWeek = startDateOfWeekDefaultValue,
    startDateOfFirstWeekOfYear = 1,
  }: Options
) => {
  const date = cloneDate(value);
  let startDateOfFirstWeekOfYearValue = new Date(0);
  const year = date.getFullYear();
  for (let i = year; i >= year - 1; i--) {
    startDateOfFirstWeekOfYearValue.setFullYear(
      i,
      0,
      startDateOfFirstWeekOfYear
    );
    startDateOfFirstWeekOfYearValue.setHours(0, 0, 0, 0);
    startDateOfFirstWeekOfYearValue = getStartDateOfWeek(
      startDateOfFirstWeekOfYearValue,
      startDateOfWeek
    );

    if (date.getTime() >= startDateOfFirstWeekOfYearValue.getTime()) {
      break;
    }
  }

  return startDateOfFirstWeekOfYearValue;
};

function getWeek(
  value: Date,
  {
    startDateOfWeek = startDateOfWeekDefaultValue,
    startDateOfFirstWeekOfYear = 1,
  }: Options = {}
) {
  const date = cloneDate(value);
  // 获取当前周的开始日期
  const startDateOfWeekValue = getStartDateOfWeek(date, startDateOfWeek);
  const startDateOfFirstWeekOfYearValue = getStartDateOfFirstWeekOfYear(date, {
    startDateOfWeek,
    startDateOfFirstWeekOfYear,
  });

  const weekDiff =
    startDateOfWeekValue.getTime() - startDateOfFirstWeekOfYearValue.getTime();

  return Math.round(weekDiff / (7 * 24 * 3600 * 1000));
}

const week = getWeek(new Date());
console.log(week);
