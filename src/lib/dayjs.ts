import _dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

import "dayjs/locale/ko";
import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/fr";

_dayjs.extend(utc);
_dayjs.extend(timezone);
_dayjs.extend(relativeTime);
_dayjs.extend(localizedFormat);

// ✅ 브라우저 기준 타임존 자동 설정
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
_dayjs.tz.setDefault(userTimeZone);

// ✅ 로케일 설정 함수
export const setDayjsLocale = (locale: string) => {
  const shortLocale = locale.split("-")[0];
  const supported = ["en", "ko", "ja", "fr"];
  const finalLocale = supported.includes(shortLocale) ? shortLocale : "en";
  _dayjs.locale(finalLocale);
};

// ✅ 브라우저 언어로 로케일 자동 설정
const userLang = navigator.language;
setDayjsLocale(userLang);

const dayjs = _dayjs;
export default dayjs;
