using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ServiceBus.Messaging;
using Newtonsoft.Json;

namespace ATMEventGenerator
{
    class Program
    {
        static double _probability = 0.01;
        static int _transactions = 0;
        static int _cardNumber = -1;
        static string _connectionString = "connection_string";

        static void Main(string[] args)
        {
            var rand = new Random();
            var client = EventHubClient.CreateFromConnectionString(_connectionString, "inputhub");

            while (true)
            {
                int card = 123456789 + rand.Next(0, 888888888);

                // Occasionally generate a fraudulent transaction by reusing a card number
                if (rand.NextDouble() < _probability && _cardNumber != -1)
                {
                    card = _cardNumber;
                    _cardNumber = -1;
                }

                // Formulate a transaction
                var transaction = new
                {
                    transactionId = _transactions++,
                    transactionTime = DateTime.UtcNow.ToString(),
                    deviceId = 12345 + rand.Next(0, 88888),
                    cardNumber = card,
                    amount = rand.Next(1, 20) * 20
                };

                // Occasionally record a card number for later use in generating fraud
                if (rand.NextDouble() < _probability)
                {
                    _cardNumber = transaction.cardNumber;
                }

                // Send an event to the event hub
                var message = JsonConvert.SerializeObject(transaction);
                client.Send(new EventData(Encoding.UTF8.GetBytes(message)));
                Console.WriteLine("[{0}] Event transmitted", transaction.transactionId);
            }
        }
    }
}
