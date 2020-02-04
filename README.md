# place_xeogl

### What this repo is about:
This repo initially started as a 3d visualization project. As project progresses, this repo is then developed into the fundation for future visualization dashboard. This repo is maintained by xionjjlj and wzt1001.

### Some major changes on this branch compared to master by zwang (20-02-01):
1. Split into two htmls, index.html as a layout for data visualization, 3d-vis.html as an independent page for 3d visualzation. 3d-vis.html is loaded into index.html as an <iframe>, as provide as a standard method for loading xeogl visualizations to other pages. As such, the css is also splited into main.css + annotation-style.css
2. for index.html, bootstrap is added for easier page layouting 
3. cleaned some hardcoded parts in loadModel.js
4. optimized the click/hover events
5. added some missing images for cameras
  
### TO-DOs (20-02-03 to 20-02-09)
1. add legends for the visualization
2. highlight store zone, or camera if clicked
3. other aesthetic changes as to be suggested by UX designer

Also, please see the example for the final visualization:
https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6
