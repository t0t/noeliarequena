export default {
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    open: true
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehavior: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  },
  publicDir: '../public'
}
