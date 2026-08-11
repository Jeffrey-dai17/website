import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { meshopt, prune, simplify, weld } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "src", "assets", "models");

const models = [
  {
    input: "spider-man_brand_new_day.glb",
    output: "spider-man-center.glb",
    ratio: 0.24,
    error: 0.004,
  },
  { input: "timmy.glb", output: "tim-stutzle.glb", ratio: 0.075, error: 0.006 },
  { input: "cuzzy 3d.glb", output: "cuzzy.glb", ratio: 0.075, error: 0.006 },
  { input: "eklund 3d.glb", output: "eklund.glb", ratio: 0.075, error: 0.006 },
  { input: "jake sanderson 3d.glb", output: "jake-sanderson.glb", ratio: 0.075, error: 0.006 },
  { input: "linus ullmark 3d.glb", output: "linus-ullmark.glb", ratio: 0.075, error: 0.006 },
  { input: "thomas chabot 3d.glb", output: "thomas-chabot.glb", ratio: 0.075, error: 0.006 },
];

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready, MeshoptSimplifier.ready]);

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

await mkdir(outputDirectory, { recursive: true });

for (const model of models) {
  const inputPath = path.join(projectRoot, model.input);
  const outputPath = path.join(outputDirectory, model.output);
  const inputSize = (await stat(inputPath)).size;
  const document = await io.read(inputPath);
  const before = countGeometry(document);

  stripSurfaceData(document);

  await document.transform(
    prune(),
    weld(),
    simplify({
      simplifier: MeshoptSimplifier,
      ratio: model.ratio,
      error: model.error,
    }),
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );

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

function stripSurfaceData(document) {
  for (const mesh of document.getRoot().listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      primitive.setMaterial(null);
      primitive.setAttribute("TANGENT", null);
      primitive.setAttribute("TEXCOORD_0", null);
      primitive.setAttribute("TEXCOORD_1", null);
      primitive.setAttribute("COLOR_0", null);
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
