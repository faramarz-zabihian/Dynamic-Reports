
using System.Globalization;
using System;

namespace FSP
{
    internal class XPersianCalendar : PersianCalendar
    {
        private bool CheckNull(DateTime time)
        {
            if (time.Year == 1 && time.Month == 1)
            {
                return time.DayOfYear == 1;
            }

            return false;
        }

        public override int GetYear(DateTime time)
        {
            if (CheckNull(time))
            {
                return 1;
            }

            return base.GetYear(time);
        }

        public override int GetMonth(DateTime time)
        {
            if (CheckNull(time))
            {
                return 1;
            }

            return base.GetMonth(time);
        }

        public override int GetDayOfYear(DateTime time)
        {
            if (CheckNull(time))
            {
                return 1;
            }

            return base.GetDayOfYear(time);
        }

        public override int GetDayOfMonth(DateTime time)
        {
            if (CheckNull(time))
            {
                return 1;
            }

            return base.GetDayOfMonth(time);
        }
    }
}
