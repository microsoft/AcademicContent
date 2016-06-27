// WARNING
//
// This file has been generated automatically by Xamarin Studio from the outlets and
// actions declared in your storyboard file.
// Manual changes to this file will not be maintained.
//
using Foundation;
using System;
using System.CodeDom.Compiler;
using UIKit;

namespace Mobile3_Lab2_iOS
{
    [Register ("ViewControllerName")]
    partial class ViewControllerName
    {
        [Outlet]
        [GeneratedCode ("iOS Designer", "1.0")]
        UIKit.UITextField firstName { get; set; }

        [Outlet]
        [GeneratedCode ("iOS Designer", "1.0")]
        UIKit.UILabel labelFirst { get; set; }

        [Outlet]
        [GeneratedCode ("iOS Designer", "1.0")]
        UIKit.UIButton submitName { get; set; }

        [Action ("SubmiName_TouchUpInside:")]
        [GeneratedCode ("iOS Designer", "1.0")]
        partial void SubmiName_TouchUpInside (UIKit.UIButton sender);

        void ReleaseDesignerOutlets ()
        {
            if (firstName != null) {
                firstName.Dispose ();
                firstName = null;
            }

            if (labelFirst != null) {
                labelFirst.Dispose ();
                labelFirst = null;
            }

            if (submitName != null) {
                submitName.Dispose ();
                submitName = null;
            }
        }
    }
}