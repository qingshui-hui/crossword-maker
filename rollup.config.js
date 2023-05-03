import nodeResolve from 'rollup-plugin-node-resolve';
import summary from "rollup-plugin-summary"; // not neccessary
import typescript from "@rollup/plugin-typescript";
import { terser } from 'rollup-plugin-terser';

const input = ["src/index.ts"];

export default [
  {
    input,
    plugins: [
      nodeResolve(), 
      summary(), 
      typescript(),
      // https://stackoverflow.com/a/66527215/20308611
      terser()
    ],
    output: [
      {
        dir: "dist",
        sourcemap: true,
        format: "es", // default
      },
    ],
    // external: ["lodash-es"],
  },
];
