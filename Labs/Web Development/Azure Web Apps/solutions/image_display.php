<?php
    if ((isset($_GET['id']) && is_numeric($_GET['id'])) === FALSE) die;

    include "images.php";
    $imageId = $_GET['id'];
    $image = Images::GetImage($imageId);

    // get the source image attributes
    $srcImage = $image->image;
    $srcSize = getImageSizeFromString($srcImage);
    $srcWidth = $srcSize[0];
    $srcHeight = $srcSize[1];
    $srcType = $srcSize[2];
    $srcMime = $srcSize['mime'];
    $srcImageResource = imageCreateFromString($srcImage);

    // set the header for the image
    header("Content-type: ".$srcMime);

    if ((isset($_GET['width']) && is_numeric($_GET['width'])) === FALSE) {
        // no width requested - just return the source
        echo $srcImage;
        exit;
    }

    // resize/resample the image to the requested size
    $destWidth = $_GET['width'];
    $destHeight = $destWidth * $srcSize[1] / $srcSize[0];

    $destImageResource = imageCreateTrueColor($destWidth, $destHeight);
    imagealphablending($destImageResource, false);
    imagesavealpha($destImageResource, true);
    imageCopyResampled($destImageResource, $srcImageResource, 0,0,0,0, $destWidth, $destHeight, $srcWidth, $srcHeight);

    // export the image
    switch ($srcType) {
        case IMAGETYPE_JPEG:
            imageJPEG($destImageResource);
            break;
        case IMAGETYPE_PNG:
            imagePNG($destImageResource);
            break;
        default:
            imageJPEG($destImageResource);
            break;
    }

    imageDestroy($destImageResource);
?>