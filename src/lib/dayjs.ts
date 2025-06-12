import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

import "dayjs/locale/ko";
import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

// 로케일 설정 함수
export const setDayjsLocale = (locale: string) => {
  const shortLocale = locale.split("-")[0];
  const supported = ["en", "ko", "ja", "fr"];
  const finalLocale = supported.includes(shortLocale) ? shortLocale : "en";
  dayjs.locale(finalLocale);
};

export default dayjs;
