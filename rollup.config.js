import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'cjs',
    exports: 'auto'
  },
  external: ['react'],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs()
  ]
}
