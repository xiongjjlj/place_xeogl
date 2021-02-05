cameras = ['J01', 'J02', 'J03', 'J04', 'J05', 'J06', 'J07', 'J08', 'J09', 
'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 
'J20', 'J21', 'J22', 'J23', 'J24', 'J25', 'J26', 'J27', 'J28', 
'J29', 'J30', 'J31', 'J32', 'J33', 'J34', 'J35']

stores =  ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2011', 
'2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', 
'2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', 
'2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', 
'2036', '2037', '2038']

stores = []

floorOrder = {
    'B3': -2,
    'B2': -1,
    'B1': 0,
    'L1': 1,
    'L2': 2,
    'L3': 3,
    'L4': 4,
    'L5': 5,
    'L6': 6
    '_797': 'L3',
    '_796': 'L2',
    '_795': 'L1',
    '_802': 'B1',
    '_803': 'B2'
}

var stores = [];
var currentFloorStores = [];
var storeAnno = [];

//create scenen object
var scene = new xeogl.Scene({
    // canvas:'myCanvas',
    transparent: false,
    backgroundColor: [0.125, 0.125, 0.125]
});

xeogl.setDefaultScene(scene);


//----------------------------------------------------------------------------------------------------
// Camera
//----------------------------------------------------------------------------------------------------

var camera = scene.camera;
var lastStore;
var lastAnnotation;
var selected_store;
var lastStore_id;
const scale=0.001

camera.eye = [100, 100, -100];
camera.look = [150, 7, -170];
camera.up = [0,1,0];
camera.projection = "ortho";

var cameraControl = new xeogl.CameraControl({
    doublePickFlyTo: false
});

var cameraFlight = new xeogl.CameraFlightAnimation();

scene.highlightMaterial.fillAlpha = 1;
scene.highlightMaterial.edgeAlpha = 0.6;
scene.highlightMaterial.edgeColor = [0, 0, 0];
scene.highlightMaterial.edgeWidth = 2;

var lastEntity = null;
var lastColorize = null;
var input = scene.input;

//---------------------------------------------------
// Load the model
//---------------------------------------------------

var floorGroup = new xeogl.GLTFModel({
    id: "floors",
    src: "./static/models/floor5.gltf",
    scale: [scale, scale, scale],
    edgeThreshold: 20,
    opacity: 0.9,
    visible: true,
    handleNode: (function(nodeInfo, actions) {
        var objectCount = 0;
        return function (nodeInfo, actions) {
            if (nodeInfo.mesh !== undefined) { // Node has a mesh
                console.log(nodeInfo.name)

                actions.createObject = {
                    id: nodeInfo.name,
                };
            }
            return true;
        };
    })
})

var env = new xeogl.GLTFModel({
    id: "hopson-env",
    src: "./static/models/env.gltf",
    scale: [scale, scale, scale],
    // edgeThreshold: 50,
    edges: false,
    outlined: false,
    pickable: false,
    ghosted: true,
    visible:false,
    handleNode: (function(nodeInfo, actions) {
        var objectCount = 0;
        actions.createObject = {
            id: nodeInfo.name,
        };
        return function (nodeInfo, actions) {
            return true;
        };
    })
});

var storeGroup = new xeogl.GLTFModel({
    id: "storeGroup",
    src: "./static/models/stores.gltf",
    scale: [scale, scale, scale],
    edgeThreshold: 0,
    opacity: 0.2,
    visible: false,
    handleNode: (function(nodeInfo, actions) {
        var objectCount = 0;
        actions.createObject = {
            id: nodeInfo.name,
        };
        return function (nodeInfo, actions) {
            if (nodeInfo.mesh !== undefined) { // Node has a mesh
                actions.createObject = {
                    id: nodeInfo.name,
                };
            }
            return true;
        };
    })
});

var cameraGroup = new xeogl.GLTFModel({
    id: "cameraGroup",
    src: "./static/models/camera.gltf",
    scale: [scale, scale, scale],
    edgeThreshold: 20,
    opacity: 0.4,
    visible: false,
    handleNode: (function(nodeInfo, actions) {
        var objectCount = 0;
        return function (nodeInfo, actions) {
            // if (nodeInfo.mesh !== undefined) { // Node has a mesh
                console.log(nodeInfo.name)
                actions.createObject = {
                    id: nodeInfo.name,
                };
            // }
            return true;
        };
    })
});

storeGroup.on("loaded", function(){
    for (const [key, value] of Object.entries(storeGroup.objects)) {
        stores.push(key)
    }

});

// initial_centers={};
floorGroup.on("loaded", function(){
    console.log('model loaded')
    cameraControl.on('picked', function(hit){
        console.log(hit.mesh.id)
        picked_center = hit.mesh._aabbCenter[1];
        var dist=120000
        for (const [key, value] of Object.entries(floorGroup.meshes)) {
            if (value._aabbCenter[1] > picked_center)
            {
                value.position = [0, dist, 0];
            }
            else{
                init=picked_center
                value.position = [0, 0, 0];
            }
        }
        
        storeAnno.forEach(storeA => {
            storeA.destroy();
        })
        storeAnno = []
        currentFloorStores=[]
        stores.forEach(store_id => {
    
            if (picked_center>100){
                picked_center=picked_center-dist*scale
            }
            // if (Math.abs(storeGroup.objects[store_id]._aabbCenter[1] - picked_center)<=3){
            // console.log(store_id.slice(0,2))
            if (store_id.slice(0,2)===id2floor[hit.mesh.id]){
                storeGroup.objects[store_id].visible = true;
                // deltaY=storeGroup.objects[store_id].position[1];
                // storeGroup.objects[store_id].position = [0,deltaY+10,0];
                var store = new xeogl.Annotation(scene, {
                    mesh: storeGroup.objects[store_id], 
                    id: "Anno"+ store_id,
                    bary: [0.33, 0.33, 0.33],
                    occludable: true,
                    glyph: store_id,
                    desc: 'Store ID: ' + store_id,
                    pinShown: false,
                    labelShown: false
                });
                storeAnno.push(store)
                currentFloorStores.push(store_id) // get store id on the selected floor
            }
            
            else{
                storeGroup.objects[store_id].visible = false;}
        })
    
    })
});



cameraControl.on("hoverEnter", function (hit) {     
// ------ for store
if (stores.includes(hit.mesh.id)) {
    mesh=scene.components[hit.mesh.id];
    object = scene.components['Anno'+ hit.mesh.id];
    // console.log('anno pos1', object.canvasPos)
    // console.log('mesh pos ', mesh._aabbCenter)
    // console.log('anno pos2', object.canvasPos)
    

    object.mesh.aabbVisible = true;
    object.labelShown = true;
    // do other things for store
}
});

cameraControl.on("hoverOut", function (hit) {
// ------ for store
if (stores.includes(hit.mesh.id)) {
    object = scene.components['Anno'+ hit.mesh.id];
    object.mesh.aabbVisible = false;
    object.colorize = [1.0, 0, 0];
    object.labelShown = false;
    // do other things for store
}

cameraControl.on("picked", function (hit) {     
    if (currentFloorStores.includes(hit.mesh.id)) {
        if (lastStore_id){
            // console.log('lastStore_id',lastStore_id)
            storeGroup.meshes[lastStore_id].opacity=0.2
        }
        selected_store=hit.mesh.id
        // console.log('selected: ', selected_store)
        
        hit.mesh.opacity=1
        lastStore_id=hit.mesh.id
    }
    // lastStore_id=hit.mesh.id
    // console.log('lastStore_id1',lastStore_id)
    // export {selected_store};
});
    
cameraControl.on("pickedNothing", function (hit) {
    // if (lastStore_id){
    //     storeGroup.meshes[lastStore_id].opacity=0.2
    // }
});
});



// env.on("loaded", function () {
//     // env.ghosted = false;
// });

//-----------------------model.on-------------------------------------

// env.on("loaded", function () {

//     env.ghosted = false;

//     var selectedMeshes = [
//         "camera#285.0",
//         "camera#291.0",
//         "camera#57.0"
//     ];

//     var Menu = function () {

//         var ghostMaterial = scene.ghostMaterial;
//         var highlightMaterial = scene.highlightMaterial;

//         this["ghosted"] = true;
//         this["ghostMaterial.preset"] = "defaultDarkBG";
//         this["ghostMaterial.edges"] = ghostMaterial.edges;
//         this["ghostMaterial.fill"] = ghostMaterial.fill;
//         this["ghostMaterial.vertices"] = ghostMaterial.vertices;
//         this["ghostMaterial.edgeColor"] = typedToJS(ghostMaterial.edgeColor);
//         this["ghostMaterial.edgeAlpha"] = ghostMaterial.edgeAlpha;
//         this["ghostMaterial.edgeWidth"] = ghostMaterial.edgeWidth;
//         this["ghostMaterial.vertexColor"] = typedToJS(ghostMaterial.vertexColor);
//         this["ghostMaterial.vertexAlpha"] = ghostMaterial.vertexAlpha;
//         this["ghostMaterial.vertexSize"] = ghostMaterial.vertexSize;
//         this["ghostMaterial.fillColor"] = typedToJS(ghostMaterial.fillColor);
//         this["ghostMaterial.fillAlpha"] = ghostMaterial.fillAlpha;

//         this["highlighted"] = true;
//         this["highlightMaterial.preset"] = "yellowHighlight";
//         this["highlightMaterial.edges"] = highlightMaterial.edges;
//         this["highlightMaterial.fill"] = highlightMaterial.fill;
//         this["highlightMaterial.vertices"] = highlightMaterial.vertices;
//         this["highlightMaterial.edgeColor"] = typedToJS(highlightMaterial.edgeColor);
//         this["highlightMaterial.edgeAlpha"] = highlightMaterial.edgeAlpha;
//         this["highlightMaterial.edgeWidth"] = highlightMaterial.edgeWidth;
//         this["highlightMaterial.vertexColor"] = typedToJS(highlightMaterial.vertexColor);
//         this["highlightMaterial.vertexAlpha"] = highlightMaterial.vertexAlpha;
//         this["highlightMaterial.vertexSize"] = highlightMaterial.vertexSize;
//         this["highlightMaterial.fillColor"] = typedToJS(highlightMaterial.fillColor);
//         this["highlightMaterial.fillAlpha"] = highlightMaterial.fillAlpha;

//         this["scene.gammaOutput"] = env.scene.gammaOutput;
//         this["scene.gammaFactor"] = env.scene.gammaFactor;

//         var self = this;

//         var lastGhostMaterialPreset;
//         var lastHighlightMaterialPreset;

//         var update = function () {

//             env.ghosted = !!self["ghosted"];

//             var preset = self["ghostMaterial.preset"];
//             if (lastGhostMaterialPreset !== preset) {
//                 ghostMaterial.preset = preset;
//                 lastGhostMaterialPreset = preset;
//                 self["ghostMaterial.edges"] = ghostMaterial.edges;
//                 self["ghostMaterial.fill"] = ghostMaterial.fill;
//                 self["ghostMaterial.vertices"] = ghostMaterial.vertices;
//                 self["ghostMaterial.edgeColor"] = typedToJS(ghostMaterial.edgeColor);
//                 self["ghostMaterial.edgeAlpha"] = ghostMaterial.edgeAlpha;
//                 self["ghostMaterial.edgeWidth"] = ghostMaterial.edgeWidth;
//                 self["ghostMaterial.vertexColor"] = typedToJS(ghostMaterial.vertexColor);
//                 self["ghostMaterial.vertexAlpha"] = ghostMaterial.vertexAlpha;
//                 self["ghostMaterial.vertexSize"] = ghostMaterial.vertexSize;
//                 self["ghostMaterial.fillColor"] = typedToJS(ghostMaterial.fillColor);
//                 self["ghostMaterial.fillAlpha"] = ghostMaterial.fillAlpha;
//             } else {
//                 ghostMaterial.vertices = !!self["ghostMaterial.vertices"];
//                 ghostMaterial.edges = !!self["ghostMaterial.edges"];
//                 ghostMaterial.fill = !!self["ghostMaterial.fill"];
//                 ghostMaterial.edgeColor = JSToTyped(self["ghostMaterial.edgeColor"]);
//                 ghostMaterial.edgeAlpha = self["ghostMaterial.edgeAlpha"];
//                 ghostMaterial.edgeWidth = self["ghostMaterial.edgeWidth"];
//                 ghostMaterial.vertexColor = JSToTyped(self["ghostMaterial.vertexColor"]);
//                 ghostMaterial.vertexAlpha = self["ghostMaterial.vertexAlpha"];
//                 ghostMaterial.vertexSize = self["ghostMaterial.vertexSize"];
//                 ghostMaterial.fillColor = JSToTyped(self["ghostMaterial.fillColor"]);
//                 ghostMaterial.fillAlpha = self["ghostMaterial.fillAlpha"];
//             }

//             preset = self["highlightMaterial.preset"];

//             if (lastHighlightMaterialPreset !== preset) {
//                 highlightMaterial.preset = preset;
//                 lastHighlightMaterialPreset = preset;
//                 self["highlightMaterial.edges"] = highlightMaterial.edges;
//                 self["highlightMaterial.fill"] = highlightMaterial.fill;
//                 self["highlightMaterial.vertices"] = highlightMaterial.vertices;
//                 self["highlightMaterial.edgeColor"] = typedToJS(highlightMaterial.edgeColor);
//                 self["highlightMaterial.edgeAlpha"] = highlightMaterial.edgeAlpha;
//                 self["highlightMaterial.edgeWidth"] = highlightMaterial.edgeWidth;
//                 self["highlightMaterial.vertexColor"] = typedToJS(highlightMaterial.vertexColor);
//                 self["highlightMaterial.vertexAlpha"] = highlightMaterial.vertexAlpha;
//                 self["highlightMaterial.vertexSize"] = highlightMaterial.vertexSize;
//                 self["highlightMaterial.fillColor"] = typedToJS(highlightMaterial.fillColor);
//                 self["highlightMaterial.fillAlpha"] = highlightMaterial.fillAlpha;
//             } else {
//                 highlightMaterial.vertices = !!self["highlightMaterial.vertices"];
//                 highlightMaterial.edges = !!self["highlightMaterial.edges"];
//                 highlightMaterial.fill = !!self["highlightMaterial.fill"];
//                 highlightMaterial.edgeColor = JSToTyped(self["highlightMaterial.edgeColor"]);
//                 highlightMaterial.edgeAlpha = self["highlightMaterial.edgeAlpha"];
//                 highlightMaterial.edgeWidth = self["highlightMaterial.edgeWidth"];
//                 highlightMaterial.vertexColor = JSToTyped(self["highlightMaterial.vertexColor"]);
//                 highlightMaterial.vertexAlpha = self["highlightMaterial.vertexAlpha"];
//                 highlightMaterial.vertexSize = self["highlightMaterial.vertexSize"];
//                 highlightMaterial.fillColor = JSToTyped(self["highlightMaterial.fillColor"]);
//                 highlightMaterial.fillAlpha = self["highlightMaterial.fillAlpha"];
//             }

//             var highlighted = !!self["highlighted"];

//             for (var i = 0; i < selectedMeshes.length; i++) {
//                 var id = selectedMeshes[i];
//                 var mesh = env.meshes[id];
//                 if (mesh) {
//                     mesh.highlighted = highlighted;
//                     mesh.ghosted = false;
//                 }
//             }

//             env.scene.gammaOutput = self["scene.gammaOutput"];
//             env.scene.gammaFactor = self["scene.gammaFactor"];

//             requestAnimationFrame(update);
//         };

//         update();
//     };

//     var gui = new dat.GUI({autoPlace: false, top: 0, width: 400});

//     // document.getElementById('dat-gui-container').appendChild(gui.domElement);

//     var menu = new Menu();

//     var ghostFolder = gui.addFolder('scene.ghostMaterial');
//     ghostFolder.add(menu, 'ghosted', true);
//     ghostFolder.add(menu, 'ghostMaterial.preset', Object.keys(xeogl.EmphasisMaterial.presets));
//     ghostFolder.add(menu, 'ghostMaterial.edges', true).listen();
//     ghostFolder.addColor(menu, 'ghostMaterial.edgeColor', [255, 255, 255]).listen();
//     ghostFolder.add(menu, 'ghostMaterial.edgeAlpha', 0.0, 1.0).listen();
//     ghostFolder.add(menu, 'ghostMaterial.edgeWidth', 1, 10).listen();
//     ghostFolder.add(menu, 'ghostMaterial.vertices', true).listen();
//     ghostFolder.addColor(menu, 'ghostMaterial.vertexColor', [255, 255, 255]).listen();
//     ghostFolder.add(menu, 'ghostMaterial.vertexAlpha', 0.0, 1.0).listen();
//     ghostFolder.add(menu, 'ghostMaterial.vertexSize', 1, 10).listen();
//     ghostFolder.add(menu, 'ghostMaterial.fill', true).listen();
//     ghostFolder.addColor(menu, 'ghostMaterial.fillColor', [255, 255, 255]).listen();
//     ghostFolder.add(menu, 'ghostMaterial.fillAlpha', 0.0, 1.0).listen();
//     ghostFolder.open();

//     var highlightFolder = gui.addFolder('scene.highlighted');
//     highlightFolder.add(menu, 'highlighted', true);
//     highlightFolder.add(menu, 'highlightMaterial.preset', Object.keys(xeogl.EmphasisMaterial.presets));
//     highlightFolder.add(menu, 'highlightMaterial.edges', true).listen();
//     highlightFolder.addColor(menu, 'highlightMaterial.edgeColor', [255, 255, 255]).listen();
//     highlightFolder.add(menu, 'highlightMaterial.edgeAlpha', 0.0, 1.0).listen();
//     highlightFolder.add(menu, 'highlightMaterial.edgeWidth', 1, 10).listen();
//     highlightFolder.add(menu, 'highlightMaterial.vertices', true).listen();
//     highlightFolder.addColor(menu, 'highlightMaterial.vertexColor', [255, 255, 255]).listen();
//     highlightFolder.add(menu, 'highlightMaterial.vertexAlpha', 0.0, 1.0).listen();
//     highlightFolder.add(menu, 'highlightMaterial.vertexSize', 1, 10).listen();
//     highlightFolder.add(menu, 'highlightMaterial.fill', true).listen();
//     highlightFolder.addColor(menu, 'highlightMaterial.fillColor', [255, 255, 255]).listen();
//     highlightFolder.add(menu, 'highlightMaterial.fillAlpha', 0.0, 1.0).listen();
//     highlightFolder.open();

//     var gammaFolder = gui.addFolder('gamma');
//     gammaFolder.add(menu, 'scene.gammaOutput', true).listen();
//     gammaFolder.add(menu, 'scene.gammaFactor', 0.0, 3.0).listen();
//     gammaFolder.open();

//     function typedToJS(arry) {
//         return [arry[0] * 255, arry[1] * 255, arry[2] * 255];
//     }

//     function JSToTyped(arry) {
//         return [arry[0] / 255, arry[1] / 255, arry[2] / 255];
//     }
// });


// //-----------------------annotation-------------------------------------
// cameraGroup.on("loaded", function () {
//     // When each annotation's pin is clicked, we'll show the annotation's label 

//     // triggered when hitting camera pin
//     function pinClicked(hit) {
//         // annotation.labelShown = !annotation.labelShown;
//         // if (lastAnnotation) {
//         //     lastAnnotation.labelShown = false;
//         // }
//         annotation = hit.mesh.id
//         path = '/static/screenshot/' + annotation + '.png'
//         var img = document.createElement('img');
//         // var canvas = document.querySelector('#photo');
//         var canvas = $('#camera-info', parent.document)
//         img.setAttribute('id', annotation);
//         img.setAttribute('alt', 'camera photo missing')
//         img.setAttribute('class', 'camera-image');
//         img.setAttribute('height', '100');
//         img.setAttribute('src', path);

//         canvas.empty();
//         canvas.append(`<h2 id="first-level-title">Camera Information</h2>`)
//         canvas.append(img);
//         canvas.append(`<p id="second-level-title">Other information below: floor level; resolution; some overall stats from processing</p>`)
//         // console.log(`${annotation} clicked`)
//         lastAnnotation = annotation;
//     }
     
//     // ----------------------------Create three annotations on meshes
//     // ----------------------------within the model
    
//     //---------------------------- for camera information annotation
//     cameras.forEach(camera_id => {
//         var temp_anno = new xeogl.Annotation(scene, {
//             mesh: cameraGroup.objects[camera_id],
//             id: "Anno"+ camera_id,
//             bary: [0.33, 0.33, 0.33],
//             occludable: true,
//             glyph: camera_id,
//             desc: 'Text Description Goes Here',
//             title: "Camera-" + camera_id,
//             pinShown: true,
//             labelShown: false
//         });
//         temp_anno.on("pinClicked", pinClicked);
//     })

//     //---------------------------- for store information annotation
//     stores.forEach(store_id => {
//         var storei = new xeogl.Annotation(scene, {
//             mesh: cameraGroup.objects[store_id], 
//             id: "Anno"+ store_id,
//             bary: [0.33, 0.33, 0.33],
//             occludable: false,
//             glyph: store_id,
//             desc: 'Store ID: ' + store_id,
//             pinShown: false,
//             labelShown: false
//         });   
//     }) 
 
//     // If desired, we can also dynamically track the Cartesian coordinates
//     // of each annotation in Local and World coordinate spaces
 
//     // J03.on("localPos", function(localPos) {
//     //     console.log("Local pos changed: " + JSON.stringify(localPos, null, "\t"));
//     // });
 
//     // J03.on("worldPos", function(worldPos) {
//     //     console.log("World pos changed: " + JSON.stringify(worldPos, null, "\t"));
//     // });

//     //register all events

//     cameraControl.on('picked', function(hit){
//         // ------ for store
//         if (stores.includes(hit.mesh.id)) {
//             lastStore = object;            
//             // do other things for store
//         }

//     })

//     cameraControl.on("hoverEnter", function (hit) {     
//         // ------ for store
//         if (stores.includes(hit.mesh.id)) {
//             object = scene.components['Anno'+ hit.mesh.id];
//             object.mesh.aabbVisible = true;
//             object.labelShown = !object.labelShown;
//             // do other things for store
//         }
//     });

//     cameraControl.on("hoverOut", function (hit) {
//         // ------ for store
//         if (stores.includes(hit.mesh.id)) {
//             object = scene.components['Anno'+ hit.mesh.id];
//             object.mesh.aabbVisible = false;
//             object.colorize = [1.0, 0, 0];
//             object.labelShown = !object.labelShown;
//             // do other things for store
//         }
//     });

//     // if clicked on nothing, zoom to the full model
//     cameraControl.on("pickedNothing", function (hit) {
//         cameraFlight.flyTo(model);
//     });

//  });