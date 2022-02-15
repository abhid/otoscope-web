$(document).ready(function () {
    'use strict';
    const liveview = $('#scope-liveview')[0];
    const capturelist = $('#capture-list');
    const captureBtn = $("#scope-capture");
    const errorMsgElement = document.querySelector('span#errorMsg');
    const scopeSelect = $("#scope-select");
    let currentDevice = '';
    let currentStream;

    const constraints = {
        video: {
            width: 800, height: 600
        }
    };

    async function init() {
        try {
            updateCameraList();
            syncCurrentStream();
        } catch (e) {
            errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
        }
    }

    function updateCameraList() {
        // Update camera list
        navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
            scopeSelect[0].innerHTML = '';
            scopeSelect[0].appendChild(document.createElement('option'));
            let count = 1;
            mediaDevices.forEach(mediaDevice => {
                if (mediaDevice.kind === 'videoinput') {
                    const option = document.createElement('option');
                    option.value = mediaDevice.deviceId;
                    const label = mediaDevice.label || `Camera ${count++}`;
                    const textNode = document.createTextNode(label);
                    option.appendChild(textNode);
                    scopeSelect[0].appendChild(option);
                }
            });
        });
    }

    function stopMediaTracks(stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    async function syncCurrentStream() {
        if (typeof currentStream !== 'undefined') {
            stopMediaTracks(currentStream);
        }
        // Update the current device and stream
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        liveview.srcObject = currentStream;
    }

    function downloadCanvas(canvas) {
        // get canvas data
        var image = canvas.toDataURL();
    
        // create temporary link
        var tmpLink = document.createElement('a');
        tmpLink.download = new Date("2015-03-25").toISOString().split("T")[0] + '-scope-' + $("canvas").toArray().indexOf(canvas) +  '.jpg';
        tmpLink.href = image;
    
        // temporarily add link to body and initiate the download
        document.body.appendChild(tmpLink);
        tmpLink.click();
        document.body.removeChild(tmpLink);
    }

    // Evt listensers
    // Save image
    captureBtn.on("click", function () {
        let canvas = $('<canvas id="canvas" width="320" height="240"></canvas>')
        var context = canvas[0].getContext('2d');
        context.drawImage(liveview, 0, 0, 320, 240);
        let dom_obj = $("<div class='col-6 captures'>").html(canvas).append('<br /><button class="dl-img btn btn-light btn-sm"><i class="fa-solid fa-download"></i></button>');
        capturelist.append(dom_obj);
    });

    scopeSelect.on("change", function () {
        if (scopeSelect.value !== '') {
            constraints.video.deviceId = { exact: scopeSelect[0].value };
        }

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
                currentStream = stream;
                liveview.srcObject = stream;
                return navigator.mediaDevices.enumerateDevices();
            })
            .then(syncCurrentStream)
            .catch(error => {
                console.error(error);
            });
    });

    capturelist.on('click', function (evt) {
        if ($(evt.target).hasClass("fa-download")) {
            let curCanvas = $($(evt.target).parents(".col-6")[0]).children("canvas")[0];
            downloadCanvas(curCanvas);
        }
    });

    $("#capture-clear").on('click', evt => {
        capturelist.children(".captures").remove();
    });

    init();

    // Enable popovers
    new bootstrap.Popover($('[data-bs-toggle="popover"]'))
});