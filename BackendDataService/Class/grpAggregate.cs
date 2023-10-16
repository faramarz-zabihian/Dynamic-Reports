using System;

namespace WcfReportService
{
    class column
    {
        public string Name { get; set; }
        public bool Group { get; set; }
        public int Ordinal { get; set; }
        public ReportConnectionModel.Column Column { get; set; }
    }
    class AggregateItem
    {
        public string AggregateName { get; set; }
        public int AggregateOrdinal { get; set; }
        public string AggregateType { get; set; }

        public Number AggregateValue { get { return _aggregateValue; } set { _aggregateValue = value; } }
        Number _aggregateValue = new Number(0);
        public Number LastValue { get; set; }
        public grpAggregate MergingGroup { get; set; }
    }
    class grpAggregate
    {

        //public Func<IDataReader, string> ReadValue { get; set; }
        //public string KeyTitle { get; set; }
        public string KeyValue { get; set; }
        public string KeyName { get; set; }
        public int KeyOrdinal { get; set; }
        public Boolean Reset { get; set; }
        public Boolean IsReportGroup { get; set; }

        public AggregateItem[] items = new AggregateItem[0];
        public ReportConnectionModel.Column Col { get; set; }
        public int RowCount
        {
            get { return rowCount; }
            set { lastCount = rowCount; rowCount = value; }
        }
        int rowCount = 0;
        public int LastRowCount { get { return lastCount; } }
        int lastCount = 0;
    }
}
