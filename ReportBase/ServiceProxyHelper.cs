using System;
using System.ServiceModel;

namespace ReportBase
{
    public class ServiceProxyHelper<TProxy, TChanel> : IDisposable
        where TChanel : class
        where TProxy : ClientBase<TChanel>, new()
    {
        TProxy _proxy;
        //MessageViewerInspector _inspector ;
        public TProxy Service
        {
            get { return _proxy; }
            set { throw new ObjectDisposedException("ServiceProxyHelper"); }
        }
        // MessageViewerInspector Inspector
        //{ 
        //    get  
        //    { 
        //        if ( _inspector == null)  
        //            _inspector = new MessageViewerInspector();
        //        return _inspector;
        //    }
        //}
        /// <summary>
        /// Proxy class is a ClientBase of TChanel
        /// </summary>
        /// <typeparam Name="TProxy">A ClientBase of TChanel and has a constructor</typeparam>
        /// <typeparam Name="TChanel">Service interface</typeparam>
        public ServiceProxyHelper()
        {
            _proxy = new TProxy();
            //  _proxy.Endpoint.Behaviors.Add(this.Inspector);
        }
        public ServiceProxyHelper(string endpointAddress)
            : base()
        {

            if (this._proxy != null && !string.IsNullOrEmpty(endpointAddress))
                this._proxy.Endpoint.Address = new EndpointAddress(endpointAddress);
        }
        void IDisposable.Dispose()
        {
            try
            {
                if (_proxy != null)
                    if (_proxy.State != CommunicationState.Faulted)
                        _proxy.Close();
                    else
                        _proxy.Abort();
            }
            catch (CommunicationException ex)
            {
                _proxy.Abort();
            }
            catch (TimeoutException ex)
            {
                _proxy.Abort();
            }
            catch (Exception ex)
            {
                _proxy.Abort();
                throw;
            }
            finally
            {
                _proxy = null;
            }

        }

    }
}
