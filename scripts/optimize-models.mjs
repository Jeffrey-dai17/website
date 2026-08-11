import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { flatten, join, meshopt, prune, simplify, weld } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "src", "assets", "models");

const models = [
  {
    input: "jeff 3d.glb",
    output: "jeff-center.glb",
    ratio: 0.1,
    error: 0.003,
    preserveMaterials: true,
  },
  {
    input: "league_of_legends_-_nami_bust.glb",
    output: "nami-center.glb",
    ratio: 1,
    error: 0.004,
  },
  { input: "3d models/intrest/bmw_x3_m40i.glb", output: "interest-bmw.glb", ratio: 0.24, error: 0.004 },
  { input: "3d models/intrest/keyboard.glb", output: "interest-keyboard.glb", ratio: 1, error: 0.004 },
  { input: "3d models/intrest/pig.glb", output: "interest-pig.glb", ratio: 0.045, error: 0.008 },
  { input: "3d models/intrest/stylized_sushi.glb", output: "interest-sushi.glb", ratio: 1, error: 0.004 },
  { input: "3d models/intrest/volleyball.glb", output: "interest-volleyball.glb", ratio: 1, error: 0.004 },
  { input: "3d models/sens/timmy.glb", output: "tim-stutzle.glb", ratio: 0.04, error: 0.008 },
  { input: "3d models/sens/cuzzy 3d.glb", output: "cuzzy.glb", ratio: 0.04, error: 0.008 },
  { input: "3d models/sens/eklund 3d.glb", output: "eklund.glb", ratio: 0.04, error: 0.008 },
  { input: "3d models/sens/jake sanderson 3d.glb", output: "jake-sanderson.glb", ratio: 0.04, error: 0.008 },
  { input: "3d models/sens/linus ullmark 3d.glb", output: "linus-ullmark.glb", ratio: 0.04, error: 0.008 },
  { input: "3d models/sens/thomas chabot 3d.glb", output: "thomas-chabot.glb", ratio: 0.04, error: 0.008 },
  { input: "3d models/marvel 3d/captain_america.glb", output: "marvel-captain-america.glb", ratio: 1, error: 0.004 },
  { input: "3d models/marvel 3d/dead pool.glb", output: "marvel-deadpool.glb", ratio: 1, error: 0.004 },
  { input: "3d models/marvel 3d/iron_man_rig.glb", output: "marvel-iron-man.glb", ratio: 1, error: 0.004 },
  {
    input: "3d models/marvel 3d/spider-man_brand_new_day.glb",
    output: "marvel-spider-man.glb",
    ratio: 0.18,
    error: 0.005,
  },
  {
    input: "3d models/marvel 3d/venom__marvel_rivals.glb",
    output: "marvel-venom.glb",
    ratio: 0.7,
    error: 0.004,
  },
];

const requestedOutputs = new Set(process.argv.slice(2));
const selectedModels = requestedOutputs.size
  ? models.filter((model) => requestedOutputs.has(model.output))
  : models;

if (requestedOutputs.size && selectedModels.length !== requestedOutputs.size) {
  throw new Error("One or more requested output model names are not configured.");
}

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready, MeshoptSimplifier.ready]);

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

await mkdir(outputDirectory, { recursive: true });

for (const model of selectedModels) {
  const inputPath = path.join(projectRoot, model.input);
  const outputPath = path.join(outputDirectory, model.output);
  const inputSize = (await stat(inputPath)).size;
  const document = await io.read(inputPath);
  const before = countGeometry(document);

  stripAnimationData(document);
  if (!model.preserveMaterials) {
    stripSurfaceData(document);
  }

  const transforms = [
    prune(),
    flatten(),
    join({ keepNamed: false }),
    weld(),
  ];

  if (model.ratio < 1) {
    transforms.push(simplify({
      simplifier: MeshoptSimplifier,
      ratio: model.ratio,
      error: model.error,
    }));
  }

  transforms.push(
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );

  await document.transform(...transforms);
  await io.write(outputPath, document);

  const outputSize = (await stat(outputPath)).size;
  const after = countGeometry(document);
  console.log(
    [
      model.output,
      `${formatNumber(before.triangles)} -> ${formatNumber(after.triangles)} triangles`,
      `${formatSize(inputSize)} -> ${formatSize(outputSize)}`,
    ].join(" | "),
  );
}

function stripAnimationData(document) {
  for (const animation of document.getRoot().listAnimations()) {
    for (const channel of animation.listChannels()) {
      channel.dispose();
    }
    for (const sampler of animation.listSamplers()) {
      sampler.dispose();
    }
    animation.dispose();
  }
}

function stripSurfaceData(document) {
  for (const mesh of document.getRoot().listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      primitive.setMaterial(null);
      for (const semantic of primitive.listSemantics()) {
        if (
          semantic === "TANGENT" ||
          semantic.startsWith("TEXCOORD_") ||
          semantic.startsWith("COLOR_")
        ) {
          primitive.setAttribute(semantic, null);
        }
      }
    }
  }
}

function countGeometry(document) {
  let vertices = 0;
  let triangles = 0;

  for (const mesh of document.getRoot().listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      const position = primitive.getAttribute("POSITION");
      const indices = primitive.getIndices();
      vertices += position?.getCount() ?? 0;
      triangles += Math.floor((indices?.getCount() ?? position?.getCount() ?? 0) / 3);
    }
  }

  return { vertices, triangles };
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-CA").format(value);
}

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
