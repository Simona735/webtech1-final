var width = window.innerWidth;
var height = window.innerHeight;

function loadImages(sources, callback) {
    var assetDir = '/~xrichterova/Zfinal/assets/olaf/';
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = assetDir + sources[src];
    }
}
function isNearOutline(part, outline) {
    var a = part;
    var o = outline;
    var ax = a.x();
    var ay = a.y();

    if (ax > o.x - 20 && ax < o.x + 20 && ay > o.y - 20 && ay < o.y + 20) {
        return true;
    } else {
        return false;
    }
}
function drawBackground(background, backgroundIMG, text) {
    var context = background.getContext();
    context.drawImage(backgroundIMG, 0, 0);
    context.setAttr('font', '20pt Calibri');
    context.setAttr('textAlign', 'left');
    context.setAttr('fillStyle', 'black');
    context.fillText(text, background.getStage().width() / 2, 40);
}

function initStage(images) {
    var stage = new Konva.Stage({
        container: 'container',
        width: 600,
        height: 450,
    });
    var background = new Konva.Layer();
    var partsLayer = new Konva.Layer();
    var partsShapes = [];
    var score = 0;

    // image positions
    var parts = {
        gombik_1: {
            x: 380,
            y: 140,
        },
        gombik_2: {
            x: 400,
            y: 20,
        },
        gombik_3: {
            x: 350,
            y: 200,
        },
        l_ruka: {
            x: 340,
            y: 180,
        },
        p_ruka: {
            x: 360,
            y: 310,
        },
        tvar: {
            x: 400,
            y: 20,
        },
        usta: {
            x: 325,
            y: 100,
        },
        vlasy: {
            x: 385,
            y: 70,
        },
        telo: {
            x: 355,
            y: 70,
        },
    };

    var outlines = {
        gombik_1_black: {
            x: 115,
            y: 252,
        },
        gombik_2_black: {
            x: 136,
            y: 311,
        },
        gombik_3_black: {
            x: 178,
            y: 331,
        },
        l_ruka_black: {
            x: 4,
            y: 142,
        },
        p_ruka_black: {
            x: 161,
            y: 172,
        },
        tvar_black: {
            x: 147,
            y: 72,
        },
        usta_black: {
            x: 115,
            y: 112,
        },
        vlasy_black: {
            x: 175,
            y: 5,
        },
        telo_black: {
            x: 73,
            y: 64,
        },
    };

    // create draggable parts
    for (var key in parts) {
        // anonymous function to induce scope
        (function () {
            var privKey = key;
            var anim = parts[key];

            var part = new Konva.Image({
                image: images[key],
                x: anim.x,
                y: anim.y,
                draggable: true,
            });

            part.on('dragstart', function () {
                this.moveToTop();
                partsLayer.draw();
            });
            /*
             * check if part is in the right spot and
             * snap into place if it is
             */
            part.on('dragend', function () {
                var outline = outlines[privKey + '_black'];
                if (!part.inRightPlace && isNearOutline(part, outline)) {
                    part.position({
                        x: outline.x,
                        y: outline.y,
                    });
                    partsLayer.draw();
                    part.inRightPlace = true;

                    if (++score >= 9) {
                        end_time = new Date(new Date() - start_time);
                        var text = end_time.getHours() - 1  + ':' + end_time.getMinutes() + ':' + end_time.getSeconds();
                        drawBackground(background, images.pozadie, text);
                    }

                    // disable drag and drop
                    setTimeout(function () {
                        part.draggable(false);
                    }, 50);
                }
            });

            // make pointer cursor
            part.on('mouseover', function () {
                document.body.style.cursor = 'pointer';
            });
            // make default cursor
            part.on('mouseout', function () {
                document.body.style.cursor = 'default';
            });

            part.on('dragmove', function () {
                document.body.style.cursor = 'pointer';
            });

            partsLayer.add(part);
            partsShapes.push(part);
        })();
    }

    // create part outlines
    for (var key in outlines) {
        // anonymous function to induce scope
        (function () {
            var imageObj = images[key];
            var out = outlines[key];

            var outline = new Konva.Image({
                image: imageObj,
                x: out.x,
                y: out.y,
            });

            partsLayer.add(outline);
        })();
    }

    stage.add(background);
    stage.add(partsLayer);

    drawBackground(
        background,
        images.pozadie,
        ''
    );

    $('#exampleModal').on('shown.bs.modal', function (e) {
        generateDemo(images, parts, outlines);
    })

    start_time = new Date();
}

var sources = {
    pozadie: 'white.png',
    gombik_1: '1_gombik.png',
    gombik_1_black: '1_gombik_black.png',
    gombik_2: '2_gombik.png',
    gombik_2_black: '2_gombik_black.png',
    gombik_3: '3_gombik.png',
    gombik_3_black: '3_gombik_black.png',
    l_ruka: 'l_ruka.png',
    l_ruka_black: 'l_ruka_black.png',
    p_ruka: 'p_ruka.png',
    p_ruka_black: 'p_ruka_black.png',
    tvar: 'tvar.png',
    tvar_black: 'tvar_black.png',
    usta: 'usta.png',
    usta_black: 'usta_black.png',
    vlasy: 'vlasy.png',
    vlasy_black: 'vlasy_black.png',
    telo: 'telo.png',
    telo_black: 'telo_black.png',
};
loadImages(sources, initStage);

function generateDemo(images, parts, outlines) {
    let modal_demo = $('#modal_demo');
    if (modal_demo.width() > 600)
        modal_demo.width(600);

    modal_demo.empty().append('<img src="' + images.pozadie.src + '" width="' + modal_demo.width() + '" alt="demo">');

    let scale = modal_demo.width() / 600;

    let demo_parts = {};
    let demo_parts_index = 0;
    $.each(parts, function(key, value) {
        demo_parts[demo_parts_index] = $('<img id="' + demo_parts_index + '" src="' + images[key].src + '" alt="demo" class="demo_images_parts" style="top:'+ value.y * scale +'px; left:'+ value.x * scale +'px;">');
        modal_demo.append(demo_parts[demo_parts_index]);
        $('#' + demo_parts_index).width($('#' + demo_parts_index).width() * scale);
        demo_parts_index++;
    });

    demo_parts_index = 0;
    setTimeout(function(){
        $.each(outlines, function(key, value) {
            $(demo_parts[demo_parts_index++]).animate({top: (value.y * scale + "px"), left: (value.x * scale + "px")}, 2000);
        });

    }, 1000);
}