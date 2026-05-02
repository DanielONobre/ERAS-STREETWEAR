// vite.config.js
import { defineConfig } from "file:///C:/ERAS-STREETWEAR/vertex-urban-style/node_modules/vite/dist/node/index.js";
import laravel from "file:///C:/ERAS-STREETWEAR/vertex-urban-style/node_modules/laravel-vite-plugin/dist/index.js";
import react from "file:///C:/ERAS-STREETWEAR/vertex-urban-style/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\ERAS-STREETWEAR\\vertex-urban-style";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.jsx"],
      refresh: true
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./resources/js"),
      "@components": path.resolve(__vite_injected_original_dirname, "./resources/js/Components"),
      "@pages": path.resolve(__vite_injected_original_dirname, "./resources/js/Pages"),
      "@layouts": path.resolve(__vite_injected_original_dirname, "./resources/js/Layouts"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "./resources/js/hooks"),
      "@lib": path.resolve(__vite_injected_original_dirname, "./resources/js/lib")
    }
  },
  server: {
    host: "localhost",
    port: 5173,
    hmr: {
      host: "localhost"
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Chunks por feature area — reduz bundle inicial
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/@inertiajs/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@headlessui/") || id.includes("node_modules/@heroicons/") || id.includes("node_modules/framer-motion/")) {
            return "vendor-ui";
          }
          if (id.includes("node_modules/@stripe/") || id.includes("node_modules/stripe")) {
            return "vendor-stripe";
          }
          if (id.includes("/Pages/Admin/")) {
            return "pages-admin";
          }
          if (id.includes("/Pages/Account/")) {
            return "pages-account";
          }
          if (id.includes("/Pages/Checkout/")) {
            return "pages-checkout";
          }
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxFUkFTLVNUUkVFVFdFQVJcXFxcdmVydGV4LXVyYmFuLXN0eWxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxFUkFTLVNUUkVFVFdFQVJcXFxcdmVydGV4LXVyYmFuLXN0eWxlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9FUkFTLVNUUkVFVFdFQVIvdmVydGV4LXVyYmFuLXN0eWxlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBsYXJhdmVsIGZyb20gJ2xhcmF2ZWwtdml0ZS1wbHVnaW4nO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgbGFyYXZlbCh7XHJcbiAgICAgICAgICAgIGlucHV0OiBbJ3Jlc291cmNlcy9jc3MvYXBwLmNzcycsICdyZXNvdXJjZXMvanMvYXBwLmpzeCddLFxyXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHJlYWN0KCksXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcmVzb3VyY2VzL2pzJyksXHJcbiAgICAgICAgICAgICdAY29tcG9uZW50cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3Jlc291cmNlcy9qcy9Db21wb25lbnRzJyksXHJcbiAgICAgICAgICAgICdAcGFnZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9yZXNvdXJjZXMvanMvUGFnZXMnKSxcclxuICAgICAgICAgICAgJ0BsYXlvdXRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcmVzb3VyY2VzL2pzL0xheW91dHMnKSxcclxuICAgICAgICAgICAgJ0Bob29rcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3Jlc291cmNlcy9qcy9ob29rcycpLFxyXG4gICAgICAgICAgICAnQGxpYic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3Jlc291cmNlcy9qcy9saWInKSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxyXG4gICAgICAgIHBvcnQ6IDUxNzMsXHJcbiAgICAgICAgaG1yOiB7XHJcbiAgICAgICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2F0Y2g6IHtcclxuICAgICAgICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA2MDAsXHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICAgIC8vIENodW5rcyBwb3IgZmVhdHVyZSBhcmVhIFx1MjAxNCByZWR1eiBidW5kbGUgaW5pY2lhbFxyXG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29yZSBSZWFjdCArIEluZXJ0aWEgXHUyMDE0IHNlbXByZSBjYXJyZWdhZG9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC8nKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LWRvbS8nKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0BpbmVydGlhanMvJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItcmVhY3QnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVUkgbGlicyBcdTIwMTQgY2FycmVnYWRvIGVtIHRvZGFzIGFzIHBcdTAwRTFnaW5hcyBjb20gY29tcG9uZW50ZXNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9AaGVhZGxlc3N1aS8nKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0BoZXJvaWNvbnMvJykgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uLycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXVpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN0cmlwZSBcdTIwMTQgc29tZW50ZSBuYSBwXHUwMEUxZ2luYSBkZSBjaGVja291dFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0BzdHJpcGUvJykgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9zdHJpcGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1zdHJpcGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUFx1MDBFMWdpbmFzIEFkbWluIFx1MjAxNCBjaHVuayBzZXBhcmFkbyBwYXJhIHJlZHV6aXIgYnVuZGxlIGRvIHN0b3JlZnJvbnRcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9QYWdlcy9BZG1pbi8nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3BhZ2VzLWFkbWluJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFBcdTAwRTFnaW5hcyBkZSBBY2NvdW50IFx1MjAxNCBjaHVuayBzZXBhcmFkb1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL1BhZ2VzL0FjY291bnQvJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdwYWdlcy1hY2NvdW50JztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrb3V0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvUGFnZXMvQ2hlY2tvdXQvJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdwYWdlcy1jaGVja291dCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVMsU0FBUyxvQkFBb0I7QUFDcFUsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ0osT0FBTyxDQUFDLHlCQUF5QixzQkFBc0I7QUFBQSxNQUN2RCxTQUFTO0FBQUEsSUFDYixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDN0MsZUFBZSxLQUFLLFFBQVEsa0NBQVcsMkJBQTJCO0FBQUEsTUFDbEUsVUFBVSxLQUFLLFFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsTUFDeEQsWUFBWSxLQUFLLFFBQVEsa0NBQVcsd0JBQXdCO0FBQUEsTUFDNUQsVUFBVSxLQUFLLFFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsTUFDeEQsUUFBUSxLQUFLLFFBQVEsa0NBQVcsb0JBQW9CO0FBQUEsSUFDeEQ7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDRCxNQUFNO0FBQUEsSUFDVjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0gsWUFBWTtBQUFBLElBQ2hCO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsdUJBQXVCO0FBQUEsSUFDdkIsZUFBZTtBQUFBLE1BQ1gsUUFBUTtBQUFBO0FBQUEsUUFFSixhQUFhLElBQUk7QUFFYixjQUFJLEdBQUcsU0FBUyxxQkFBcUIsS0FDakMsR0FBRyxTQUFTLHlCQUF5QixLQUNyQyxHQUFHLFNBQVMsMEJBQTBCLEdBQUc7QUFDekMsbUJBQU87QUFBQSxVQUNYO0FBR0EsY0FBSSxHQUFHLFNBQVMsMkJBQTJCLEtBQ3ZDLEdBQUcsU0FBUywwQkFBMEIsS0FDdEMsR0FBRyxTQUFTLDZCQUE2QixHQUFHO0FBQzVDLG1CQUFPO0FBQUEsVUFDWDtBQUdBLGNBQUksR0FBRyxTQUFTLHVCQUF1QixLQUNuQyxHQUFHLFNBQVMscUJBQXFCLEdBQUc7QUFDcEMsbUJBQU87QUFBQSxVQUNYO0FBR0EsY0FBSSxHQUFHLFNBQVMsZUFBZSxHQUFHO0FBQzlCLG1CQUFPO0FBQUEsVUFDWDtBQUdBLGNBQUksR0FBRyxTQUFTLGlCQUFpQixHQUFHO0FBQ2hDLG1CQUFPO0FBQUEsVUFDWDtBQUdBLGNBQUksR0FBRyxTQUFTLGtCQUFrQixHQUFHO0FBQ2pDLG1CQUFPO0FBQUEsVUFDWDtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
