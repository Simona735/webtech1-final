var width = window.innerWidth;
var height = window.innerHeight;

function loadImages(sources, callback) {
    var assetDir = '/~xrichterova/Zfinal/assets/mikulas/';
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
        ciapka: {
            x: 380,
            y: 140,
        },
        kabat: {
            x: 305,
            y: 20,
        },
        l_noha: {
            x: 470,
            y: 10,
        },
        l_ruka: {
            x: 340,
            y: 180,
        },
        l_topanka: {
            x: 360,
            y: 310,
        },
        p_noha: {
            x: 300,
            y: 20,
        },
        p_ruka: {
            x: 500,
            y: 250,
        },
        p_topanka: {
            x: 385,
            y: 70,
        },
        tvar: {
            x: 360,
            y: 280,
        },
    };

    var outlines = {
        ciapka_black: {
            x: 60,
            y: 19,
        },
        kabat_black: {
            x: 42,
            y: 36,
        },
        l_noha_black: {
            x: 79,
            y: 322,
        },
        l_ruka_black: {
            x: 0,
            y: 171,
        },
        l_topanka_black: {
            x: 56,
            y: 377,
        },
        p_noha_black: {
            x: 215,
            y: 315,
        },
        p_ruka_black: {
            x: 216,
            y: 0,
        },
        p_topanka_black: {
            x: 221,
            y: 388,
        },
        tvar_black: {
            x: 100,
            y: 61,
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
    ciapka: 'ciapka.png',
    ciapka_black: 'ciapka-black.png',
    kabat: 'kabat.png',
    kabat_black: 'kabat-black.png',
    l_noha: 'l_noha.png',
    l_noha_black: 'l_noha-black.png',
    l_ruka: 'l_ruka.png',
    l_ruka_black: 'l_ruka-black.png',
    l_topanka: 'l_topanka.png',
    l_topanka_black: 'l_topanka-black.png',
    p_noha: 'p_noha.png',
    p_noha_black: 'p_noha-black.png',
    p_ruka: 'p_ruka.png',
    p_ruka_black: 'p_ruka-black.png',
    p_topanka: 'p_topanka.png',
    p_topanka_black: 'p_topanka-black.png',
    tvar: 'tvar.png',
    tvar_black: 'tvar-black.png',
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