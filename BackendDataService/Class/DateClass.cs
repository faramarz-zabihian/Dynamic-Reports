using System.Globalization;
using System.Text;
using System;

namespace FSP
{
    public sealed class DateClass
    {
        private static string[] MNames = new string[12]
        {
            "فرورديـن", "ارديبهشت", "خـــرداد", "تــيـــر", "مـــرداد", "شهـريـور", "مــهـــر", "آبــــان", "   آذر  ", "    دي  ",
            " بـهـمن ", "اســفنـد"
        };

        private static string[] MNamesL = new string[12]
        {
            "ژانويه", " فوريه", " مارس ", " آوريل", "   مي ", "  جون ", " جولاي ", "  اوت ", "سپتامبر", " اكتبر ",
            " نوامبر", " دسامبر"
        };

        private static string[] WeekDays = new string[7] { "يك شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه", "شنبه" };

        internal static string WeekDayName(int weekday)
        {
            if (weekday < 0 || weekday > 6)
            {
                throw new ArgumentOutOfRangeException("weekday");
            }

            return WeekDays[weekday].Trim();
        }

        internal static string WeekDayAbrName(int weekday)
        {
            if (weekday < 0 || weekday > 6)
            {
                throw new ArgumentOutOfRangeException("weekday");
            }

            return WeekDays[weekday].Trim();
        }

        internal static string MonthAbrName(int month)
        {
            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException("month");
            }

            return MNames[checked(month - 1)].Trim();
        }

        internal static string MonthName(int month)
        {
            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException("month");
            }

            return MNames[checked(month - 1)];
        }

        public static string MonthName(DateTime dt, bool is_shamsi)
        {
            if (is_shamsi)
            {
                return new ShamsiDate(dt).ToString("MMMM");
            }

            return MNamesL[checked(dt.Month - 1)];
        }

        public static int Month(DateTime dt, bool is_shamsi)
        {
            if (is_shamsi)
            {
                return new ShamsiDate(dt).Month;
            }

            return dt.Month;
        }

        private DateClass()
        {
        }

        public static string Shamsi(DateTime mi)
        {
            return new ShamsiDate(mi).ToString("yyyy/MM/dd");
        }

        public static DateTime Miladi(string shamsiDate)
        {
            return new ShamsiDate(shamsiDate).DateTime;
        }

        public static string ReverseDate(string dt, bool rev)
        {
            checked
            {
                if (rev)
                {
                    StringBuilder stringBuilder = new StringBuilder("");
                    char c = '/';
                    string[] array = dt.Split(c);
                    for (int num = array.Length - 1; num >= 0; num--)
                    {
                        if (num < array.Length - 1)
                        {
                            stringBuilder.Append(c);
                        }

                        stringBuilder.Append(array[num]);
                    }

                    return stringBuilder.ToString();
                }

                return dt;
            }
        }

        public static DateTime GetDatedmy(string date)
        {
            IFormatProvider provider = new CultureInfo("fr-FR");
            return DateTime.Parse(date, provider);
        }

        public static bool IsValidDatedmy(string date)
        {
            try
            {
                GetDatedmy(date);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static string DateName(DateTime dt, int format)
        {
            ShamsiDate shamsiDate = new ShamsiDate(dt);
            switch(format)
            {
                case 0: return shamsiDate.ToString();
                case 1:  return shamsiDate.ToString("dddd MMMM yyyy");
                default: return shamsiDate.ToString("dddd , dd MMMM yyyy");
            };
        }
    }
}