var width = window.innerWidth;
var height = window.innerHeight;
var container_scale = 1;

function loadImages(sources, callback) {
    var assetDir = '/~xrichterova/Zfinal/assets/anjel/';
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
    context.drawImage(backgroundIMG, 0, 0, background.getStage().width(), background.getStage().height());
    context.setAttr('font', '20pt Calibri');
    context.setAttr('textAlign', 'left');
    context.setAttr('fillStyle', 'black');
    context.fillText(text, background.getStage().width() / 2, 40);
}

function initStage(images) {
    let start_time;

    let container_canva = $('#container');
    container_canva.empty();

    if (container_canva.width() < 600)
        container_scale = container_canva.width() / 600;

    var stage = new Konva.Stage({
        container: 'container',
        width: 600 * container_scale,
        height: 450 * container_scale,
    });
    var background = new Konva.Layer();
    var partsLayer = new Konva.Layer();
    var partsShapes = [];
    var score = 0;

    // image positions
    var parts = {
        hviezdaL: {
            x: 380,
            y: 140,
        },
        hviezdaPD: {
            x: 400,
            y: 20,
        },
        kridlo: {
            x: 350,
            y: 200,
        },
        l_noha: {
            x: 340,
            y: 180,
        },
        p_noha: {
            x: 360,
            y: 310,
        },
        ruka: {
            x: 400,
            y: 20,
        },
        saty: {
            x: 325,
            y: 100,
        },
        tvar: {
            x: 385,
            y: 70,
        },
        vlasy: {
            x: 360,
            y: 280,
        },
        hviezdaPH: {
            x: 350,
            y: 2,
        },
    };

    $.each(parts, function(key, value) {
        value.x =  value.x * container_scale;
        value.y =  value.y * container_scale;
    });

    var outlines = {
        hviezdaL_black: {
            x: 36,
            y: 154,
        },
        hviezdaPD_black: {
            x: 253,
            y: 325,
        },
        kridlo_black: {
            x: 18,
            y: 19,
        },
        l_noha_black: {
            x: 17,
            y: 281,
        },
        p_noha_black: {
            x: 52,
            y: 344,
        },
        ruka_black: {
            x: 302,
            y: 136,
        },
        saty_black: {
            x: 30,
            y: 117,
        },
        tvar_black: {
            x: 187,
            y: 38,
        },
        vlasy_black: {
            x: 127,
            y: 2,
        },
        hviezdaPH_black: {
            x: 263,
            y: 67,
        },
    };

    $.each(outlines, function(key, value) {
        value.x =  value.x * container_scale;
        value.y =  value.y * container_scale;
    });

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
            part.setAttrs({
                width: part.width() * container_scale,
                height: part.height() * container_scale,
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

                    if (++score >= 10) {
                        end_time = new Date(new Date() - start_time);
                        var text = end_time.getHours() - 1  + ':' + end_time.getMinutes() + ':' + end_time.getSeconds() + '.' + end_time.getMilliseconds();
                        $('#end_game').modal('show');
                        $('#game_time').text(text);
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
            outline.setAttrs({
                width: outline.width() * container_scale,
                height: outline.height() * container_scale,
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
    vlasy: 'vlasy.png',
    vlasy_black: 'vlasy_black.png',
    tvar: 'tvar.png',
    tvar_black: 'tvar_black.png',
    saty: 'saty.png',
    saty_black: 'saty_black.png',
    ruka: 'ruka.png',
    ruka_black: 'ruka_black.png',
    p_noha: 'p_noha.png',
    p_noha_black: 'p_noha_black.png',
    l_noha: 'l_noha.png',
    l_noha_black: 'l_noha_black.png',
    kridlo: 'kridlo.png',
    kridlo_black: 'kridlo_black.png',
    hviezdaPD: 'hviezdaPD.png',
    hviezdaPD_black: 'hviezdaPD_black.png',
    hviezdaL: 'hviezdaL.png',
    hviezdaL_black: 'hviezdaL_black.png',
    hviezdaPH: 'hviezdaPH.png',
    hviezdaPH_black: 'hviezdaPH_black.png',
};

function generateDemo(images, parts, outlines) {
    let modal_demo = $('#modal_demo');
    if (modal_demo.width() > 600)
        modal_demo.width(600);

    modal_demo.empty().append('<img src="' + images.pozadie.src + '" width="' + modal_demo.width() + '" alt="demo">');

    let scale = Math.pow(container_scale, -1) * (modal_demo.width() / 600);

    let demo_parts = {};
    let demo_parts_index = 0;
    $.each(parts, function(key, value) {
        demo_parts[demo_parts_index] = $('<img id="' + demo_parts_index + '" src="' + images[key].src + '" alt="demo" class="demo_images_parts" style="top:'+ value.y * scale +'px; left:'+ value.x * scale +'px;">');
        modal_demo.append(demo_parts[demo_parts_index]);
        $('#' + demo_parts_index).width($('#' + demo_parts_index).width() * modal_demo.width() / 600);
        demo_parts_index++;
    });

    demo_parts_index = 0;
    setTimeout(function(){
        $.each(outlines, function(key, value) {
            console.log(value);
            $(demo_parts[demo_parts_index++]).animate({top: (value.y * scale + "px"), left: (value.x * scale + "px")}, 2000);
        });

    }, 1000);
}

$(document).ready(function() {
    loadImages(sources, initStage);

    $(window).resize(function() {
        loadImages(sources, initStage);
    });
});
