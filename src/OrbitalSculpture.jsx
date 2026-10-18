import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

const SCULPTURE_PALETTE = {
  carbon: 0x171512,
  porcelain: 0xf2eadc,
  porcelainHover: 0xfff8ee,
  quietPorcelain: 0xa99a87,
  verdigris: 0xad3326,
  verdigrisLight: 0xff8a80,
  verdigrisEmissive: 0x36100c,
  terracotta: 0xad3326,
};

const MODEL_MESSAGES = {
  "interest-bmw": {
    orbit: "Outer orbit",
    category: "Interest",
    title: "BMW X3",
    message: "The car I first learned how to drive in.",
  },
  "interest-keyboard": {
    orbit: "Outer orbit",
    category: "Interest",
    title: "Keyboard",
    message: "Most underrated part of my setup. A good keyboard makes typing so much more enjoyable.",
  },
  "interest-pig": {
    orbit: "Outer orbit",
    category: "Interest",
    title: "Pig",
    message: "Zodiac animal, but I've adopted it to be a good luck charm.",
  },
  "interest-sushi": {
    orbit: "Outer orbit",
    category: "Interest",
    title: "Sushi",
    message: "Favourite food to get whether alone or with friends.",
  },
  "interest-volleyball": {
    orbit: "Outer orbit",
    category: "Interest",
    title: "Volleyball",
    message: "One of my favourite pastimes I can do with friends.",
  },
  "interest-dumbbell": {
    orbit: "Outer orbit",
    category: "Interest",
    title: "Dumbbell",
    message: "Staying in good shape helps with my mental health, keeping me more on track while working.",
  },
  "hockey-stutzle": {
    orbit: "Middle orbit",
    category: "Hockey",
    title: "Tim Stützle",
    message: "Favourite player and the first jersey I ever owned.",
  },
  "hockey-cozens": {
    orbit: "Middle orbit",
    category: "Hockey",
    title: "Dylan Cozens",
    message: "To me, one of the most underrated players in the league.",
  },
  "hockey-eklund": {
    orbit: "Middle orbit",
    category: "Hockey",
    title: "William Eklund",
    message: "Going to be better than Tkachuk.",
  },
  "hockey-sanderson": {
    orbit: "Middle orbit",
    category: "Hockey",
    title: "Jake Sanderson",
    message: "Another favourite—so fun to watch. I also own his jersey.",
  },
  "hockey-ullmark": {
    orbit: "Middle orbit",
    category: "Hockey",
    title: "Linus Ullmark",
    message: "The team isn't the same when Ullmark isn't playing.",
  },
  "hockey-chabot": {
    orbit: "Middle orbit",
    category: "Hockey",
    title: "Thomas Chabot",
    message: "The first signed jersey I ever owned.",
  },
  marvel: {
    orbit: "Inner orbit",
    category: "Marvel",
    title: "Marvel characters",
    message: "Captain America, Deadpool, Iron Man, Spider-Man, and Venom share the inner orbit.",
  },
};

const MODEL_MESSAGE_ORDER = [
  "interest-bmw",
  "interest-keyboard",
  "interest-pig",
  "interest-sushi",
  "interest-volleyball",
  "interest-dumbbell",
  "hockey-stutzle",
  "hockey-cozens",
  "hockey-eklund",
  "hockey-sanderson",
  "hockey-ullmark",
  "hockey-chabot",
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
    color: 0xad3326,
    opacity: 0.34,
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
    radius: 2.4,
    depth: 0.42,
    depthPhase: 1.15,
    revealOrder: 1,
    speed: -0.17,
    color: 0xf4efe6,
    opacity: 0.22,
    phaseOffset: 0.52,
    models: [
      { name: "Tim Stützle", interactionId: "hockey-stutzle", url: timStutzleModelUrl, size: 0.74, spin: 0.42, front: -1.5 },
      { name: "Dylan Cozens", interactionId: "hockey-cozens", url: cuzzyModelUrl, size: 0.71, spin: -0.39, front: -1.5 },
      { name: "William Eklund", interactionId: "hockey-eklund", url: eklundModelUrl, size: 0.73, spin: 0.37, front: -1.5 },
      { name: "Jake Sanderson", interactionId: "hockey-sanderson", url: jakeSandersonModelUrl, size: 0.72, spin: -0.4, front: -1.5 },
      { name: "Linus Ullmark", interactionId: "hockey-ullmark", url: linusUllmarkModelUrl, size: 0.75, spin: 0.41, front: -1.5 },
      { name: "Thomas Chabot", interactionId: "hockey-chabot", url: thomasChabotModelUrl, size: 0.72, spin: -0.36, front: -1.5 },
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
    color: SCULPTURE_PALETTE.terracotta,
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

const GUIDE_SELECTIONS = Object.fromEntries(
  MODEL_MESSAGE_ORDER.map((interactionId) => {
    const model = ORBITING_MODELS.find(
      (orbiter) => orbiter.interactionId === interactionId,
    );

    return [interactionId, model];
  }),
);

function OrbitalSculpture() {
  const shouldReduceMotion = useReducedMotion();
  const modelHostRef = useRef(null);
  const selectionRef = useRef(null);
  const renderStaticSceneRef = useRef(null);
  const [modelState, setModelState] = useState("loading");
  const [selection, setSelection] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const activeMessage = selection
    ? MODEL_MESSAGES[selection.interactionId]
    : null;

  useEffect(() => {
    selectionRef.current = selection;

    if (shouldReduceMotion) {
      renderStaticSceneRef.current?.();
    }
  }, [selection, shouldReduceMotion]);

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
    const model = GUIDE_SELECTIONS[interactionId];

    setSelection({
      interactionId,
      instanceId: model?.instanceId ?? null,
      modelName: model?.name ?? MODEL_MESSAGES[interactionId].title,
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
    scene.fog = new THREE.FogExp2(SCULPTURE_PALETTE.carbon, 0.03);

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

    const rimLight = new THREE.DirectionalLight(SCULPTURE_PALETTE.terracotta, 2.1);
    rimLight.position.set(-3.8, 3.2, -5.5);
    scene.add(rimLight);

    const warmRimLight = new THREE.PointLight(0xd2a94c, 8.5, 12, 2);
    warmRimLight.position.set(3.4, -1.8, 2.6);
    scene.add(warmRimLight);

    const porcelainColor = new THREE.Color(SCULPTURE_PALETTE.porcelain);
    const porcelainHoverColor = new THREE.Color(SCULPTURE_PALETTE.porcelainHover);
    const quietPorcelainColor = new THREE.Color(SCULPTURE_PALETTE.quietPorcelain);
    const selectedColor = new THREE.Color(SCULPTURE_PALETTE.verdigris);
    const selectedEmissiveColor = new THREE.Color(SCULPTURE_PALETTE.verdigrisEmissive);
    const workingMaterialColor = new THREE.Color();
    const hitTargetGeometry = new THREE.SphereGeometry(1, 10, 8);
    const hitTargetMaterial = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: false,
    });

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

      if (shouldReduceMotion) {
        renderStaticSceneRef.current?.();
      }
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

      setSelection((currentSelection) =>
        currentSelection?.instanceId === nextSelection.instanceId
          ? null
          : nextSelection,
      );
      setIsGuideOpen(false);
    };

    const resetPointer = () => {
      pointerTarget.set(0, 0);
      hoveredInstanceId = null;

      if (shouldReduceMotion) {
        renderStaticSceneRef.current?.();
      }
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

        const hoverTarget = hoveredInstanceId === orbiter.config.instanceId ? 1 : 0;
        const selectedTarget =
          selectionRef.current?.instanceId === orbiter.config.instanceId ? 1 : 0;
        const quietTarget =
          selectionRef.current?.instanceId && !selectedTarget ? 1 : 0;
        const interactionDamping = staticFrame ? 1 : 1 - Math.exp(-delta * 10);
        const selectionDamping = staticFrame ? 1 : 1 - Math.exp(-delta * 7.2);

        if (Boolean(selectedTarget) !== orbiter.isSelected) {
          orbiter.isSelected = Boolean(selectedTarget);
          orbiter.activationAmount = selectedTarget ? 1 : 0;
        }

        orbiter.hoverAmount = THREE.MathUtils.lerp(
          orbiter.hoverAmount,
          hoverTarget,
          interactionDamping,
        );
        orbiter.selectedAmount = THREE.MathUtils.lerp(
          orbiter.selectedAmount,
          selectedTarget,
          selectionDamping,
        );
        orbiter.quietAmount = THREE.MathUtils.lerp(
          orbiter.quietAmount,
          quietTarget,
          selectionDamping,
        );

        if (staticFrame) {
          orbiter.activationAmount = 0;
        } else {
          orbiter.activationAmount = Math.max(
            0,
            orbiter.activationAmount - delta * 1.55,
          );
        }

        const selectedEase = THREE.MathUtils.smoothstep(
          orbiter.selectedAmount,
          0,
          1,
        );
        const activationProgress = 1 - orbiter.activationAmount;
        const activationPulse =
          Math.sin(activationProgress * Math.PI) * orbiter.activationAmount;
        const hoverScale = orbiter.hoverAmount * (selectedTarget ? 0.025 : 0.065);

        orbiter.anchor.position.copy(workingPosition);
        orbiter.anchor.position.z += selectedEase * 0.22;
        orbiter.anchor.scale.setScalar(
          Math.max(
            0.001,
            reveal * (1 + hoverScale + selectedEase * 0.145 + activationPulse * 0.035),
          ),
        );

        if (!staticFrame) {
          orbiter.spinAngle +=
            delta *
            orbiter.config.spin *
            THREE.MathUtils.lerp(1, 0.2, selectedEase);
        }

        orbiter.spinner.rotation.y =
          orbiter.config.front +
          orbiter.spinAngle +
          (
            staticFrame
              ? 0
              : Math.sin(elapsed * 0.9 + orbiter.config.phase) * 0.045 * selectedEase
          );

        workingMaterialColor
          .copy(porcelainColor)
          .lerp(quietPorcelainColor, orbiter.quietAmount * 0.38)
          .lerp(
            porcelainHoverColor,
            orbiter.hoverAmount * 0.34 * (1 - selectedEase),
          )
          .lerp(selectedColor, selectedEase);

        orbiter.material.color.copy(workingMaterialColor);
        orbiter.material.emissive.copy(selectedEmissiveColor);
        orbiter.material.emissiveIntensity = selectedEase * 0.32;
        orbiter.material.metalness = THREE.MathUtils.lerp(0.04, 0.18, selectedEase);
        orbiter.material.roughness = THREE.MathUtils.lerp(0.52, 0.34, selectedEase);

        orbiter.halo.group.visible =
          selectedEase > 0.002 || orbiter.activationAmount > 0.002;
        orbiter.halo.group.scale.setScalar(0.9 + selectedEase * 0.1);
        orbiter.halo.ring.material.opacity = selectedEase * 0.48;
        orbiter.halo.arc.material.opacity = selectedEase * 0.92;
        orbiter.halo.pulse.material.opacity = activationPulse * 0.72;
        orbiter.halo.pulse.scale.setScalar(1 + activationProgress * 0.42);

        if (!staticFrame) {
          orbiter.halo.arc.rotation.z += delta * 0.28 * selectedEase;
          orbiter.halo.ring.rotation.z -= delta * 0.08 * selectedEase;
        }
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
        const material = new THREE.MeshStandardMaterial({
          color: SCULPTURE_PALETTE.porcelain,
          emissive: SCULPTURE_PALETTE.verdigrisEmissive,
          emissiveIntensity: 0,
          metalness: 0.04,
          roughness: 0.52,
        });
        replaceMaterials(result.value.scene, material);

        const anchor = new THREE.Group();
        const spinner = new THREE.Group();
        spinner.rotation.x = config.tilt ?? 0;
        spinner.add(centerAndScaleModel(result.value.scene, config.size, "max"));
        anchor.add(spinner);

        const halo = createSelectionHalo(
          config.size * 0.7,
          SCULPTURE_PALETTE.verdigrisLight,
        );
        halo.group.position.z = config.size * 0.12;
        anchor.add(halo.group);

        const hitTarget = new THREE.Mesh(hitTargetGeometry, hitTargetMaterial);
        hitTarget.layers.set(1);
        hitTarget.scale.setScalar(Math.max(config.size * 0.58, 0.31));
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
          halo,
          material,
          spinAngle: 0,
          hoverAmount: 0,
          selectedAmount: 0,
          quietAmount: 0,
          activationAmount: 0,
          isSelected: false,
        });
      });

      sceneReady = true;
      elapsed = 0;
      lastFrameTime = performance.now();
      updateScene(0, shouldReduceMotion);
      renderer.render(scene, camera);

      renderStaticSceneRef.current = () => {
        if (!disposed && sceneReady) {
          updateScene(0, true);
          renderer.render(scene, camera);
        }
      };
      setModelState("ready");
    });

    if (!shouldReduceMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      disposed = true;
      renderStaticSceneRef.current = null;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      modelHost.removeEventListener("pointermove", handlePointerMove);
      modelHost.removeEventListener("pointerleave", resetPointer);
      modelHost.removeEventListener("click", handleModelClick);
      scene.traverse((child) => {
        if (child.isMesh || child.isLine) {
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
        className={`orbital-model orbital-model--${modelState}${selection ? " has-selection" : ""}`}
        ref={modelHostRef}
        role="group"
        aria-label={
          selection
            ? `Interactive 3D portrait. ${selection.modelName} is selected.`
            : "Interactive 3D portrait. Click any orbiting model to select it and open its message."
        }
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
            aria-describedby={isGuideOpen ? undefined : "orbit-message-description"}
            aria-label={isGuideOpen ? "How to explore the 3D models" : undefined}
            aria-labelledby={isGuideOpen ? undefined : "orbit-message-title"}
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
                    {isGuideOpen ? (
                      "Interactive sculpture"
                    ) : (
                      <>
                        <span className="orbit-panel-selection-mark" aria-hidden="true" />
                        <span>{activeMessage.orbit}</span>
                        <span className="orbit-panel-separator" aria-hidden="true">/</span>
                        <span>{activeMessage.category}</span>
                      </>
                    )}
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
                  <div className="orbit-guide-body">
                    <p className="orbit-guide-copy">
                      Click a sculpture as it passes. The Ottawa Senators are my
                      favourite team, and every player in the hockey orbit has a story.
                      The Marvel characters share one note.
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
                  </div>
                ) : (
                  <div className="orbit-message-body" aria-live="polite">
                    <div className="orbit-message-heading">
                      <h2 id="orbit-message-title">{activeMessage.title}</h2>
                      <span aria-hidden="true" />
                    </div>
                    <div
                      aria-label={`About ${activeMessage.title}`}
                      className="orbit-message-scroll"
                      role="region"
                      tabIndex={0}
                    >
                      <p className="orbit-message-copy" id="orbit-message-description">
                        {activeMessage.message}
                      </p>
                    </div>
                  </div>
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

function createSelectionHalo(radius, color) {
  const group = new THREE.Group();
  group.visible = false;

  const circlePoints = (circleRadius, startAngle = 0, endAngle = TAU, segments = 96) =>
    Array.from({ length: segments + 1 }, (_, index) => {
      const angle =
        startAngle + ((endAngle - startAngle) * index) / segments;
      return new THREE.Vector3(
        Math.cos(angle) * circleRadius,
        Math.sin(angle) * circleRadius,
        0,
      );
    });

  const createLineMaterial = () =>
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });

  const ring = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(circlePoints(radius)),
    createLineMaterial(),
  );
  const arc = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      circlePoints(radius * 1.12, -0.34, 1.38, 38),
    ),
    createLineMaterial(),
  );
  const pulse = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(circlePoints(radius * 0.92)),
    createLineMaterial(),
  );

  ring.renderOrder = 10;
  arc.renderOrder = 10;
  pulse.renderOrder = 10;
  group.add(ring, arc, pulse);

  return { group, ring, arc, pulse };
}

function createDumbbellModel() {
  const model = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: SCULPTURE_PALETTE.porcelain });
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


export default OrbitalSculpture;
