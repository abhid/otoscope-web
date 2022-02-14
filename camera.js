$(document).ready(function() {
    'use strict';
    const liveview = $('#scope-liveview')[0];
    const capturelist = $('#capture-list');
    const snap = document.getElementById("snap");
    const errorMsgElement = document.querySelector('span#errorMsg');

    const constraints = {
        // audio: true,
        video: {
            width: 800, height: 600
        }
    };

    // Access webcam
    async function init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e) {
            errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
        }
    }

    // Success
    function handleSuccess(stream) {
        window.stream = stream;
        liveview.srcObject = stream;
    }

    // Load init
    init();

    // Save image
    snap.addEventListener("click", function () {
        let canvas = $('<canvas id="canvas" width="320" height="240"></canvas>')
        var context = canvas[0].getContext('2d');
        context.drawImage(liveview, 0, 0, 320, 240);
        capturelist.append(canvas[0]);
    });
});