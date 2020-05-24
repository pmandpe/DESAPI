function scanToPdfWithThumbnails() {
    scanner.scan(displayImagesOnPage,
            {
                "output_settings": [
                    {
                        "type": "return-base64",
                        "format": "pdf",
                        "pdf_text_line": "By ${USERNAME} on ${DATETIME}",
                        "upload_target": {
                            "headers": [ 
                                "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU0NBTk5FUiIsInVzZXJuYW1lIjoic2Nhbm5lciIsImlhdCI6MTU3OTY3MDY1Nn0.3PNLoTh86k9LkQLV8K2qVlrXB27pH2jbmNG555zYiN8"
                            ]
                        }
                    },
                    {
                        "type": "return-base64-thumbnail",
                        "format": "jpg",
                        "thumbnail_height": 200
                    }
                ]
                   
            }
    );
}

/** Processes the scan result */
function displayImagesOnPage(successful, mesg, response) {
    if(!successful) { // On error
        console.error('Failed: ' + mesg);
        return;
    }

    if(successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
        console.info('User cancelled');
        return;
    }

    var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
    for(var i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
        var scannedImage = scannedImages[i];
        processOriginal(scannedImage);
    }

    var thumbnails = scanner.getScannedImages(response, false, true); // returns an array of ScannedImage
    for(var i = 0; (thumbnails instanceof Array) && i < thumbnails.length; i++) {
        var thumbnail = thumbnails[i];
        processThumbnail(thumbnail);
    }
}

/** Images scanned so far. */
var imagesScanned = [];

/** Processes an original */
function processOriginal(scannedImage) {
    imagesScanned.push(scannedImage);
}

/** Processes a thumbnail */
function processThumbnail(scannedImage) {
    var elementImg = scanner.createDomElementFromModel( {
        'name': 'img',
        'attributes': {
            'class': 'scanned',
            'src': scannedImage.src
        }
    });
    document.getElementById('images').appendChild(elementImg);
}

/** Upload scanned images by submitting the form */
function submitFormWithScannedImages() {

    
    

    if (scanner.submitFormWithImages('uploadForm', imagesScanned, function (xhr) {
        if (xhr.readyState == 4) { // 4: request finished and response is ready
            document.getElementById('server_response').innerHTML = "<h2>Response from the server: </h2>" + xhr.responseText;
            document.getElementById('images').innerHTML = ''; // clear images
            imagesScanned = [];
        }
    })) {
        document.getElementById('server_response').innerHTML = "Submitting, please stand by ...";
    } else {
        document.getElementById('server_response').innerHTML = "Form submission cancelled. Please scan first.";
    }
}
