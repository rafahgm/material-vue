import MagicString from "magic-string";
import { resolvePathSync } from "mlly";
import { normalize } from "pathe";
import type { UnpluginOptions } from "unplugin";
import { runtimeDir, type VM3Options } from "../unplugin";

export default function NuxtEnvironmentPlugin(
	options: VM3Options,
): UnpluginOptions {
	const stubPath = resolvePathSync(
		options.inertia ? "../runtime/inertia/stubs" : "../runtime/vue/stubs",
		{ extensions: [".ts", ".mjs", ".js"], url: import.meta.url },
	);

	return {
		name: "vm3",
		enforce: "pre",
		resolveId(id) {
			if (id === "#imports") {
				return stubPath;
			}
		},
		transformInclude(id) {
			return normalize(id).includes(runtimeDir);
		},
		transform(code) {
			if (code.includes("import.meta.client")) {
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
	};
}
