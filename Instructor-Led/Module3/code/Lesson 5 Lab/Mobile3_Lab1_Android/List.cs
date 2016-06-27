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
    [Activity(Label = "List", MainLauncher = false)]
    public class List : ListActivity
    {
        List<ListItem> listItems;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            listItems = new List<ListItem> {
                new ListItem {Title = "First", Description="1st item"},
                new ListItem {Title = "Second", Description="2nd item"},
                new ListItem {Title = "Third", Description="3rd item"}
            };

            ListAdapter = new ListItemAdapter(this, listItems);

        }

        protected override void OnListItemClick(ListView l, View v, int position, long id)
        {
            var SelectedItem = listItems[position];
            Android.Widget.Toast.MakeText(this, SelectedItem.Title, Android.Widget.ToastLength.Short).Show();
        }

    }

}