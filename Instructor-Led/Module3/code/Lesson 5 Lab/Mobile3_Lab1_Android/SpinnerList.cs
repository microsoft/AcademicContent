using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace Mobile3_Lab1_Android
{
    [Activity(Label = "SpinnerList", MainLauncher = true)]
    public class SpinnerList : Activity
    {
        Spinner spinner;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            SetContentView(Resource.Layout.spinner_list);

            spinner = FindViewById<Spinner>(Resource.Id.fullNameSpinner);

            string[] options = { "Joe Smith", "Carol Bennet", "Jake Bowman", "Bill Berritt", "Jen Mobley" };
            ArrayAdapter adapter = new ArrayAdapter(this, Resource.Layout.text_view_for_spinner, options);
            spinner.Adapter = adapter;

            spinner.ItemSelected += new EventHandler<AdapterView.ItemSelectedEventArgs>(spinner_ItemSelected);

        }

        private void spinner_ItemSelected(object sender, AdapterView.ItemSelectedEventArgs e)
        {
            var toastText = string.Format("Selection: {0}", spinner.GetItemAtPosition(e.Position));
            Toast.MakeText(this, toastText, ToastLength.Long).Show();
        }

    }
}