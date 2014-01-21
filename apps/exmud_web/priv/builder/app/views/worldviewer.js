export
default Ember.View.extend({
    classNames: ['world-viewer'],

    didInsertElement: function() {
        var self = this;

        var $el = $(this.get('element')),
            width = window.innerWidth,
            height = window.innerHeight - $('header')
                .outerHeight(true);

        var renderer = new THREE.WebGLRenderer(),
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000),
            scene = new THREE.Scene(),
            controls = new THREE.OrbitControls(camera, $el[0]),
            ambient = new THREE.AmbientLight(0x404040);

        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 1);

        camera.position.set(0, 0, 400);
        scene.add(camera);

        ambient.position.set(0, 0, 10000);
        scene.add(ambient);

        var cube = {
            geometry: new THREE.CubeGeometry(50, 50, 50),
            material: new THREE.MeshLambertMaterial({
                emissive: 0x00ff00
            })
        };

        this.set('gfx', {
            renderer: renderer,
            camera: camera,
            scene: scene,
            cube: cube,
            light: {
                ambient: ambient
            }
        });

        $el.append(renderer.domElement);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
        }
        animate();

        function render(timestamp) {
            renderer.render(scene, camera);
        }
        render();

        controls.addEventListener('change', render);

        $(window)
            .on('resize', function(e) {
                var newWidth = window.innerWidth,
                    newHeight = window.innerHeight - $('header')
                        .outerHeight(true);

                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
                render();
            });

        var c = new THREE.Mesh(cube.geometry, cube.material);
        c.position.set(0, 0, 0);
        scene.add(c);
    }
});
