let scene3D, camera, renderer, cloud;

function init3D() {
    scene3D = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('stage'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(2000 * 3);
    for(let i=0; i < 6000; i++) pts[i] = (Math.random() - 0.5) * 10;
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    
    cloud = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.025, color: 0xff0044, transparent: true, opacity: 0.6 }));
    scene3D.add(cloud);
    camera.position.z = 3.5;
}

function startExperience() {
    const music = document.getElementById('music-track');
    music.play();
    
    gsap.to('#loader', { opacity: 0, duration: 0.8, onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        const s1 = document.getElementById('s1');
        s1.classList.add('active');
    }});
}

function nextScene(num) {
    const current = document.querySelector('.scene.active');
    const next = document.getElementById('s' + num);
    
    gsap.to(current, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => {
        current.classList.remove('active');
        next.classList.add('active');
        gsap.fromTo(next, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.4 });
    }});
    
    // Al cambiar de escena, las partículas pegan un pequeño acelerón
    gsap.to(cloud.rotation, { y: cloud.rotation.y + 1, duration: 1 });
}

// Localizamos el botón
const btnNo = document.getElementById('btn-no');

// Función para mover el botón
const moveBtn = (e) => {
    // Evitamos que el clic/toque llegue a ejecutarse
    e.preventDefault();

    // Calculamos una posición aleatoria dentro de la pantalla del móvil
    // Dejamos un margen de 50px para que no se pegue a los bordes
    const maxX = window.innerWidth - btnNo.offsetWidth - 50;
    const maxY = window.innerHeight - btnNo.offsetHeight - 50;

    const randomX = Math.floor(Math.random() * maxX) + 25;
    const randomY = Math.floor(Math.random() * maxY) + 25;

    // Aplicamos el movimiento con un efecto de "salto"
    gsap.to(btnNo, {
        position: 'fixed',
        left: randomX,
        top: randomY,
        duration: 0.2,
        ease: "power2.out",
        scale: 1.1 // Un pequeño efecto de que se asusta
    });
};

// EVENTOS: 'touchstart' es clave para que el móvil lo detecte antes de pulsar
btnNo.addEventListener('touchstart', moveBtn);
btnNo.addEventListener('mouseover', moveBtn); // Por si lo abre en PC
btnNo.addEventListener('click', (e) => e.preventDefault()); // Por si acaso

function celebrate() {
    // EL NÚMERO DEBE SER EL TUYO PARA QUE ELLA TE ESCRIBA
    const miNumero = "34623273369"; 
    const msg = encodeURIComponent("Me has ganado, la jefa acepta ser tu Valentín");
    
    // Brillo final antes de salir
    gsap.to(cloud.material, { size: 0.1, opacity: 1, duration: 0.5 });
    
    setTimeout(() => { 
        window.location.href = `https://wa.me/${miNumero}?text=${msg}`; 
    }, 800);
}

function animate() {
    cloud.rotation.y += 0.0015;
    renderer.render(scene3D, camera);
    requestAnimationFrame(animate);
}

init3D();
animate();

// Ajuste si gira el móvil
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});