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
camera.look = [206, 7, -170];
camera.up = [0,1,0];




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
    console.log(hit.mesh);
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

});


//-----------------------annotation-------------------------------------
cameraGroup.on("loaded", function () {
    // When each annotation's pin is clicked, we'll show the annotation's label 
    var lastAnnotation;

    function pinClicked(annotation) {
        annotation.labelShown = !annotation.labelShown;
        if (lastAnnotation) {
            lastAnnotation.labelShown = false;
        }
        lastAnnotation = annotation;

    }
     
    // Create three annotations on meshes
    // within the model
 
    for (i=1; i<10; i++ ){
        var J0i = new xeogl.Annotation({
            mesh: cameraGroup.objects['J0'+ i],
            primIndex: 0,
            bary: [0.33, 0.33, 0.33],
            occludable: true,
            glyph: "J0"+ i,
            desc: 'Text Description Goes Here',
            title: "Camera-J0" + i,
            pinShown: true,
            labelShown: false
        });
        
        J0i.on("pinClicked", pinClicked);
        // console.log(J0i.mesh);
    }
    for (i=10; i<36; i++ ){
        var Ji = new xeogl.Annotation({
            mesh: cameraGroup.objects['J'+ i], 
            primIndex: 0,
            bary: [0.33, 0.33, 0.33],
            occludable: true,
            glyph: "J"+ i,
            desc: 'Text Description Goes Here',
            title: "Camera-J" + i,
            pinShown: true,
            labelShown: false
        });
        
        Ji.on("pinClicked", pinClicked);

    }


 
    // If desired, we can also dynamically track the Cartesian coordinates
    // of each annotation in Local and World coordinate spaces
 
    // J03.on("localPos", function(localPos) {
    //     console.log("Local pos changed: " + JSON.stringify(localPos, null, "\t"));
    // });
 
    // J03.on("worldPos", function(worldPos) {
    //     console.log("World pos changed: " + JSON.stringify(worldPos, null, "\t"));
    // });
 });