import { genSafeVariableName } from "knitwork";
import MagicString from "magic-string";
import { resolvePathSync } from "mlly";
import { join } from "pathe";
import { globSync } from "tinyglobby";
import type { UnpluginOptions } from "unplugin";
import type { VM3Options } from "../unplugin";
import { runtimeDir } from "../unplugin";

/**
 * This plugin provides the necessary transforms to allow loading the
 * Nuxt UI _Nuxt_ plugins in `src/runtime/plugins/` in a pure Vue environment.
 */
export default function PluginsPlugin(options: VM3Options) {
	const plugins = globSync(["**/*", "!*.d.ts"], {
		cwd: join(runtimeDir, "plugins"),
		absolute: true,
	});

	plugins.unshift(
		resolvePathSync("../runtime/vue/plugins/head", {
			extensions: [".ts", ".mjs", ".js"],
			url: import.meta.url,
		}),
	);
	if (options.colorMode) {
		plugins.push(
			resolvePathSync("../runtime/vue/plugins/color-mode", {
				extensions: [".ts", ".mjs", ".js"],
				url: import.meta.url,
			}),
		);
	}

	return {
		name: "vm3:plugins",
		enforce: "pre",
		resolveId(id) {
			if (id === "vm3/vue-plugin") {
				return "virtual:vm3-plugins";
			}
		},
		transform(code, id) {
			if (
				plugins.some((p) => id.startsWith(p)) &&
				code.includes("import.meta.client")
			) {
				const s = new MagicString(code);
				s.replaceAll("import.meta.client", "true");

				if (s.hasChanged()) {
					return {
						code: s.toString(),
						map: s.generateMap({ hires: true }),
					};
				}
			}
		},
		loadInclude: (id) => id === "virtual:vm3-plugins",
		load() {
			return `
        ${plugins.map((p) => `import ${genSafeVariableName(p)} from "${p}"`).join("\n")}
export default {
  install (app) {
${plugins.map((p) => `    app.use(${genSafeVariableName(p)})`).join("\n")}
  }
}
        `;
		},
		// Argument Vite specific configuration
		vite: {
			config() {
				return {
					// Opt-out Nuxt UI from Vite's pre-bundling,
					// as we need Vite's pipeline to resolve imports like `#imports`
					optimizeDeps: {
						exclude: ["vm3"],
					},
				};
			},
		},
	} satisfies UnpluginOptions;
}
