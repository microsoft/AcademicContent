using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATMDashboard
{
    public static class ATMEventAggregator
    {
        private static List<ATMEvent> _events = new List<ATMEvent>();

        public static void LogEvent(ATMEvent e)
        {
            if (_events.Count < 1024) // Avoid unconstrained memory growth
            {
                _events.Add(e);
            }
        }

        public static ATMEvent[] GetLoggedEvents()
        {
            var events = _events.ToArray();
            _events.Clear();
            return events;
        }
    }
}
