
using System.Globalization;
using System;

namespace FSP
{
    public class ShamsiDate : IFormattable
    {
        private struct Date_Structure
        {
            public int year;

            public int month;

            public int day;
        }

        private int _month;

        private int _year;

        private int _day;

        private int _hour;

        private int _minute;

        private int _second;

        private DateTime _datetime;
        private DayOfWeek _dayofWeek;
        private XPersianCalendar pers = new XPersianCalendar();

        public int Month => _month;

        public int Year => _year;

        public int Day => _day;

        public static ShamsiDate Now => new ShamsiDate(DateTime.Now);

        public DateTime DateTime => _datetime;

        public string ToLongDateString => ToString("D");

        public ShamsiDate PrevMonth
        {
            get
            {
                Date_Structure ir = default(Date_Structure);
                ir.day = 1;
                ir.month = _month;
                ir.year = _year;
                checked
                {
                    if (--ir.month < 1)
                    {
                        ir.month = 12;
                        ir.year--;
                    }

                    Date_Structure date_Structure = Miladi(ir);
                    return new ShamsiDate(new DateTime(date_Structure.year, date_Structure.month, date_Structure.day));
                }
            }
        }

        public ShamsiDate NextMonth
        {
            get
            {
                Date_Structure ir = default(Date_Structure);
                ir.day = 1;
                ir.month = _month;
                ir.year = _year;
                checked
                {
                    if (++ir.month > 12)
                    {
                        ir.month = 1;
                        ir.year++;
                    }

                    Date_Structure date_Structure = Miladi(ir);
                    return new ShamsiDate(new DateTime(date_Structure.year, date_Structure.month, date_Structure.day));
                }
            }
        }

        public ShamsiDate()
            : this(default(DateTime))
        {
        }

        public ShamsiDate(DateTime dt)
        {
            _datetime = dt;
            _year = pers.GetYear(dt);
            _month = pers.GetMonth(dt);
            _day = pers.GetDayOfMonth(dt);
            _hour = pers.GetHour(dt);
            _minute = pers.GetMinute(dt);
            _second = pers.GetSecond(dt);
            _dayofWeek = pers.GetDayOfWeek(dt);
        }

        public ShamsiDate(string shamsiString)
        {
            if (ISDate(shamsiString))
            {
                shamsiString.Split('/');
                Date_Structure ir = readDate(shamsiString);
                Date_Structure date_Structure = Miladi(ir);
                _datetime = new DateTime(date_Structure.year, date_Structure.month, date_Structure.day);
                return;
            }

            throw new ArgumentOutOfRangeException("shamsiString");
        }

        private static Date_Structure readDate(string shamsiString)
        {
            checked
            {
                Date_Structure result = default(Date_Structure);
                if (shamsiString.IndexOfAny("./".ToCharArray()) > -1)
                {
                    string[] array = shamsiString.Split('/');
                    if (array.Length == 1 && shamsiString.IndexOf(".") > -1)
                    {
                        array = shamsiString.Split('.');
                    }

                    switch (array.Length)
                    {
                        case 3:
                            result.year = int.Parse(array[0]);
                            result.month = int.Parse(array[1]);
                            result.day = int.Parse(array[2]);
                            if (result.year < 100)
                            {
                                result.year += 1300;
                            }

                            break;
                        case 2:
                            result.year = new ShamsiDate(DateTime.Now).Year;
                            result.month = int.Parse(array[0]);
                            result.day = int.Parse(array[1]);
                            break;
                        default:
                            throw new ArgumentException("Invalid Date", "shamsiString");
                    }
                }
                else
                {
                    switch (shamsiString.Length)
                    {
                        case 8:
                            result.year = int.Parse(shamsiString.Substring(0, 4));
                            result.month = int.Parse(shamsiString.Substring(4, 2));
                            result.day = int.Parse(shamsiString.Substring(6, 2));
                            break;
                        case 6:
                            {
                                ShamsiDate shamsiDate = new ShamsiDate(DateTime.Now);
                                result.year = int.Parse(shamsiString.Substring(0, 2));
                                result.year = shamsiDate.Year;
                                result.month = int.Parse(shamsiString.Substring(2, 2));
                                result.day = int.Parse(shamsiString.Substring(4, 2));
                                break;
                            }
                        case 4:
                            {
                                ShamsiDate shamsiDate = new ShamsiDate(DateTime.Now);
                                result.year = shamsiDate.Year;
                                result.month = int.Parse(shamsiString.Substring(0, 2));
                                result.day = int.Parse(shamsiString.Substring(2, 2));
                                break;
                            }
                        case 1:
                        case 2:
                            {
                                ShamsiDate shamsiDate = new ShamsiDate(DateTime.Now);
                                result.year = shamsiDate.Year;
                                result.month = shamsiDate.Month;
                                result.day = int.Parse(shamsiString.Substring(0, 2));
                                break;
                            }
                        default:
                            throw new ArgumentException("Invalid Date", "shamsiString");
                    }
                }

                return result;
            }
        }

        public override string ToString()
        {
            return ToString("g");
        }

        private DateTimeFormatInfo ShamsiCulture()
        {
            DateTimeFormatInfo dateTimeFormat = new CultureInfo("fa-IR", useUserOverride: true).DateTimeFormat;
            dateTimeFormat.ShortDatePattern = "yy/MM/dd";
            dateTimeFormat.ShortTimePattern = "hh:mm";
            dateTimeFormat.LongDatePattern = "yyyy/MM/dd";
            dateTimeFormat.LongTimePattern = "HH:mm";
            dateTimeFormat.FullDateTimePattern = "yyyy/MM/dd hh:mm";
            return dateTimeFormat;
        }

        public string ToString(string format)
        {
            DateTimeFormatInfo dateTimeFormatInfo = ShamsiCulture();
            format = format.Replace(",", "،");
            switch (format.ToLower())
            {
                case "d":
                    format = dateTimeFormatInfo.ShortDatePattern;
                    break;
                case "D":
                    format = dateTimeFormatInfo.LongDatePattern;
                    break;
                case "F":
                    format = dateTimeFormatInfo.FullDateTimePattern;
                    break;
                case "f":
                    format = dateTimeFormatInfo.LongDatePattern + " " + dateTimeFormatInfo.ShortTimePattern;
                    break;
                case "g":
                    format = dateTimeFormatInfo.ShortDatePattern + " " + dateTimeFormatInfo.ShortTimePattern;
                    break;
                case "G":
                    format = dateTimeFormatInfo.ShortDatePattern + " " + dateTimeFormatInfo.LongTimePattern;
                    break;
                case "M":
                    format = dateTimeFormatInfo.MonthDayPattern;
                    break;
                case "m":
                    format = dateTimeFormatInfo.MonthDayPattern;
                    break;
                case "R":
                    format = dateTimeFormatInfo.RFC1123Pattern;
                    break;
                case "r":
                    format = dateTimeFormatInfo.RFC1123Pattern;
                    break;
                case "s":
                    format = dateTimeFormatInfo.SortableDateTimePattern;
                    break;
                case "t":
                    format = dateTimeFormatInfo.ShortTimePattern;
                    break;
                case "T":
                    format = dateTimeFormatInfo.LongTimePattern;
                    break;
                case "U":
                    format = dateTimeFormatInfo.UniversalSortableDateTimePattern;
                    break;
                case "u":
                    format = dateTimeFormatInfo.RFC1123Pattern;
                    break;
                case "Y":
                    format = dateTimeFormatInfo.YearMonthPattern;
                    break;
                case "y":
                    format = dateTimeFormatInfo.YearMonthPattern;
                    break;
            }

            int[] array = new int[3] { _year, _month, _day };
            format = format.Replace("yyyy", "{0}");
            format = format.Replace("yy", "{1:0#}");
            format = format.Replace("y", "{2}");
            format = format.Replace("MMMM", "{3}");
            format = format.Replace("MMM", "{4}");
            format = format.Replace("MM", "{5:0#}");
            format = format.Replace("M", "{6}");
            format = format.Replace("dddd", "{7}");
            format = format.Replace("ddd", "{8}");
            format = format.Replace("dd", "{9:0#}");
            format = format.Replace("d", "{10}");
            format = format.Replace("hh", "{11}");
            format = format.Replace("h", "{12}");
            format = format.Replace("HH", "{13}");
            format = format.Replace("H", "{14}");
            format = format.Replace("mm", "{15}");
            format = format.Replace("m", "{16}");
            format = format.Replace("ss", "{17}");
            format = format.Replace("s", "{18}");
            format = format.Replace("tt", "{19}");
            format = format.Replace("t", "{20}");
            string text = "";
            text = ((_datetime.Hour >= 12) ? dateTimeFormatInfo.PMDesignator : dateTimeFormatInfo.AMDesignator);
            return string.Format(format, array[0], array[0] % 100, array[0] % 100, DateClass.MonthName(array[1]), DateClass.MonthAbrName(array[1]), array[1], array[1], DateClass.WeekDayName((int)_datetime.DayOfWeek), DateClass.WeekDayAbrName((int)_datetime.DayOfWeek), array[2], array[2], _datetime.Hour, _datetime.Hour, _datetime.Hour, _datetime.Hour, _datetime.Minute, _datetime.Minute, _datetime.Second, _datetime.Second, text.Trim(), (text != "") ? string.Concat(text[0]) : "");
        }

        public DateTime GetFirstDayofMonth()
        {
            Date_Structure ir = default(Date_Structure);
            ir.day = 1;
            ir.month = Month;
            ir.year = Year;
            Date_Structure date_Structure = Miladi(ir);
            return new DateTime(date_Structure.year, date_Structure.month, date_Structure.day);
        }

        public DateTime GetLastDayofMonth()
        {
            return NextMonth.DateTime.AddSeconds(-1.0);
        }

        private Date_Structure Miladi(Date_Structure ir)
        {
            int day = ir.day;
            Date_Structure result = default(Date_Structure);
            checked
            {
                result.year = ir.year + 621;
                int num = rsm(ir.year);
                int num2 = day + table2(ir.month - 1);
                int num3 = num + num2;
                int num4 = km(result.year) - km(result.year - 1);
                if (num3 > 365 + num4)
                {
                    result.year++;
                    num3 = num3 - 365 - num4;
                    num4 = km(result.year) - km(result.year - 1);
                }

                int i;
                for (i = 1; i <= 12 && num3 > table1(num4, i - 1); i++)
                {
                }

                result.day = num3 - table1(num4, (result.month = i - 1) - 1);
                return result;
            }
        }

        private static int km(int ym)
        {
            checked
            {
                return (unchecked(ym / 100) - unchecked(ym / 400) - 2) * ((ym > 1581) ? (-1) : 0) + unchecked(ym / 4);
            }
        }

        private static int ki(int yi)
        {
            int num = checked(yi - 505);
            int num2 = num / 128;
            int num3 = checked(num - num2 * 128);
            int num4 = num3 / 33;
            checked
            {
                int num5 = num3 - num4 * 33;
                return (int)Math.Round((double)(num2 * 31 + num4 * 8) + (double)num5 / 4.0 - (double)num3 / 127.0 - (double)num5 / 32.0);
            }
        }

        private static int rsm(int yi)
        {
            return checked(ki(yi - 1) - km(yi + 620) + 355);
        }

        private static int table2(int iMonth)
        {
            return checked(30 * iMonth + ((iMonth > 6) ? 6 : iMonth));
        }

        private static int table1(int iYear, int iMonth)
        {
            int[] array = new int[12]
            {
                0, 31, 59, 90, 120, 151, 181, 212, 243, 273,
                304, 334
            };
            if (iYear == 1)
            {
                return checked(array[iMonth] + ((iMonth >= 2) ? 1 : 0));
            }

            return array[iMonth];
        }

        public static bool ISDate(string shamsiDate)
        {
            try
            {
                Date_Structure date_Structure = readDate(shamsiDate);
                if (date_Structure.year <= 0 || date_Structure.month <= 0 || date_Structure.day <= 0 || date_Structure.month > 12 || date_Structure.day > 31 || (date_Structure.month > 6 && date_Structure.day > 30))
                {
                    return false;
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        string IFormattable.ToString(string format, IFormatProvider formatProvider)
        {
            return ToString(format);
        }
    }
}
