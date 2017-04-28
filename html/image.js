// TODO: naam
//

var input = document.getElementById('img');
input.onclick = function() {
    this.value = null;
};

input.onchange = function() {
    console.log("img change");
    resizeMax(800, function(dat) {
        console.log(dat);
        document.getElementById("image").src = dat;
        var file = toBlob(dat);
        var stream = ss.createStream();
        ss(socket).emit('file', stream, {
            size: file.size,
            name: file.name
        });
        ss.createBlobReadStream(file).pipe(stream);
    });
};

function toBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

function resizeMax(max, cb) {
    var data;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                if (img.width > max || img.height > max) {
                    var oc = document.createElement('canvas'),
                        octx = oc.getContext('2d');
                    oc.width = img.width;
                    oc.height = img.height;
                    octx.drawImage(img, 0, 0);
                    if (img.width > img.height) {
                        oc.height = (img.height / img.width) * max;
                        oc.width = max;
                    } else {
                        oc.width = (img.width / img.height) * max;
                        oc.height = max;
                    }
                    octx.drawImage(oc, 0, 0, oc.width, oc.height);
                    octx.drawImage(img, 0, 0, oc.width, oc.height);
                    data = oc.toDataURL();
                } else {
                    data = img.src;
                }
                cb(data);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

console.log("hi");

$("#full").hide();

$(document).ready(function() {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function() {
            if($("#full").is(':visible')) {
                $("#cont").show();
                $("#full").hide();
            }
            window.history.pushState(null, "", window.location.href);
        };
});
