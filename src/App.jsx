import "./App.css";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import cuzzyModelUrl from "./assets/models/cuzzy.glb?url";
import eklundModelUrl from "./assets/models/eklund.glb?url";
import interestBmwModelUrl from "./assets/models/interest-bmw.glb?url";
import interestKeyboardModelUrl from "./assets/models/interest-keyboard.glb?url";
import interestPigModelUrl from "./assets/models/interest-pig.glb?url";
import interestSushiModelUrl from "./assets/models/interest-sushi.glb?url";
import interestVolleyballModelUrl from "./assets/models/interest-volleyball.glb?url";
import jakeSandersonModelUrl from "./assets/models/jake-sanderson.glb?url";
import jeffModelUrl from "./assets/models/jeff-center.glb?url";
import linusUllmarkModelUrl from "./assets/models/linus-ullmark.glb?url";
import marvelCaptainAmericaModelUrl from "./assets/models/marvel-captain-america.glb?url";
import marvelDeadpoolModelUrl from "./assets/models/marvel-deadpool.glb?url";
import marvelIronManModelUrl from "./assets/models/marvel-iron-man.glb?url";
import marvelSpiderManModelUrl from "./assets/models/marvel-spider-man.glb?url";
import marvelVenomModelUrl from "./assets/models/marvel-venom.glb?url";
import thomasChabotModelUrl from "./assets/models/thomas-chabot.glb?url";
import timStutzleModelUrl from "./assets/models/tim-stutzle.glb?url";

const TAU = Math.PI * 2;
const JEFF_FRONT_ANGLE = -Math.PI / 2;

const MODEL_MESSAGES = {
  "interest-bmw": { category: "Interest", title: "BMW X3", message: "a" },
  "interest-keyboard": { category: "Interest", title: "Keyboard", message: "b" },
  "interest-pig": { category: "Interest", title: "Pig", message: "c" },
  "interest-sushi": { category: "Interest", title: "Sushi", message: "d" },
  "interest-volleyball": { category: "Interest", title: "Volleyball", message: "e" },
  "interest-dumbbell": { category: "Interest", title: "Dumbbell", message: "f" },
  sens: { category: "Hockey", title: "Hockey players", message: "g" },
  marvel: { category: "Marvel", title: "Marvel characters", message: "h" },
};

const MODEL_MESSAGE_ORDER = [
  "interest-bmw",
  "interest-keyboard",
  "interest-pig",
  "interest-sushi",
  "interest-volleyball",
  "interest-dumbbell",
  "sens",
  "marvel",
];

const ORBIT_GROUPS = [
  {
    id: "interest",
    radius: 3.12,
    depth: 0.52,
    depthPhase: 2.35,
    revealOrder: 2,
    speed: 0.11,
    color: 0xd2a94c,
    opacity: 0.28,
    phaseOffset: 0.62,
    models: [
      { name: "BMW X3", interactionId: "interest-bmw", url: interestBmwModelUrl, size: 0.7, spin: 0.28, front: 0.2, tilt: -0.18 },
      { name: "Keyboard", interactionId: "interest-keyboard", url: interestKeyboardModelUrl, size: 0.62, spin: -0.31, front: 0.1, tilt: -0.52 },
      { name: "Pig", interactionId: "interest-pig", url: interestPigModelUrl, size: 0.64, spin: 0.36, front: -1.2 },
      { name: "Sushi", interactionId: "interest-sushi", url: interestSushiModelUrl, size: 0.6, spin: -0.3, front: 0, tilt: -0.34 },
      { name: "Volleyball", interactionId: "interest-volleyball", url: interestVolleyballModelUrl, size: 0.46, spin: 0.42, front: 0 },
      { name: "Dumbbell", interactionId: "interest-dumbbell", create: createDumbbellModel, size: 0.58, spin: -0.38, front: 0.2, tilt: -0.18 },
    ],
  },
  {
    id: "sens",
    interactionId: "sens",
    radius: 2.4,
    depth: 0.42,
    depthPhase: 1.15,
    revealOrder: 1,
    speed: -0.17,
    color: 0xf4efe6,
    opacity: 0.13,
    phaseOffset: 0.52,
    models: [
      { name: "Tim Stutzle", url: timStutzleModelUrl, size: 0.74, spin: 0.42, front: -1.5 },
      { name: "Cuzzy", url: cuzzyModelUrl, size: 0.71, spin: -0.39, front: -1.5 },
      { name: "Eklund", url: eklundModelUrl, size: 0.73, spin: 0.37, front: -1.5 },
      { name: "Jake Sanderson", url: jakeSandersonModelUrl, size: 0.72, spin: -0.4, front: -1.5 },
      { name: "Linus Ullmark", url: linusUllmarkModelUrl, size: 0.75, spin: 0.41, front: -1.5 },
      { name: "Thomas Chabot", url: thomasChabotModelUrl, size: 0.72, spin: -0.36, front: -1.5 },
    ],
  },
  {
    id: "marvel",
    interactionId: "marvel",
    radius: 1.68,
    depth: 0.32,
    depthPhase: 0,
    revealOrder: 0,
    speed: 0.2,
    color: 0xd13a32,
    opacity: 0.26,
    phaseOffset: 0,
    models: [
      { name: "Captain America", url: marvelCaptainAmericaModelUrl, size: 0.8, spin: 0.27, front: 0 },
      { name: "Deadpool", url: marvelDeadpoolModelUrl, size: 0.8, spin: -0.3, front: 0 },
      { name: "Iron Man", url: marvelIronManModelUrl, size: 0.82, spin: 0.29, front: 0 },
      { name: "Spider-Man", url: marvelSpiderManModelUrl, size: 0.84, spin: -0.32, front: 0 },
      { name: "Venom", url: marvelVenomModelUrl, size: 0.88, spin: 0.26, front: 0 },
    ],
  },
];

const ORBITING_MODELS = ORBIT_GROUPS.flatMap((group, groupIndex) =>
  group.models.map((model, modelIndex) => ({
    ...model,
    path: groupIndex,
    groupIndex,
    modelIndex,
    instanceId: `${group.id}-${modelIndex}`,
    interactionId: model.interactionId ?? group.interactionId,
    phase: group.phaseOffset + (modelIndex / group.models.length) * TAU,
  })),
);

const hackathonProjects = [
  { name: "Code Jam 15", context: "McGill Engineering, 36h", description: "Minigames app including 2048, Snake, and Block Blast in one app.", href: "https://github.com/alex-wang55/CodeJam-Project" },
  { name: "Hack the Hill 2", context: "uOttawa, 48h", description: "Wearable health monitor concept." },
  { name: "Counterspell", context: "Shopify/Hack Club, 24h", description: "PvP game built during the hackathon.", href: "https://github.com/Jeffrey-dai17/Hawk.vs.Paul" },
  { name: "Ignition Hacks", context: "36h, online", description: "Game raising awareness about issues facing third-world countries.", href: "https://github.com/dwseoh/EduAtlas" },
];

const hardwareBuilds = [
  "Custom claw machine with a gantry built to 3D-printer-level positional accuracy, controlled by 2 Arduinos.",
  "Brushed DC motor built using a 3D printer and household materials including paper clips and tin foil.",
];

const roboticsHighlights = ["2-time provincial finalist", "World Championship 2023 participant", "Drive Team Member", "Led small sub-teams"];
const roboticsSkills = ["CAD", "3D printing", "Hand tools", "Power tools"];
const chemECarSkills = ["PCB board design", "PCB soldering", "Motors", "Circuits"];

const revealMotion = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.54, ease: [0.22, 1, 0.36, 1] },
};

function Reveal({ as = "div", children, className = "", ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const Component = as;
  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return <Component className={className} {...props}>{children}</Component>;
  }

  return <MotionComponent className={className} {...revealMotion} {...props}>{children}</MotionComponent>;
}

function ArrowLink({ href, children, download = false }) {
  return (
    <a className="arrow-link" href={href} download={download || undefined}>
      <span>{children}</span>
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}

function OrbitalSculpture() {
  const shouldReduceMotion = useReducedMotion();
  const modelHostRef = useRef(null);
  const selectionRef = useRef(null);
  const [modelState, setModelState] = useState("loading");
  const [selection, setSelection] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const activeMessage = selection
    ? MODEL_MESSAGES[selection.interactionId]
    : null;

  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  useEffect(() => {
    if (!selection && !isGuideOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setSelection(null);
        setIsGuideOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isGuideOpen, selection]);

  const closePanel = () => {
    setSelection(null);
    setIsGuideOpen(false);
  };

  const selectFromGuide = (interactionId) => {
    setSelection({
      interactionId,
      instanceId: null,
      modelName: MODEL_MESSAGES[interactionId].title,
    });
    setIsGuideOpen(false);
  };

  useEffect(() => {
    const modelHost = modelHostRef.current;

    if (!modelHost) {
      return undefined;
    }

    let animationFrame = 0;
    let disposed = false;
    let renderer;
    let sceneReady = false;
    let sceneVisible = true;
    let elapsed = 0;
    let lastFrameTime = performance.now();

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setModelState("error");
      return undefined;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "orbital-model-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    modelHost.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    scene.add(new THREE.HemisphereLight(0xfff7ec, 0x101216, 1.9));

    const keyLight = new THREE.DirectionalLight(0xfff8ed, 3.5);
    keyLight.position.set(4.2, 5.4, 6.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb9c8d2, 1.25);
    fillLight.position.set(-4.8, 1.4, 3.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd13a32, 2.1);
    rimLight.position.set(-3.8, 3.2, -5.5);
    scene.add(rimLight);

    const warmRimLight = new THREE.PointLight(0xd2a94c, 8.5, 12, 2);
    warmRimLight.position.set(3.4, -1.8, 2.6);
    scene.add(warmRimLight);

    const orbiterMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.01,
      roughness: 0.54,
    });
    const hitTargetGeometry = new THREE.SphereGeometry(1, 10, 8);
    const hitTargetMaterial = new THREE.MeshBasicMaterial();

    const orbitPathData = ORBIT_GROUPS;

    const orbitLines = orbitPathData.map((path) => {
      const points = [];
      for (let index = 0; index < 180; index += 1) {
        const angle = (index / 180) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * path.radius,
            Math.sin(angle) * path.radius,
            0,
          ),
        );
      }

      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: path.color,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      sculpture.add(line);
      return {
        line,
        revealOrder: path.revealOrder,
        targetOpacity: path.opacity,
      };
    });

    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const interactionPointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const orbiters = [];
    const clickTargets = [];
    const workingPosition = new THREE.Vector3();
    let hoveredInstanceId = null;
    let centralRig = null;

    const resizeModel = () => {
      const width = Math.max(modelHost.clientWidth, 1);
      const height = Math.max(modelHost.clientHeight, 1);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 600 ? 1.35 : 1.7));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 0.76 ? 16.2 : camera.aspect < 1.05 ? 14.6 : 13.6;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resizeModel);
    resizeObserver.observe(modelHost);
    resizeModel();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        sceneVisible = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(modelHost);

    const pickInteraction = (event) => {
      const bounds = modelHost.getBoundingClientRect();
      interactionPointer.set(
        THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(-((event.clientY - bounds.top) / bounds.height) * 2 + 1, -1, 1),
      );
      sculpture.updateMatrixWorld(true);
      raycaster.setFromCamera(interactionPointer, camera);

      return raycaster.intersectObjects(clickTargets, false)[0]?.object.userData.selection ?? null;
    };

    const handlePointerMove = (event) => {
      if (!shouldReduceMotion) {
        const bounds = modelHost.getBoundingClientRect();
        pointerTarget.set(
          THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1),
          THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1),
        );
      }

      const hoveredSelection = sceneReady ? pickInteraction(event) : null;
      hoveredInstanceId = hoveredSelection?.instanceId ?? null;
      modelHost.classList.toggle("is-model-hovered", Boolean(hoveredSelection));
    };

    const handleModelClick = (event) => {
      if (!sceneReady) {
        return;
      }

      const nextSelection = pickInteraction(event);
      if (!nextSelection) {
        return;
      }

      setSelection(nextSelection);
      setIsGuideOpen(false);
    };

    const resetPointer = () => {
      pointerTarget.set(0, 0);
      hoveredInstanceId = null;
      modelHost.classList.remove("is-model-hovered");
    };

    modelHost.addEventListener("pointermove", handlePointerMove);
    modelHost.addEventListener("pointerleave", resetPointer);
    modelHost.addEventListener("click", handleModelClick);

    const updateScene = (delta, staticFrame = false) => {
      if (!centralRig) {
        return;
      }

      if (!staticFrame) {
        elapsed += delta;
      }

      const centralReveal = staticFrame
        ? 1
        : easeOutQuint(THREE.MathUtils.clamp(elapsed / 1.45, 0, 1));
      const pointerDamping = 1 - Math.exp(-delta * 4.8);

      pointerCurrent.lerp(pointerTarget, staticFrame ? 1 : pointerDamping);

      centralRig.scale.setScalar(THREE.MathUtils.lerp(0.78, 1, centralReveal));
      centralRig.position.y = THREE.MathUtils.lerp(-0.18, 0, centralReveal);
      centralRig.rotation.y =
        JEFF_FRONT_ANGLE + (staticFrame ? 0 : pointerCurrent.x * 0.07);
      centralRig.rotation.x = staticFrame ? 0 : -pointerCurrent.y * 0.035;

      orbitLines.forEach(({ line, revealOrder, targetOpacity }) => {
        const lineReveal = staticFrame
          ? 1
          : easeOutQuint(
            THREE.MathUtils.clamp((elapsed - 0.28 - revealOrder * 0.12) / 1.35, 0, 1),
          );
        line.material.opacity = targetOpacity * lineReveal;
      });

      orbiters.forEach((orbiter) => {
        const path = orbitPathData[orbiter.config.path];
        const reveal = staticFrame
          ? 1
          : easeOutQuint(
            THREE.MathUtils.clamp(
              (
                elapsed -
                0.46 -
                path.revealOrder * 0.18 -
                orbiter.config.modelIndex * 0.07
              ) / 1.08,
              0,
              1,
            ),
          );
        const orbitElapsed = staticFrame ? 0 : elapsed;
        const angle = orbiter.config.phase + orbitElapsed * path.speed;

        workingPosition
          .set(
            Math.cos(angle) * path.radius,
            Math.sin(angle) * path.radius,
            Math.sin(angle + path.depthPhase) * path.depth,
          );

        orbiter.anchor.position.copy(workingPosition);
        const hoverTarget = hoveredInstanceId === orbiter.config.instanceId ? 1 : 0;
        const selectedTarget =
          selectionRef.current?.instanceId === orbiter.config.instanceId ? 1 : 0;
        const interactionDamping = staticFrame ? 1 : 1 - Math.exp(-delta * 10);

        orbiter.hoverAmount = THREE.MathUtils.lerp(
          orbiter.hoverAmount,
          hoverTarget,
          interactionDamping,
        );
        orbiter.selectedAmount = THREE.MathUtils.lerp(
          orbiter.selectedAmount,
          selectedTarget,
          interactionDamping,
        );
        orbiter.anchor.scale.setScalar(
          Math.max(
            0.001,
            reveal * (1 + orbiter.hoverAmount * 0.07 + orbiter.selectedAmount * 0.11),
          ),
        );
        orbiter.spinner.rotation.y = orbiter.config.front + orbitElapsed * orbiter.config.spin;
      });
    };

    const animate = (frameTime) => {
      if (disposed) {
        return;
      }

      animationFrame = window.requestAnimationFrame(animate);

      if (!sceneReady || !sceneVisible || document.hidden) {
        lastFrameTime = frameTime;
        return;
      }

      const delta = Math.min((frameTime - lastFrameTime) / 1000, 0.05);
      lastFrameTime = frameTime;
      updateScene(delta);
      renderer.render(scene, camera);
    };

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const loadModel = (url) =>
      new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });

    Promise.allSettled([
      loadModel(jeffModelUrl),
      ...ORBITING_MODELS.map((model) =>
        model.url
          ? loadModel(model.url)
          : Promise.resolve().then(() => ({ scene: model.create() })),
      ),
    ]).then((results) => {
      if (disposed) {
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            disposeObject(result.value.scene);
          }
        });
        return;
      }

      const [centralResult, ...orbiterResults] = results;
      if (centralResult.status !== "fulfilled") {
        orbiterResults.forEach((result) => {
          if (result.status === "fulfilled") {
            disposeObject(result.value.scene);
          }
        });
        setModelState("error");
        return;
      }

      centralRig = new THREE.Group();
      centralRig.add(centerAndScaleModel(centralResult.value.scene, 3.12));
      sculpture.add(centralRig);

      orbiterResults.forEach((result, index) => {
        if (result.status !== "fulfilled") {
          return;
        }

        const config = ORBITING_MODELS[index];
        replaceMaterials(result.value.scene, orbiterMaterial);

        const anchor = new THREE.Group();
        const spinner = new THREE.Group();
        spinner.rotation.x = config.tilt ?? 0;
        spinner.add(centerAndScaleModel(result.value.scene, config.size, "max"));
        anchor.add(spinner);

        const hitTarget = new THREE.Mesh(hitTargetGeometry, hitTargetMaterial);
        hitTarget.layers.set(1);
        hitTarget.scale.setScalar(Math.max(config.size * 0.46, 0.24));
        hitTarget.userData.selection = {
          interactionId: config.interactionId,
          instanceId: config.instanceId,
          modelName: config.name,
        };
        anchor.add(hitTarget);
        clickTargets.push(hitTarget);
        sculpture.add(anchor);

        orbiters.push({
          anchor,
          spinner,
          config,
          hoverAmount: 0,
          selectedAmount: 0,
        });
      });

      sceneReady = true;
      elapsed = 0;
      lastFrameTime = performance.now();
      updateScene(0, shouldReduceMotion);
      renderer.render(scene, camera);
      setModelState("ready");
    });

    if (!shouldReduceMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      modelHost.removeEventListener("pointermove", handlePointerMove);
      modelHost.removeEventListener("pointerleave", resetPointer);
      modelHost.removeEventListener("click", handleModelClick);
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            material?.map?.dispose();
            material?.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [shouldReduceMotion]);

  return (
    <>
      <div
        className={`orbital-model orbital-model--${modelState}`}
        ref={modelHostRef}
        role="group"
        aria-label="Interactive 3D portrait. Click any orbiting model to open its message."
      />
      {modelState === "ready" ? (
        <motion.button
          aria-controls="orbit-interaction-panel"
          aria-expanded={isGuideOpen}
          className="orbit-guide-button"
          onClick={() => {
            setSelection(null);
            setIsGuideOpen((isOpen) => !isOpen);
          }}
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.985 }}
        >
          <span className="orbit-guide-glyph" aria-hidden="true">
            <span />
          </span>
          <span className="orbit-guide-label">
            <strong>Explore the orbit</strong>
            <small>Click orbiting models</small>
          </span>
        </motion.button>
      ) : null}
      <AnimatePresence initial={false}>
        {isGuideOpen || activeMessage ? (
          <motion.aside
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label={isGuideOpen ? "How to explore the 3D models" : "Selected model message"}
            className={`orbit-panel${isGuideOpen ? " orbit-panel--guide" : ""}`}
            exit={{ opacity: 0, scale: 0.99, y: 8 }}
            id="orbit-interaction-panel"
            initial={{ opacity: 0, scale: 0.985, y: 14 }}
            key="orbit-panel"
            layout
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
              layout: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="orbit-panel-content"
                exit={{ opacity: 0, y: -4 }}
                initial={{ opacity: 0, y: 6 }}
                key={
                  isGuideOpen
                    ? "guide"
                    : `${selection.interactionId}-${selection.instanceId ?? "shortcut"}`
                }
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="orbit-panel-header">
                  <p className="orbit-panel-kicker">
                    {isGuideOpen
                      ? "Interactive sculpture"
                      : `${activeMessage.category} / ${selection.modelName}`}
                  </p>
                  <button
                    aria-label="Close orbit panel"
                    className="orbit-panel-close"
                    onClick={closePanel}
                    type="button"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20">
                      <path d="M4 4l12 12M16 4L4 16" />
                    </svg>
                  </button>
                </div>
                {isGuideOpen ? (
                  <>
                    <p className="orbit-guide-copy">
                      Click a sculpture as it passes. Each interest has its own note;
                      hockey and Marvel share one message each.
                    </p>
                    <div className="orbit-model-shortcuts" aria-label="Model message shortcuts">
                      {MODEL_MESSAGE_ORDER.map((interactionId) => (
                        <button
                          key={interactionId}
                          onClick={() => selectFromGuide(interactionId)}
                          type="button"
                        >
                          {MODEL_MESSAGES[interactionId].title}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="orbit-message-copy" aria-live="polite">
                    {activeMessage.message}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        ) : null}
      </AnimatePresence>
      {modelState === "loading" ? (
        <p className="orbital-model-status" aria-live="polite">
          <span aria-hidden="true" />
          Assembling three orbits
        </p>
      ) : null}
      {modelState === "error" ? (
        <p className="orbital-model-error">3D scene unavailable</p>
      ) : null}
    </>
  );
}

function createDumbbellModel() {
  const model = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.085, 1.7, 18),
    material,
  );
  handle.rotation.z = Math.PI / 2;
  model.add(handle);

  const plateGeometry = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 22);
  const outerPlateGeometry = new THREE.CylinderGeometry(0.27, 0.27, 0.18, 22);
  const collarGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 18);

  [
    { geometry: collarGeometry, x: -0.53 },
    { geometry: plateGeometry, x: -0.71 },
    { geometry: outerPlateGeometry, x: -0.91 },
    { geometry: collarGeometry, x: 0.53 },
    { geometry: plateGeometry, x: 0.71 },
    { geometry: outerPlateGeometry, x: 0.91 },
  ].forEach(({ geometry, x }) => {
    const piece = new THREE.Mesh(geometry, material);
    piece.position.x = x;
    piece.rotation.z = Math.PI / 2;
    model.add(piece);
  });

  return model;
}

function centerAndScaleModel(model, targetSize, fit = "height") {
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const wrapper = new THREE.Group();
  const referenceSize = fit === "max"
    ? Math.max(size.x, size.y, size.z)
    : size.y;

  model.position.sub(center);
  wrapper.scale.setScalar(targetSize / Math.max(referenceSize, 0.001));
  wrapper.add(model);

  return wrapper;
}

function replaceMaterials(model, material) {
  model.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((existingMaterial) => existingMaterial?.dispose());
    child.material = material;
    child.frustumCulled = false;
  });
}

function disposeObject(object) {
  object.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      material?.map?.dispose();
      material?.dispose();
    });
  });
}

function easeOutQuint(value) {
  return 1 - (1 - value) ** 5;
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand-link" href="#hero" aria-label="Jeffrey Dai portfolio home">Jeffrey Dai</a>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#professional-experience">Experience</a>
        <a href="#featured-projects">Projects</a>
        <a href="#competitive-robotics">Robotics</a>
        <a href="#about-leadership">About</a>
      </nav>
      <a className="resume-link" href="resume.pdf" download="Jeffrey_Dai_Engineering_Resume.pdf">Resume</a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <Reveal className="hero-copy">
        <p className="section-eyebrow">Computer Engineering / McGill</p>
        <h1 id="hero-title">Jeffrey Dai</h1>
        <p className="hero-subtitle">Building across software, robotics, and physical systems.</p>
        <div className="hero-actions" aria-label="Contact and profile links">
          <ArrowLink href="resume.pdf" download="Jeffrey_Dai_Engineering_Resume.pdf">Download Resume (PDF)</ArrowLink>
          <ArrowLink href="mailto:jeffrey.dai@mail.mcgill.ca">Email</ArrowLink>
          <ArrowLink href="https://github.com/Jeffrey-dai17">GitHub</ArrowLink>
          <ArrowLink href="https://www.linkedin.com/in/jeffrey-dai-3a9080319/">LinkedIn</ArrowLink>
        </div>
      </Reveal>
      <Reveal className="hero-image-block">
        <div className="image-stage">
          <OrbitalSculpture />
        </div>
      </Reveal>
    </section>
  );
}

function ProfessionalExperience() {
  return (
    <section className="page-section experience-section" id="professional-experience" aria-labelledby="professional-experience-title">
      <Reveal className="section-heading">
        <p className="section-eyebrow">Professional Experience</p>
        <h2 id="professional-experience-title">Canada Revenue Agency</h2>
      </Reveal>
      <Reveal className="feature-row" as="article" aria-label="CRA internship and part-time continuation">
        <div className="row-meta">
          <p className="experience-label">Internship + part-time continuation</p>
          <h3>Enterprise Fraud Management Information Technology Branch</h3>
          <div className="meta-chip-row" aria-label="Public experience keywords">
            <span>XML</span><span>Java</span><span>20 hours / week</span><span>Full-time McGill</span>
          </div>
        </div>
        <div className="row-copy">
          <p>At the CRA Enterprise Fraud Management Information Technology Branch, Jeffrey worked on mapping information between systems using XML and Java, contributing to enterprise-scale fraud-detection tooling.</p>
          <p>Following the four-month internship, Jeffrey continues with the CRA from August 29 through December 29 on a part-time schedule of 20 hours per week while completing a full-time Computer Engineering course load at McGill.</p>
        </div>
      </Reveal>
    </section>
  );
}

function FeaturedProjects() {
  return (
    <section className="page-section projects-section" id="featured-projects" aria-labelledby="projects-title">
      <Reveal className="section-heading">
        <p className="section-eyebrow">Featured Projects</p>
        <h2 id="projects-title">Software and hackathon builds</h2>
      </Reveal>
      <Reveal className="project-feature" as="article" aria-label="Dishly Recipe Match project">
        <div className="project-main">
          <p className="project-label">Lead project - CUhacking, 36 hours</p>
          <h3>Dishly Recipe Match</h3>
          <p className="project-role">Full-Stack Developer</p>
          <p>Full-stack AI recipe-matching app that parses natural-language cravings into dietary and nutrition filters, fetches normalized recipe results, and presents them in a swipeable deck.</p>
          <p>Implemented Express API routes, provider integrations, session-based deck persistence, recipe detail flows, and automated test coverage across unit, API, and Playwright E2E tests.</p>
          <ArrowLink href="https://github.com/Jeffrey-dai17/CU-Hack">View GitHub repository</ArrowLink>
        </div>
        <div className="stack-panel" aria-label="Dishly technology stack">
          {["React", "Node.js", "Express", "Gemini API", "Spoonacular API"].map((item) => <span key={item}>{item}</span>)}
        </div>
      </Reveal>

      <div className="subsection-grid">
        <section className="compact-block" aria-labelledby="hackathon-grid-title">
          <Reveal className="compact-heading">
            <p className="project-label">Hackathon grid</p>
            <h3 id="hackathon-grid-title">More 24-48 hour builds</h3>
          </Reveal>
          <div className="feed-list">
            {hackathonProjects.map((project) => (
              <Reveal className="feed-row" as="article" key={project.name}>
                <p className="project-context">{project.context}</p>
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                {project.href ? <a className="small-link" href={project.href}>GitHub</a> : null}
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="compact-block hardware-block" as="section" aria-labelledby="hardware-builds-title">
          <div className="compact-heading">
            <p className="project-label">Hardware builds</p>
            <h3 id="hardware-builds-title">Secondary engineering builds</h3>
          </div>
          <ul className="hardware-list">
            {hardwareBuilds.map((build) => <li key={build}>{build}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function CompetitiveRobotics() {
  return (
    <section className="page-section robotics-section" id="competitive-robotics" aria-labelledby="robotics-title">
      <Reveal className="section-heading">
        <p className="section-eyebrow">Competitive Robotics</p>
        <h2 id="robotics-title">FIRST Robotics Team 8729, &quot;Sparkling H2O&quot;</h2>
      </Reveal>
      <div className="robotics-layout">
        <Reveal className="feature-row robotics-main" as="article">
          <div className="row-meta">
            <p className="project-label">2022-2025</p>
            <h3>Competition execution under pressure</h3>
          </div>
          <div className="row-copy">
            <p>Jeffrey competed as a Drive Team Member and Mechanical Sub-team Member on FIRST Robotics Team 8729, contributing in a high-pressure team environment that reached two provincial finals and the 2023 World Championship.</p>
            <p>He also gained experience leading small sub-teams, pairing competition-day execution with hands-on engineering delivery.</p>
          </div>
        </Reveal>
        <aside className="results-list" aria-label="Robotics highlights">
          {roboticsHighlights.map((highlight) => <Reveal className="result-row" key={highlight}>{highlight}</Reveal>)}
        </aside>
      </div>
      <Reveal className="skill-strip" aria-label="Supporting mechanical skills">
        <p className="project-label">Supporting engineering skills</p>
        <div className="robotics-skill-list">
          {roboticsSkills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </Reveal>
    </section>
  );
}

function AboutLeadership() {
  return (
    <section className="page-section about-section" id="about-leadership" aria-labelledby="about-title">
      <Reveal className="section-heading">
        <p className="section-eyebrow">About Me & Leadership</p>
        <h2 id="about-title">Leadership, systems thinking, and builder habits</h2>
      </Reveal>
      <div className="about-grid">
        <Reveal className="leadership-block primary-leadership-block" as="article">
          <p className="project-label">2025-present</p>
          <h3>McHacks Experience Team Lead</h3>
          <p>At McGill's largest hackathon, Jeffrey leads experience work for an event with 700 participants across 1500+ applications.</p>
          <ul>
            <li>Led a team organizing and running workshops including intro to backend, intro to frontend, and adding AI chatbots to projects.</li>
            <li>Coordinated with companies including Athena AI and Gumloop on workshops, organized team socials, and helped review McHacks applications.</li>
          </ul>
        </Reveal>
        <Reveal className="leadership-block chem-block" as="article">
          <p className="project-label">2025-present</p>
          <h3>McGill Chem-E Car</h3>
          <p>Electrical sub-team member.</p>
          <div className="keyword-list" aria-label="Chem-E Car skills">
            {chemECarSkills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </Reveal>
      </div>
      <Reveal className="mindset-block" as="article">
        <p className="project-label">The Engineer's Mindset</p>
        <h3>Measured, iterative, and a little optimization-minded.</h3>
        <p>Outside class and projects, Jeffrey brings the same analytical habits to tracking fitness macronutrients with a data-driven approach and designing highly optimized, automated resource systems in Minecraft.</p>
      </Reveal>
    </section>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteHeader />
      <main>
        <Hero />
        <ProfessionalExperience />
        <FeaturedProjects />
        <CompetitiveRobotics />
        <AboutLeadership />
      </main>
    </MotionConfig>
  );
}

export default App;
