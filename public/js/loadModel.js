var scene = new xeogl.Scene({
    transparent: true
});

xeogl.setDefaultScene(scene);

//---------------------------------------------------
// Load the model
//---------------------------------------------------

var model = new xeogl.GLTFModel({
    id: "hopson",
    src: "/static/models/hopson.gltf",
    scale: [.001, .001, .001],
    edgeThreshold: 20,
});

var cameraGroup = new xeogl.GLTFModel({
    id: "cameraGroup",
    src: "/static/models/camera.gltf",
    scale: [.001, .001, .001],
    edgeThreshold: 20,
    handleNode: (function(nodeInfo, actions) {
        var objectCount = 0;
        return function (nodeInfo, actions) {
            console.log(nodeInfo);
            if (nodeInfo.mesh !== undefined) { // Node has a mesh

                actions.createObject = {
                    id: nodeInfo.name,
                };
            }
            return true;
        };
    })()
});
//-----------------------------------------------------------------------------------------------------
// Camera
//-----------------------------------------------------------------------------------------------------

var camera = scene.camera;

camera.eye = [-180.21798706054688, 248.6997528076172, -262.179931640625];
camera.look = [-79.57421875, -23.087656021118164, 2.36319637298584];
camera.up = [0.24628230929374695, 0.7213045954704285, 0.6473535299301147];




var cameraControl = new xeogl.CameraControl({
    doublePickFlyTo: false
});

var cameraFlight = new xeogl.CameraFlightAnimation();

//hover event
cameraControl.on("hoverEnter", function (hit) {
    for (var object = hit.mesh; object.parent; object = object.parent) {
        object.aabbVisible = true;
    }
});

cameraControl.on("hoverOut", function (hit) {
    for (var object = hit.mesh; object.parent; object = object.parent) {
        object.aabbVisible = false;
    }
});



cameraControl.on("pickedNothing", function (hit) {
    cameraFlight.flyTo(model);
});

scene.highlightMaterial.fillAlpha = 0.6;
scene.highlightMaterial.edgeAlpha = 0.6;
scene.highlightMaterial.edgeColor = [0, 0, 0];
scene.highlightMaterial.edgeWidth = 2;




//-----------------------model.on-------------------------------------


cameraGroup.on("loaded", function () {
    scene.on("tick", function () { // Slowly orbit the camera

    });
    // cameraGroup.objects["camera.1"].highlighted = true;
    // console.log(cameraGroup.children);
    // console.log(cameraGroup.objects['camera.1']);
});

model.on("loaded", function () {
    scene.on("tick", function () { // Slowly orbit the camera

    });
    // model.objects["gearbox.1"].highlighted = true;
    // console.log(model.objects);
});

model.on("loaded", function () {

    model.ghosted = false;

    var selectedMeshes = [
        "camera#285.0",
        "camera#291.0",
        "camera#57.0"
    ];

    var Menu = function () {

        var ghostMaterial = scene.ghostMaterial;
        var highlightMaterial = scene.highlightMaterial;

        this["ghosted"] = true;
        this["ghostMaterial.preset"] = "defaultDarkBG";
        this["ghostMaterial.edges"] = ghostMaterial.edges;
        this["ghostMaterial.fill"] = ghostMaterial.fill;
        this["ghostMaterial.vertices"] = ghostMaterial.vertices;
        this["ghostMaterial.edgeColor"] = typedToJS(ghostMaterial.edgeColor);
        this["ghostMaterial.edgeAlpha"] = ghostMaterial.edgeAlpha;
        this["ghostMaterial.edgeWidth"] = ghostMaterial.edgeWidth;
        this["ghostMaterial.vertexColor"] = typedToJS(ghostMaterial.vertexColor);
        this["ghostMaterial.vertexAlpha"] = ghostMaterial.vertexAlpha;
        this["ghostMaterial.vertexSize"] = ghostMaterial.vertexSize;
        this["ghostMaterial.fillColor"] = typedToJS(ghostMaterial.fillColor);
        this["ghostMaterial.fillAlpha"] = ghostMaterial.fillAlpha;

        this["highlighted"] = true;
        this["highlightMaterial.preset"] = "yellowHighlight";
        this["highlightMaterial.edges"] = highlightMaterial.edges;
        this["highlightMaterial.fill"] = highlightMaterial.fill;
        this["highlightMaterial.vertices"] = highlightMaterial.vertices;
        this["highlightMaterial.edgeColor"] = typedToJS(highlightMaterial.edgeColor);
        this["highlightMaterial.edgeAlpha"] = highlightMaterial.edgeAlpha;
        this["highlightMaterial.edgeWidth"] = highlightMaterial.edgeWidth;
        this["highlightMaterial.vertexColor"] = typedToJS(highlightMaterial.vertexColor);
        this["highlightMaterial.vertexAlpha"] = highlightMaterial.vertexAlpha;
        this["highlightMaterial.vertexSize"] = highlightMaterial.vertexSize;
        this["highlightMaterial.fillColor"] = typedToJS(highlightMaterial.fillColor);
        this["highlightMaterial.fillAlpha"] = highlightMaterial.fillAlpha;

        this["scene.gammaOutput"] = model.scene.gammaOutput;
        this["scene.gammaFactor"] = model.scene.gammaFactor;

        var self = this;

        var lastGhostMaterialPreset;
        var lastHighlightMaterialPreset;

        var update = function () {

            model.ghosted = !!self["ghosted"];

            var preset = self["ghostMaterial.preset"];
            if (lastGhostMaterialPreset !== preset) {
                ghostMaterial.preset = preset;
                lastGhostMaterialPreset = preset;
                self["ghostMaterial.edges"] = ghostMaterial.edges;
                self["ghostMaterial.fill"] = ghostMaterial.fill;
                self["ghostMaterial.vertices"] = ghostMaterial.vertices;
                self["ghostMaterial.edgeColor"] = typedToJS(ghostMaterial.edgeColor);
                self["ghostMaterial.edgeAlpha"] = ghostMaterial.edgeAlpha;
                self["ghostMaterial.edgeWidth"] = ghostMaterial.edgeWidth;
                self["ghostMaterial.vertexColor"] = typedToJS(ghostMaterial.vertexColor);
                self["ghostMaterial.vertexAlpha"] = ghostMaterial.vertexAlpha;
                self["ghostMaterial.vertexSize"] = ghostMaterial.vertexSize;
                self["ghostMaterial.fillColor"] = typedToJS(ghostMaterial.fillColor);
                self["ghostMaterial.fillAlpha"] = ghostMaterial.fillAlpha;
            } else {
                ghostMaterial.vertices = !!self["ghostMaterial.vertices"];
                ghostMaterial.edges = !!self["ghostMaterial.edges"];
                ghostMaterial.fill = !!self["ghostMaterial.fill"];
                ghostMaterial.edgeColor = JSToTyped(self["ghostMaterial.edgeColor"]);
                ghostMaterial.edgeAlpha = self["ghostMaterial.edgeAlpha"];
                ghostMaterial.edgeWidth = self["ghostMaterial.edgeWidth"];
                ghostMaterial.vertexColor = JSToTyped(self["ghostMaterial.vertexColor"]);
                ghostMaterial.vertexAlpha = self["ghostMaterial.vertexAlpha"];
                ghostMaterial.vertexSize = self["ghostMaterial.vertexSize"];
                ghostMaterial.fillColor = JSToTyped(self["ghostMaterial.fillColor"]);
                ghostMaterial.fillAlpha = self["ghostMaterial.fillAlpha"];
            }

            preset = self["highlightMaterial.preset"];

            if (lastHighlightMaterialPreset !== preset) {
                highlightMaterial.preset = preset;
                lastHighlightMaterialPreset = preset;
                self["highlightMaterial.edges"] = highlightMaterial.edges;
                self["highlightMaterial.fill"] = highlightMaterial.fill;
                self["highlightMaterial.vertices"] = highlightMaterial.vertices;
                self["highlightMaterial.edgeColor"] = typedToJS(highlightMaterial.edgeColor);
                self["highlightMaterial.edgeAlpha"] = highlightMaterial.edgeAlpha;
                self["highlightMaterial.edgeWidth"] = highlightMaterial.edgeWidth;
                self["highlightMaterial.vertexColor"] = typedToJS(highlightMaterial.vertexColor);
                self["highlightMaterial.vertexAlpha"] = highlightMaterial.vertexAlpha;
                self["highlightMaterial.vertexSize"] = highlightMaterial.vertexSize;
                self["highlightMaterial.fillColor"] = typedToJS(highlightMaterial.fillColor);
                self["highlightMaterial.fillAlpha"] = highlightMaterial.fillAlpha;
            } else {
                highlightMaterial.vertices = !!self["highlightMaterial.vertices"];
                highlightMaterial.edges = !!self["highlightMaterial.edges"];
                highlightMaterial.fill = !!self["highlightMaterial.fill"];
                highlightMaterial.edgeColor = JSToTyped(self["highlightMaterial.edgeColor"]);
                highlightMaterial.edgeAlpha = self["highlightMaterial.edgeAlpha"];
                highlightMaterial.edgeWidth = self["highlightMaterial.edgeWidth"];
                highlightMaterial.vertexColor = JSToTyped(self["highlightMaterial.vertexColor"]);
                highlightMaterial.vertexAlpha = self["highlightMaterial.vertexAlpha"];
                highlightMaterial.vertexSize = self["highlightMaterial.vertexSize"];
                highlightMaterial.fillColor = JSToTyped(self["highlightMaterial.fillColor"]);
                highlightMaterial.fillAlpha = self["highlightMaterial.fillAlpha"];
            }

            var highlighted = !!self["highlighted"];

            for (var i = 0; i < selectedMeshes.length; i++) {
                var id = selectedMeshes[i];
                var mesh = model.meshes[id];
                if (mesh) {
                    mesh.highlighted = highlighted;
                    mesh.ghosted = false;
                }
            }

            model.scene.gammaOutput = self["scene.gammaOutput"];
            model.scene.gammaFactor = self["scene.gammaFactor"];

            requestAnimationFrame(update);
        };

        update();
    };

    var gui = new dat.GUI({autoPlace: false, top: 0, width: 400});

    // document.getElementById('dat-gui-container').appendChild(gui.domElement);

    var menu = new Menu();

    var ghostFolder = gui.addFolder('scene.ghostMaterial');
    ghostFolder.add(menu, 'ghosted', true);
    ghostFolder.add(menu, 'ghostMaterial.preset', Object.keys(xeogl.EmphasisMaterial.presets));
    ghostFolder.add(menu, 'ghostMaterial.edges', true).listen();
    ghostFolder.addColor(menu, 'ghostMaterial.edgeColor', [255, 255, 255]).listen();
    ghostFolder.add(menu, 'ghostMaterial.edgeAlpha', 0.0, 1.0).listen();
    ghostFolder.add(menu, 'ghostMaterial.edgeWidth', 1, 10).listen();
    ghostFolder.add(menu, 'ghostMaterial.vertices', true).listen();
    ghostFolder.addColor(menu, 'ghostMaterial.vertexColor', [255, 255, 255]).listen();
    ghostFolder.add(menu, 'ghostMaterial.vertexAlpha', 0.0, 1.0).listen();
    ghostFolder.add(menu, 'ghostMaterial.vertexSize', 1, 10).listen();
    ghostFolder.add(menu, 'ghostMaterial.fill', true).listen();
    ghostFolder.addColor(menu, 'ghostMaterial.fillColor', [255, 255, 255]).listen();
    ghostFolder.add(menu, 'ghostMaterial.fillAlpha', 0.0, 1.0).listen();
    ghostFolder.open();

    var highlightFolder = gui.addFolder('scene.highlighted');
    highlightFolder.add(menu, 'highlighted', true);
    highlightFolder.add(menu, 'highlightMaterial.preset', Object.keys(xeogl.EmphasisMaterial.presets));
    highlightFolder.add(menu, 'highlightMaterial.edges', true).listen();
    highlightFolder.addColor(menu, 'highlightMaterial.edgeColor', [255, 255, 255]).listen();
    highlightFolder.add(menu, 'highlightMaterial.edgeAlpha', 0.0, 1.0).listen();
    highlightFolder.add(menu, 'highlightMaterial.edgeWidth', 1, 10).listen();
    highlightFolder.add(menu, 'highlightMaterial.vertices', true).listen();
    highlightFolder.addColor(menu, 'highlightMaterial.vertexColor', [255, 255, 255]).listen();
    highlightFolder.add(menu, 'highlightMaterial.vertexAlpha', 0.0, 1.0).listen();
    highlightFolder.add(menu, 'highlightMaterial.vertexSize', 1, 10).listen();
    highlightFolder.add(menu, 'highlightMaterial.fill', true).listen();
    highlightFolder.addColor(menu, 'highlightMaterial.fillColor', [255, 255, 255]).listen();
    highlightFolder.add(menu, 'highlightMaterial.fillAlpha', 0.0, 1.0).listen();
    highlightFolder.open();

    var gammaFolder = gui.addFolder('gamma');
    gammaFolder.add(menu, 'scene.gammaOutput', true).listen();
    gammaFolder.add(menu, 'scene.gammaFactor', 0.0, 3.0).listen();
    gammaFolder.open();

    function typedToJS(arry) {
        return [arry[0] * 255, arry[1] * 255, arry[2] * 255];
    }

    function JSToTyped(arry) {
        return [arry[0] / 255, arry[1] / 255, arry[2] / 255];
    }
});

//-----------------------interactivity-------------------------------------

cameraControl.on("picked", function (hit) {
    cameraFlight.flyTo(hit.mesh);
    path = '/static/screenshot/' + hit.mesh.id + '.png'

    var img = document.createElement('img');
    var canvas = document.querySelector('body');
    img.setAttribute('id', hit.mesh.id);
    img.setAttribute('class', 'camera');
    img.setAttribute('height', '100');
    img.setAttribute('src', path);
    canvas.appendChild(img);
    // img.addEventListener('click', function(event){
    //     window.location.href = '/static/screenshot/J03.png';
    // })


    // new xeogl.AnnotationStory({
    //     speaking: false, // Set true to have a voice announce each annotation
    //     authoring: true, // Set true to author the annotations
    //     text: [
    //         "# [Stories](../docs/classes/AnnotationStory.html) : Tron Tank Program",
    //         "This is a Light Tank from the 1982 Disney movie *Tron*.",
    //         "The [orange tracks](focusAnnotation(0)) on this tank indicate that ....",
    //         "![](./images/Clu_Program.png)",
    //         "The [cannon](focusAnnotation(1)) is the tank's main armament, which  ....",
    //         "The [pilot hatch](focusAnnotation(2)) is where Clu enters and exits the tank.",
    //         "At the back of the tank is the [antenna](focusAnnotation(3)) through ....",
    //         "*\"I fight for the users!\" -- Clu*"
    //     ],
    //     annotations: [
    //         {
    //             primIndex: 204,
    //             bary: [0.05, 0.16, 0.79],
    //             occludable: true,
    //             glyph: "A",
    //             title: "Orange tracks",
    //             desc: "Indicates that the pilot is the rebel hacker, Clu",
    //             eye: [-180.21798706054688, 248.6997528076172, -262.179931640625],
    //             look: [-79.57421875, -23.087656021118164, 2.36319637298584],
    //             up: [0.24628230929374695, 0.7213045954704285, 0.6473535299301147],
    //             pinShown: true,
    //             labelShown: true,
    //             mesh: 'cameraGroup.children[0]'
    //         },
    //         {
    //             primIndex: 468,
    //             bary: [0.05, 0.16, 0.79],
    //             occludable: true,
    //             glyph: "B",
    //             title: "Cannon",
    //             desc: "Fires chevron-shaped bolts of de-rezzing energy",
    //             eye: [-0.66, 20.84, -21.59],
    //             look: [-0.39, 6.84, -9.18],
    //             up: [0.01, 0.97, 0.24],
    //             pinShown: true,
    //             labelShown: true,
    //             mesh: cameraGroup.objects['camera.2']
    //         },
    //         {
    //             primIndex: 216,
    //             bary: [0.05, 0.16, 0.79],
    //             occludable: true,
    //             glyph: "C",
    //             title: "Pilot hatch",
    //             desc: "Clu hops in and out of the tank program here",
    //             eye: [1.48, 11.79, -15.13],
    //             look: [1.62, 5.04, -9.14],
    //             up: [0.01, 0.97, 0.24],
    //             pinShown: true,
    //             labelShown: true,
    //             mesh: cameraGroup.children[3]
    //         },
    //         {
    //             primIndex: 4464,
    //             bary: [0.05, 0.16, 0.79],
    //             occludable: true,
    //             glyph: "D",
    //             title: "Antenna",
    //             desc: "Links the tank program to the Master Control Program",
    //             eye: [13.63, 16.79, 13.87],
    //             look: [1.08, 7.72, 3.07],
    //             up: [0.08, 0.99, 0.07],
    //             pinShown: true,
    //             labelShown: true,
    //             mesh: cameraGroup.children[4]
    //         }
    //     ]
    // });
});

