using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Devices.Input;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI;
using Windows.UI.Core;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Windows.UI.Xaml.Shapes;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace MLClient
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private const double _margin = 2.0;  // Margin around each cell
        private const double _opacity = 0.2; // Opacity of empty cells
        private Rectangle _last;

        public MainPage()
        {
            this.InitializeComponent();

            // Add rows and columns to the Grid
            for (int i = 0; i < 8; i++)
                Cells.ColumnDefinitions.Add(new ColumnDefinition());

            for (int j = 0; j < 8; j++)
                Cells.RowDefinitions.Add(new RowDefinition());

            // Fill the Grid with Rectangles
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    var cell = new Rectangle();
                    cell.Fill = new SolidColorBrush(Colors.Blue);
                    cell.Opacity = _opacity;
                    cell.Margin = new Thickness(_margin);
                    cell.SetValue(Grid.RowProperty, row);
                    cell.SetValue(Grid.ColumnProperty, col);
                    cell.PointerPressed += OnCellPressed;
                    cell.PointerEntered += OnCellEntered;
                    Cells.Children.Add(cell);
                }
            }
        }

        private void OnCellPressed(object sender, PointerRoutedEventArgs e)
        {
            if (e.Pointer.PointerDeviceType == PointerDeviceType.Mouse)
            {
                var point = e.GetCurrentPoint(null);

                if (point.Properties.IsLeftButtonPressed)
                {
                    var cell = (Rectangle)sender;
                    ToggleCell(cell); // Toggle the cell (left mouse button only)
                    _last = cell;
                }
            }
        }

        private void OnCellEntered(object sender, PointerRoutedEventArgs e)
        {
            var cell = (Rectangle)sender;

            if (e.Pointer.PointerDeviceType == PointerDeviceType.Mouse)
            {
                var point = e.GetCurrentPoint(null);

                if (!point.Properties.IsLeftButtonPressed)
                    return; // Ignore if it's a mouse but not the left button

                if (cell == _last)
                {
                    _last = null;
                    return; // Ignore if it's a mouse but the cell was toggled in OnCellPressed
                }
            }

            ToggleCell(cell);
        }

        private void ToggleCell(Rectangle cell)
        {
            cell.Opacity = (cell.Opacity < 1.0) ? 1.0 : _opacity;
        }

        private async void OnSubmit(object sender, RoutedEventArgs e)
        {
            // Package up the data
            string[] values = new string[65];

            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    int index = (row * 8) + col;
                    values[index] = ((Rectangle)Cells.Children[index]).Opacity == 1.0 ? "16" : "0";
                }
            }

            values[64] = "0"; // digit parameter

            try
            {
                // Call the ML service
                await MLSubmitAsync(values);
            }
            catch(Exception ex)
            {
                // Let the user know if something went wrong
                var dialog = new MessageDialog(ex.Message);
                await dialog.ShowAsync();
            }
        }

        private void OnClear(object sender, RoutedEventArgs e)
        {
            for (int i = 0; i < 64; i++)
                ((Rectangle)Cells.Children[i]).Opacity = _opacity;
        }

        private async Task MLSubmitAsync(string[] v)
        {
            using (var client = new HttpClient())
            {
                var request = new
                {
                    Inputs = new Dictionary<string, StringTable>()
                    {
                        {
                            "input1",
                            new StringTable()
                            {
                                ColumnNames = new string[]
                                {
                                    "p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08",
                                    "p09", "p10", "p11", "p12", "p13", "p14", "p15", "p16",
                                    "p17", "p18", "p19", "p20", "p21", "p22", "p23", "p24",
                                    "p25", "p26", "p27", "p28", "p29", "p30", "p31", "p32",
                                    "p33", "p34", "p35", "p36", "p37", "p38", "p39", "p40",
                                    "p41", "p42", "p43", "p44", "p45", "p46", "p47", "p48",
                                    "p49", "p50", "p51", "p52", "p53", "p54", "p55", "p56",
                                    "p57", "p58", "p59", "p60", "p61", "p62", "p63", "p64",
                                    "digit"
                                },
                                Values = new string[,]
                                {
                                    {
                                        v[0],  v[1],  v[2],  v[3],  v[4],  v[5],  v[6],  v[7],
                                        v[8],  v[9],  v[10], v[11], v[12], v[13], v[14], v[15],
                                        v[16], v[17], v[18], v[19], v[20], v[21], v[23], v[23],
                                        v[24], v[25], v[26], v[27], v[28], v[29], v[30], v[31],
                                        v[32], v[33], v[34], v[35], v[36], v[37], v[38], v[39],
                                        v[40], v[41], v[42], v[43], v[44], v[45], v[46], v[47],
                                        v[48], v[49], v[50], v[51], v[52], v[53], v[54], v[55],
                                        v[56], v[57], v[58], v[59], v[60], v[61], v[62], v[63],
                                        v[64]
                                    }
                                }
                            }
                        },
                    },
                    GlobalParameters = new Dictionary<string, string>() { }
                };

                const string key = "api_key";
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);
                client.BaseAddress = new Uri("web_service_url");

                HttpResponseMessage response = await client.PostAsJsonAsync("", request).ConfigureAwait(false);

                // Resumes on background thread, so marshal to the UI thread
                await this.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, async () =>
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string json = await response.Content.ReadAsStringAsync();
                        dynamic result = JsonConvert.DeserializeObject<dynamic>(json);
                        var digit = result.Results.output1.value.Values[0][75];
                        var dialog = new MessageDialog(String.Format("Azure ML says you entered a {0}", digit));
                        await dialog.ShowAsync();
                    }
                    else
                    {
                        var dialog = new MessageDialog(String.Format("The request failed with status code: {0}", response.StatusCode));
                        await dialog.ShowAsync();
                    }
                });
            }
        }
    }
}
