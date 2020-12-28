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
    context.setAttr('textAlign', 'center');
    context.setAttr('fillStyle', 'white');
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
            x: 300,
            y: 70,
        },
        kabat: {
            x: 300,
            y: 70,
        },
        l_noha: {
            x: 300,
            y: 70,
        },
        l_ruka: {
            x: 300,
            y: 70,
        },
        l_topanka: {
            x: 300,
            y: 70,
        },
        p_noha: {
            x: 300,
            y: 70,
        },
        p_ruka: {
            x: 300,
            y: 70,
        },
        p_topanka: {
            x: 300,
            y: 70,
        },
        tvar: {
            x: 300,
            y: 70,
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

                    if (++score >= 10) {
                        var text = 'You win! Enjoy your booty!';
                        drawBackground(background, images.beach, text);
                    }

                    // disable drag and drop
                    setTimeout(function () {
                        part.draggable(false);
                    }, 50);
                }
            });

            // make part glow on mouseover
            part.on('mouseover', function () {
                part.image(images[privKey + '_glow']);
                partsLayer.draw();
                document.body.style.cursor = 'pointer';
            });
            // return part on mouseout
            part.on('mouseout', function () {
                part.image(images[privKey]);
                partsLayer.draw();
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
}

var sources = {
    pozadie: 'white.png',
    ciapka: 'ciapka.png',
    ciapka_black: 'ciapka-black.png',
    ciapka_glow: 'ciapka-glow.png',
    kabat: 'kabat.png',
    kabat_black: 'kabat-black.png',
    kabat_glow: 'kabat-glow.png',
    l_noha: 'l_noha.png',
    l_noha_black: 'l_noha-black.png',
    l_noha_glow: 'l_noha-glow.png',
    l_ruka: 'l_ruka.png',
    l_ruka_black: 'l_ruka-black.png',
    l_ruka_glow: 'l_ruka-glow.png',
    l_topanka: 'l_topanka.png',
    l_topanka_black: 'l_topanka-black.png',
    l_topanka_glow: 'l_topanka-glow.png',
    p_noha: 'p_noha.png',
    p_noha_black: 'p_noha-black.png',
    p_noha_glow: 'p_noha-glow.png',
    p_ruka: 'p_ruka.png',
    p_ruka_black: 'p_ruka-black.png',
    p_ruka_glow: 'p_ruka-glow.png',
    p_topanka: 'p_topanka.png',
    p_topanka_black: 'p_topanka-black.png',
    p_topanka_glow: 'p_topanka-glow.png',
    tvar: 'tvar.png',
    tvar_black: 'tvar-black.png',
    tvar_glow: 'tvar-glow.png',
};
loadImages(sources, initStage);