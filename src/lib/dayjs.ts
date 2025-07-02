import _dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

import "dayjs/locale/ko";
import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/fr";

_dayjs.extend(relativeTime);
_dayjs.extend(localizedFormat);

// 로케일 설정 함수
export const setDayjsLocale = (locale: string) => {
  const shortLocale = locale.split("-")[0];
  const supported = ["en", "ko", "ja", "fr"];
  const finalLocale = supported.includes(shortLocale) ? shortLocale : "en";
  _dayjs.locale(finalLocale);
};

const dayjs = _dayjs;
const userLang = navigator.language;
setDayjsLocale(userLang);

// 외부에서 사용할 이름은 그대로 `dayjs`
export default dayjs;
