// --- CONFIGURACIÓN DE ESCENA 3D (THREE.JS) ---
let scene3D, camera, renderer, cloud;

function init3D() {
    scene3D = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('stage'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(2000 * 3);
    for (let i = 0; i < 6000; i++) pts[i] = (Math.random() - 0.5) * 10;
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));

    cloud = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.025, color: 0xff0044, transparent: true, opacity: 0.6 }));
    scene3D.add(cloud);
    camera.position.z = 3.5;
}

// --- ANIMACIÓN DE ENTRADA AL CARGAR LA WEB ---
document.addEventListener("DOMContentLoaded", () => {
    init3D();
    animate();

    const welcomeTl = gsap.timeline();

    // 1. Aparece el cuerpo de la web suavemente
    welcomeTl.to("body", { opacity: 1, duration: 1.2, ease: "power2.out" });

    // 2. El contenido del cargador sube suavemente
    welcomeTl.from(".loader-content", { y: 30, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.5");

    // 3. El botón hace un pequeño efecto de escala
    welcomeTl.from(".trigger-btn-new", { scale: 0.8, duration: 1, ease: "back.out(2)" }, "-=0.8");
});

// --- INICIO DE LA EXPERIENCIA (INTRO MUSICAL) ---
function startExperience() {
    const music = document.getElementById('music-track');
    music.volume = 0.6;
    music.play();

    const tl = gsap.timeline();

    // 1. Desvanecer el loader inicial
    tl.to('#loader', { opacity: 0, duration: 0.8, onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('music-intro').style.display = 'flex';
    }});

    // 2. Aparece "¿Te suena?..." (Seg 1.5 aprox)
    tl.fromTo('#main-title', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, "+=0.5");

    // 3. Aparece texto Izquierda Diagonal (Seg 3 aprox)
    tl.fromTo('#text-left', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2 }, "+=0.5");

    // 4. Aparece texto Derecha Diagonal (Seg 5 aprox)
    tl.fromTo('#text-right', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1.2 }, "+=0.8");

    // 5. Aparece "BUENO EMPEZAMOS..." (Seg 7 aprox)
    tl.fromTo('#text-bottom', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "+=1");

    // 6. Transición a la primera escena a los 9.2 segundos exactos
    setTimeout(() => {
        gsap.to('#music-intro', { opacity: 0, duration: 0.8, onComplete: () => {
            document.getElementById('music-intro').style.display = 'none';
            const s1 = document.getElementById('s1');
            s1.classList.add('active');
            gsap.fromTo(s1, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
        }});
    }, 9200);
}

// --- NAVEGACIÓN ENTRE ESCENAS ---
function nextScene(num) {
    const current = document.querySelector('.scene.active');
    const next = document.getElementById('s' + num);

    gsap.to(current, { opacity: 0, scale: 0.9, y: -20, duration: 0.3, onComplete: () => {
        current.classList.remove('active');
        next.classList.add('active');
        gsap.fromTo(next, { opacity: 0, scale: 1.1, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4 });
    }});

    gsap.to(cloud.rotation, { y: cloud.rotation.y + 1, duration: 1 });
}

// --- LÓGICA DEL BOTÓN "NO" ESCURRIDIZO ---
const btnNo = document.getElementById('btn-no');

const moveBtn = (e) => {
    e.preventDefault();
    const maxX = window.innerWidth - btnNo.offsetWidth - 50;
    const maxY = window.innerHeight - btnNo.offsetHeight - 50;
    const randomX = Math.floor(Math.random() * maxX) + 25;
    const randomY = Math.floor(Math.random() * maxY) + 25;

    gsap.to(btnNo, {
        position: 'fixed',
        left: randomX,
        top: randomY,
        duration: 0.2,
        ease: "power2.out",
        scale: 1.1
    });
};

if(btnNo) {
    btnNo.addEventListener('touchstart', moveBtn);
    btnNo.addEventListener('mouseover', moveBtn);
    btnNo.addEventListener('click', (e) => e.preventDefault());
}

// --- CELEBRACIÓN FINAL ---
function celebrate() {
    const miNumero = "34623273369"; 
    const msg = encodeURIComponent("Me has ganado, la jefa acepta ser tu Valentín");

    gsap.to(cloud.material, { size: 0.1, opacity: 1, duration: 0.5 });

    setTimeout(() => { 
        window.location.href = `https://wa.me/${miNumero}?text=${msg}`; 
    }, 800);
}

// --- BUCLE DE ANIMACIÓN 3D ---
function animate() {
    if(cloud) cloud.rotation.y += 0.0015;
    renderer.render(scene3D, camera);
    requestAnimationFrame(animate);
}

// --- AJUSTE DE VENTANA ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});