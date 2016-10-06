<?php
    include "database.php";

    class Images {

        public static function Upload() {

            $maxsize = 10000000; // set to approx 10 MB

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
                            $msg = 'Image successfully saved in database with id = ' . $id;
                        }
                        else { 
                            $msg = "Uploaded file is not an image.";
                        }
                    }
                    else {
                        // if the file is not less than the maximum allowed, print an error
                        $msg = '<div>File exceeds the Maximum File limit</div>
                            <div>Maximum File limit is '.$maxsize.' bytes</div>
                            <div>File '.$_FILES['imageToUpload']['name'].' is '.$_FILES['imageToUpload']['size'].
                            ' bytes</div><hr />';
                    }
                }
                else
                    $msg = "File not uploaded successfully.";

            }
            else {
                $msg = file_upload_error_message($_FILES['imageToUpload']['error']);
            }
            return $msg;
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