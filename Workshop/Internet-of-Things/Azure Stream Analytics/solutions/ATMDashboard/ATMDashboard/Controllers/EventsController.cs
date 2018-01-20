using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ATMDashboard.Controllers
{
    public class EventsController : ApiController
    {
        public ATMEvent[] GetEvents()
        {
            return ATMEventAggregator.GetLoggedEvents();
        }
    }
}
