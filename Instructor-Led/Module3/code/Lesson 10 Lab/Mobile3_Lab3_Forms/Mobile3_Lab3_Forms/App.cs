using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

// Many of these examples are from the book Xamarin Mobile Application Development by Dan Hermes
// Published by Apress and available on Amazon: http://www.amazon.com/Xamarin-Mobile-Application-Development-Cross-Platform/dp/1484202155

using Xamarin.Forms;

namespace Mobile3_Lab3_Forms
{
    public class App : Application
    {
        public App()
        {
            MainPage = new NamePage();
        }

        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}
