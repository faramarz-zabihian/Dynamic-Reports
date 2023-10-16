using System;

namespace WcfReportService
{
    class Number
    {
        Decimal x;
        Type type;
        public Decimal Max(Decimal y) { return x >= y ? x : y; }
        public Decimal Min(Decimal y) { return x < y ? x : y; }

        public Number(Number v)
            : this(v.type, v.Value)
        {
        }
        public Decimal Value { get { return x; } }

        public static Number operator +(Number c1, Number c2)
        {

            return new Number(c1.type, c1.Value + c2.Value);
        }
        public static Number operator +(Number c1, int c2)
        {

            return new Number(c1.type, c1.Value + c2);
        }
        public static implicit operator Number(int c2)
        {
            return new Number(typeof(int), c2);
        }
        public static implicit operator Decimal(Number d)
        {
            return d.Value;
        }

        public static bool IsNumericType(Type t)
        {
            switch (Type.GetTypeCode(t))
            {
                case TypeCode.Byte:
                case TypeCode.SByte:
                case TypeCode.Decimal:
                case TypeCode.Double:
                case TypeCode.Int16:
                case TypeCode.Int32:
                case TypeCode.Int64:
                case TypeCode.Single:
                case TypeCode.UInt16:
                case TypeCode.UInt32:
                case TypeCode.UInt64:
                    return true;
                default:
                    return false;
            }
        }
        public Number(Type t, object o)
        {

            type = t;
            if (IsNumericType(t))
                if (!o.Equals(DBNull.Value))
                    x = Convert.ToDecimal(o);
                else
                    x = 0;
            else
                throw new Exception(String.Format("{0} has not a numeric representation", t.Name));
        }
    }

}


