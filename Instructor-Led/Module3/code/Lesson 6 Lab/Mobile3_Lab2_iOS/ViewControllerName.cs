using System;

using UIKit;

namespace Mobile3_Lab2_iOS
{
    public partial class ViewControllerName : UIViewController
    {
        public ViewControllerName() : base("ViewControllerName", null)
        {
        }

        public override void DidReceiveMemoryWarning()
        {
            base.DidReceiveMemoryWarning();

            // Release any cached data, images, etc that aren't in use.
        }

        public override void ViewDidLoad()
        {
            base.ViewDidLoad();

            // Perform any additional setup after loading the view, typically from a nib.
        }

        partial void SubmiName_TouchUpInside(UIButton sender)
        {
            var alert = UIAlertController.Create("Name", firstName.Text ,UIAlertControllerStyle.Alert);
            alert.AddAction(UIAlertAction.Create("OK", UIAlertActionStyle.Cancel, alertAction => { }));
            this.PresentViewController(alert, true, null);
        }
    }
}