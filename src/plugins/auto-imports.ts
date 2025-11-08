import defu from "defu";
import { join } from "pathe";
import type { UnpluginContextMeta, UnpluginOptions } from "unplugin";
import AutoImport from "unplugin-auto-import";
import type { Options as AutoImportOptions } from "unplugin-auto-import/types";
import { runtimeDir, type VM3Options } from "../unplugin";

export default function AutoImportPlugin(
	options: VM3Options,
	meta: UnpluginContextMeta,
): UnpluginOptions {
	const pluginOptions = defu(options.autoImport, <AutoImportOptions>{
		dts: options.dts ?? true,
		dirs: [
			join(runtimeDir, "composables"),
			join(runtimeDir, "vue/composables"),
		],
	});

	return AutoImport.raw(pluginOptions, meta) as UnpluginOptions;
}
