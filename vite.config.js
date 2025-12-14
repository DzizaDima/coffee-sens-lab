import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { readdirSync, statSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Плагин для обработки SCSS файлов как точек входа
function scssEntryPlugin() {
  const wrapperFiles = new Set();
  
  return {
    name: 'scss-entry',
    buildStart(options) {
      const assetsDir = resolve(__dirname, 'assets');
      const files = readdirSync(assetsDir);
      
      files.forEach(file => {
        if (file.endsWith('.scss') && !file.startsWith('_')) {
          const wrapperPath = resolve(assetsDir, `.${file.replace('.scss', '.js')}`);
          
          // Создаем временный JS файл-обертку для SCSS
          if (!existsSync(wrapperPath)) {
            writeFileSync(wrapperPath, `import './${file}';\n`);
          }
          // Отслеживаем все обертки (даже если они уже существовали)
          wrapperFiles.add(wrapperPath);
        }
      });
    },
    generateBundle(options, bundle) {
      // Удаляем временные JS файлы из bundle
      Object.keys(bundle).forEach(key => {
        const chunk = bundle[key];
        if (chunk.type === 'chunk' && chunk.name && chunk.name.startsWith('.')) {
          delete bundle[key];
        }
      });
    },
    buildEnd() {
      // Удаляем временные обертки после сборки
      wrapperFiles.forEach(file => {
        try {
          if (existsSync(file)) {
            unlinkSync(file);
          }
        } catch (e) {
          // Игнорируем ошибки удаления
        }
      });
      wrapperFiles.clear();
    },
  };
}

// Получаем все JS и SCSS файлы из папки assets как точки входа
function getEntryPoints() {
  const assetsDir = resolve(__dirname, 'assets');
  const files = readdirSync(assetsDir);
  const entryPoints = {};
  
  files.forEach(file => {
    // Обрабатываем JS файлы (исключаем временные обертки для SCSS)
    if (file.endsWith('.js') && !file.includes('.min.') && !file.startsWith('.')) {
      const filePath = resolve(assetsDir, file);
      try {
        const stats = statSync(filePath);
        if (stats.isFile()) {
          const name = file.replace('.js', '');
          entryPoints[name] = filePath;
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    // Обрабатываем SCSS файлы через временные JS обертки
    if (file.endsWith('.scss') && !file.startsWith('_')) {
      const wrapperPath = resolve(assetsDir, `.${file.replace('.scss', '.js')}`);
      const scssPath = resolve(assetsDir, file);
      
      try {
        const stats = statSync(scssPath);
        if (stats.isFile()) {
          // Создаем временную обертку, если её нет
          if (!existsSync(wrapperPath)) {
            writeFileSync(wrapperPath, `import './${file}';\n`);
          }
          
          const name = file.replace('.scss', '');
          entryPoints[name] = wrapperPath;
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
  });
  
  return entryPoints;
}

export default defineConfig(({ mode }) => ({
  root: 'assets',
  plugins: [scssEntryPlugin()],
  build: {
    outDir: resolve(__dirname, 'assets'),
    emptyOutDir: false, // Не очищаем директорию, чтобы не удалить другие файлы (CSS, шрифты и т.д.)
    rollupOptions: {
      input: getEntryPoints(),
      output: {
        entryFileNames: (chunkInfo) => {
          // Не создаем JS файлы для временных оберток SCSS (они начинаются с точки)
          if (chunkInfo.name && chunkInfo.name.startsWith('.')) {
            // Возвращаем пустое имя, чтобы файл не создавался
            // Но Vite требует имя, поэтому используем специальный префикс
            return '.temp/[name].js';
          }
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // CSS файлы из SCSS сохраняем с тем же именем (без .scss расширения)
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            // Для entry CSS файлов (из SCSS) используем имя entry point
            // Vite автоматически связывает CSS с entry point
            return '[name].css';
          }
          return 'assets/[name]-[hash].[ext]';
        },
        format: 'es',
        preserveModules: false,
      },
    },
    target: 'es2020',
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'development',
  },
  resolve: {
    alias: {
      '@theme': resolve(__dirname, 'assets'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Глобальные переменные и миксины (если нужно)
        // additionalData: `@import "@/styles/variables.scss";`,
        charset: false,
      },
    },
    devSourcemap: mode === 'development',
  },
  server: {
    port: 3000,
    cors: true,
  },
}));

