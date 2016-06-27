using System;
using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

// Many of these examples are from the book Xamarin Mobile Application Development by Dan Hermes
// Published by Apress and available on Amazon: http://www.amazon.com/Xamarin-Mobile-Application-Development-Cross-Platform/dp/1484202155

namespace Mobile3_Lab1_Android
{
    [Activity(Label = "Mobile3_Lab1_Android", MainLauncher = false, Icon = "@drawable/icon")]
    public class MainActivity : Activity
    {
        int count = 1;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.Main);

            // Get our button from the layout resource,
            // and attach an event to it
            Button button = FindViewById<Button>(Resource.Id.submit_name);
            EditText editText = FindViewById<EditText>(Resource.Id.first_name);

            button.Click += delegate { Toast.MakeText(this, editText.Text, ToastLength.Long).Show(); };
        }
    }
}

