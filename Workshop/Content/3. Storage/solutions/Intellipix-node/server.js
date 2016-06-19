var express = require('express');
var multer = require('multer');
var azureStorage = require('azure-storage');
var streamifier = require('streamifier');
var request = require('request');

var portNum = process.env.PORT || 9898;

var app = express();
var storage = multer.memoryStorage();
var uploadImage = multer({ storage: storage }).single('imageFile');

app.post('/api/image-upload', configurationMiddleware, uploadImage, imageHandlerMiddleware);
app.get('/api/images', configurationMiddleware, noCacheMiddleware, listBlobsMiddleware);
app.use('/', express.static('src'));
app.use(errorHandlerMiddleware);

app.listen(portNum, function() {
    console.log("Web application listening on port " + portNum);
});

function configurationMiddleware(req, res, next) {

    var verifyConfigValue = function(keyName) {
        var configValue = process.env[keyName];
        if(!configValue) {
            throw new Error(keyName + " not defined.");
        }
        return configValue;
    };

    req.appConfig = {
        storageAccount: verifyConfigValue("AZURE_STORAGE_ACCOUNT"),
        storageAccountAccessKey: verifyConfigValue("AZURE_STORAGE_ACCESS_KEY"),
        visionApiKey: verifyConfigValue("AZURE_VISION_API_KEY")
    };
    next();
}

function imageHandlerMiddleware(req, res) {

    // Note, all of this work is done in memory!!

    var cfg = req.appConfig;
    var uploadFile = req.file;
    var blobService = azureStorage.createBlobService(cfg.storageAccount, cfg.storageAccountAccessKey);
    var publicUrl = [
        "https://",
        cfg.storageAccount,
        ".blob.core.windows.net/photos/",
        uploadFile.originalname
    ].join('');

    console.log(["Received ", uploadFile.originalname, " (", uploadFile.size, " bytes)"].join(''));
    saveImageToAzure(uploadFile);

    function saveImageToAzure() {
        blobService.createBlockBlobFromStream(
            'photos',
            uploadFile.originalname,
            streamifier.createReadStream(uploadFile.buffer),
            uploadFile.size,
            function(err, result, response) {
                if(err){
                    throw err;
                }
                console.log(["Uploaded ", uploadFile.originalname, " image to 'photos' container on Azure."].join(''));
                console.log(["URL: ", publicUrl].join(''));
                createThumbnailOfImage();
            });
    }

function createThumbnailOfImage(){
    var options = {
        url: "https://api.projectoxford.ai/vision/v1.0/generateThumbnail",
        qs: {
            width: 192,
            height: 128,
            smartCropping: true
        },
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': cfg.visionApiKey
        },
        json: true,
        body: {
            url: publicUrl
        }
    };
    request(options)
        .on('error', function(err) {
            throw err;
        })
        .on('end', function() {
            console.log(["Created ", uploadFile.originalname, " thumbnail."].join(''));
        })
        .pipe(saveThumbnailToAzure());
    }

    function saveThumbnailToAzure() {
        return blobService
            .createWriteStreamToBlockBlob('thumbnails', uploadFile.originalname)
            .on('error', function(err) {
                throw err;
            })
            .on('end', function() {
                console.log(["Uploaded ", uploadFile.originalname, " image to 'thumbnails' container on Azure."].join(''));
                analyzeImage();
            });
    }

    function analyzeImage() {
        var options = {
            url: "https://api.projectoxford.ai/vision/v1.0/analyze",
            qs: {
                visualFeatures: "Description"
            },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': cfg.visionApiKey
            },
            json: true,
            body: {
                url: publicUrl
            }
        };
        request(options, function(err, response, body) {
            if(err) {
                throw err;
            }
            console.log(["Analyzed ", uploadFile.originalname].join(''));
            saveAnalysisResults(body);
        });
    }

    function saveAnalysisResults(result) {
        var metaData = {
            caption: result.description && result.description.captions && result.description.captions.length ?
                result.description.captions[0].text :
                "Unknown",
            tags: result.description && result.description.tags && result.description.tags.length ?
                JSON.stringify(result.description.tags) :
                []
        };

        blobService.setBlobMetadata(
            'photos',
            uploadFile.originalname,
            metaData,
            function(err, result, response) {
                if(err){
                    throw err;
                }
                console.log(["Stored ", uploadFile.originalname, " analysis results to Azure."].join(''));
                res.status(200).send({
                    name: uploadFile.originalname,
                    mimetype: uploadFile.mimetype,
                    result: result
                });
            });
    }
}

function listBlobsMiddleware(req, res) {
    var cfg = req.appConfig;
    var blobService = azureStorage.createBlobService(cfg.storageAccount, cfg.storageAccountAccessKey);
    var options = {
        maxResults: 5000,
        include: "metadata",

    };
    blobService.listBlobsSegmented(
        'photos',
        null,
        options,
        function(err, result, response) {
            if(err) {
                throw err;
            }
            (result.entries || []).forEach(function(entry) {
                entry.url = [
                    "https://",
                    cfg.storageAccount,
                    ".blob.core.windows.net/thumbnails/",
                    entry.name
                ].join("");
                entry.fullUrl = [
                    "https://",
                    cfg.storageAccount,
                    ".blob.core.windows.net/photos/",
                    entry.name
                ].join("");
                entry.metadata = entry.metadata || {};
            });
            res.status(200).json(result);
        }
    )
}

function noCacheMiddleware(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

function errorHandlerMiddleware(err, req, res, next) {
    console.error(err);
    res.status(500).send({
        error: true,
        message: err.toString()
    });
}