<?php
    include "database.php";

    class Images {

        public static function Upload() {

            $maxsize = 4194304; // set to 4 MB

            // check associated error code
            if ($_FILES['imageToUpload']['error'] == UPLOAD_ERR_OK) {

                // check whether file is uploaded with HTTP POST
                if (is_uploaded_file($_FILES['imageToUpload']['tmp_name'])) {    

                    // check size of uploaded image on server side
                    if ( $_FILES['imageToUpload']['size'] < $maxsize) {  

                        // check whether uploaded file is of image type
                        $finfo = finfo_open(FILEINFO_MIME_TYPE);
                        if (strpos(finfo_file($finfo, $_FILES['imageToUpload']['tmp_name']), "image") === 0) {    

                            // open the image file for insertion
                            $imagefp = fopen($_FILES['imageToUpload']['tmp_name'], 'rb');

                            // put the image in the db...
                            $database = new Database();
                            $id = $database->UploadImage($_FILES['imageToUpload']['name'], $imagefp);
                            header("Location: /");
                            exit;
                        }
                        else { // not an image
                            echo '<script type="text/javascript">';
                            echo 'alert("Uploaded file is not an image");';
                            echo 'window.location.href = "/";';
                            echo '</script>';
                            exit;
                        }
                    }
                    else { // file too large
                        echo '<script type="text/javascript">';
                        echo 'alert("Uploaded file is too large");';
                        echo 'window.location.href = "/";';
                        echo '</script>';
                        exit;
                    }
                }
                else { // upload failed
                    echo '<script type="text/javascript">';
                    echo 'alert("File upload failed");';
                    echo 'window.location.href = "/";';
                    echo '</script>';
                    exit;
                }
            }
            else {
                echo '<script type="text/javascript">';
                echo 'alert("File upload failed");';
                echo 'window.location.href = "/";';
                echo '</script>';
                exit;
            }
        }

        public static function GetImages() {
            $database = new Database();
            $images = $database->GetAllImages();
            return $images;
        }

        public static function GetImage($id) {
            $database = new Database();
            $image = $database->FindImage($id);
            return $image;
        }
    }
?>