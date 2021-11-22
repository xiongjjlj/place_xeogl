// glabal variables
const apisUrl='https://api.placeint.net:3005'
var stores = [];
var floors= [];
var selected_floor;
var lastfloor_id;
var stores_on_floor=[]
var display_data={}

//create scenen object
var scene = new xeogl.Scene({
    transparent: false,
    backgroundColor: [1, 1, 1]
});

xeogl.setDefaultScene(scene);

//----------------------------------------------------------------------------------------------------
// Camera
//----------------------------------------------------------------------------------------------------

var camera = scene.camera;
var ortho = camera.ortho;
const scale=0.0002

camera.eye = [9.073974609375, 23.832809448242188, -38.2408447265625];
camera.look = [102.11075592041016, -208.75921630859375, -168.49229431152344];
camera.up = [0,1,0];
ortho.scale = 120;

// camera.zoom = -20;
camera.projection = "ortho";

// setInterval(function(){ console.log(camera.eye, camera.look, camera.up, camera.zoom); }, 3000);

var cameraControl = new xeogl.CameraControl();

scene.highlightMaterial.fillAlpha = 1;
scene.highlightMaterial.edgeAlpha = 0.6;
scene.highlightMaterial.edgeColor = [0, 0, 0];
scene.highlightMaterial.edgeWidth = 2;
//---------------------------------------------------
// Load the model
//---------------------------------------------------
new xeogl.AmbientLight({
    color: [1, 1, 1.0],
    intensity: 1
});
var floorGroup2 = new xeogl.GLTFModel({
    id: "floors",
    src: "./static/models/floor5.gltf",
    scale: [scale, scale, scale],
    edgeThreshold: 20,
    opacity: 0.5,
    visible: true,
    handleNode: (function(nodeInfo, actions) {
        return function (nodeInfo, actions) {
            if (nodeInfo.mesh !== undefined) { // Node has a mesh
                actions.createObject = {
                    id: nodeInfo.name,
                };
            }
            return true;
        };
    }),
    backgroundColor: [1, 1, 1]
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
    visible:true,
    handleNode: (function(nodeInfo, actions) {
        actions.createObject = {
            id: nodeInfo.name,
        };
        return function (nodeInfo, actions) {
            return true;
        };
    }),
    backgroundColor: [1, 1, 1]
});

floorGroup2.on("loaded", function(){
    var cameraFlight = new xeogl.CameraFlightAnimation();
    // cameraFlight.flyTo(env);

    for (const [key, value] of Object.entries(floorGroup2.objects)) {
        floors.push(key)
    }

    // 初始状态的显示L1
    // $.post(apisUrl + '/get_store_id_of_one_floor_id', {'floor_id': id2fl[selected_floor], 'property_id': property_id}, function(data, textStatus, jqXHR){
    //     if (textStatus=='success'){
    //         data.forEach(function(d){
    //             stores_on_floor.push(d.store_name)
    //             $.post(apisUrl + '/get_store_kpis2', {'start_time': startDateTime, 'end_time': endDateTime, 'store_id': d.store_name, 'property_id': property_id}, function(data, textStatus){
    //                 if(textStatus=='success'){
    //                     display_data[d.store_name]=data
    //                 }
    //             })
    //         })
    //         console.log(display_data)
    //     }
    // });

    cameraControl.on("picked", function (hit) {     
        // ------ for store
        if (floors.includes(hit.mesh.id)) {
            $('#panel-body1').empty()

            // 选中楼层的上色
            if (lastfloor_id){
                floorGroup2.meshes[lastfloor_id].colorize=[1,1,1]
                floorGroup2.meshes[lastfloor_id].opacity=1
            }
            selected_floor=hit.mesh.id
            hit.mesh.colorize=[255,0,255]
            hit.mesh.opacity=0.5
            lastfloor_id=hit.mesh.id

            // prepare the data for ranking bar chart
            stores_on_floor=[]
            display_data={}
            $.post(apisUrl + '/get_store_id_of_one_floor_id', {'floor_id': id2fl[selected_floor], 'property_id': property_id}, function(data, textStatus, jqXHR){
                if (textStatus=='success'){
                    data.forEach(function(d){
                        stores_on_floor.push(d.store_name)
                        $.post(apisUrl + '/get_store_kpis2', {'start_time': startDateTime, 'end_time': endDateTime, 'store_id': d.store_name, 'property_id': property_id}, function(data, textStatus){
                            if(textStatus=='success'){
                                display_data[d.store_name]=data
                            }
                        })
                    })
                }
            });
        }
    });
    cameraControl.on("pickedNothing", function (hit) {
        // ------ for store
        if (lastfloor_id){
            floorGroup2.meshes[lastfloor_id].colorize=[1,1,1]
            floorGroup2.meshes[lastfloor_id].opacity=1
        }
        selected_floor=''
        $('#panel-body1').empty()
    });
});
