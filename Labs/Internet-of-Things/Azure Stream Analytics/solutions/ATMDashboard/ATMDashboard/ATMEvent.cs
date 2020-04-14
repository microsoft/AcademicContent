using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ATMDashboard
{
    public class ATMEvent
    {
        [JsonProperty(PropertyName = "card number")]
        public string CardNumber { get; set; }
        [JsonProperty(PropertyName = "atm 1")]
        public string ATM1 { get; set; }
        [JsonProperty(PropertyName = "atm 2")]
        public string ATM2 { get; set; }
        [JsonProperty(PropertyName = "time 1")]
        public string TransactionTime1 { get; set; }
        [JsonProperty(PropertyName = "time 2")]
        public string TransactionTime2 { get; set; }
    }
}