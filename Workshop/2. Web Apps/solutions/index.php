<!DOCTYPE html>
<html>
<head>
    <title>My Images</title>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" 
        integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" 
        crossorigin="anonymous">
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" 
        integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" 
        crossorigin="anonymous">
    <link rel="stylesheet" href="content/styles.css" type='text/css'>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" 
        integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" 
        crossorigin="anonymous"></script>

</head>
<body>
    <div class="container-fluid bg-primary">
        <div class="row col-md-12">
            <h3>My Images</h3>
        </div>
    </div>

    <div class="navbar navbar-default">
        <form class="navbar-form navbar-left" enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
            <div class="form-group">
                <label class="sr-only" for="imageToUpload">Image to Upload</label>
                <div class="input-group">
                    <span class="input-group-btn">
                        <span class="btn btn-default btn-file" type="button">
                            Image File:<input type="file" id="imageToUpload" name="imageToUpload">
                        </span>
                    </span>
                    <input type="text" class="form-control" placeholder="Select a file to upload..." id="selectedFileName" readonly>
                </div>
            </div>
            <button type="submit" class="btn btn-default navbar-btn">Upload</button>
            <?php
                if (isset($_FILES['imageToUpload'])) {
                    include "images.php";
                    try {
                        $msg = Images::Upload();  // this will upload the image
                        echo "<p class='navbar-text navbar-right'>".$msg."</p>";  // Message showing success or failure.
                        }
                    catch (Exception $e) {
                        echo "<p class='navbar-text navbar-right text-danger'>"."Sorry, could not upload file".$e->getMessage()."</p>";
                    }
                }
            ?>
        </form>
    </div>

    <div class="container-fluid">
        <div class="row">
            <?php
                include "images.php";
                $images = Images::GetImages();
                foreach ($images as $image) {
            ?>
                <div class='col-lg-2 col-md-4 col-sm-6 col-xs-12'>
                    <?php
                        echo "<a href='image_display.php?id=".$image->id."' target='_blank'>";
                        echo "<img class='img-responsive' src='image_display.php?id=".$image->id."&width=192' alt='' />";
                        echo "</a>";
                    ?>
                </div>
            <?php
                }
            ?>
        </div>
    </div>

    <script type="text/javascript" language="javascript">
        // Show name of selected image file in the text display in the custom UI element
        $(document).ready(function () {
            $(document).on('change', '.btn-file :file', function () {
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);
            })

            $('.btn-file :file').on('fileselect', function (event, numFiles, label) {
                console.log(numFiles);
                console.log(label);
                $("#selectedFileName").val(label);
            });
        });
    </script>
</body>
</html>