import { fileURLToPath } from "node:url";
import tailwind from "@tailwindcss/vite";
import { defu } from "defu";
import { normalize } from "pathe";
import type { UnpluginOptions } from "unplugin";
import { createUnplugin } from "unplugin";
import type { Options as AutoImportOptions } from "unplugin-auto-import/types";
import type { Options as ComponentsOptions } from "unplugin-vue-components/types";

import type * as ui from "#build/ui";

import { defaultOptions, getDefaultUIConfig } from "./defaults";
import type { ModuleOptions } from "./module";
import AppConfigPlugin from "./plugins/app-config";
import AutoImportPlugin from "./plugins/auto-imports";
import ComponentImportPlugin from "./plugins/components";
import NuxtEnvironmentPlugin from "./plugins/nuxt-environment";
import PluginsPlugin from "./plugins/plugins";
import type { TVConfig } from "./runtime/types/tv";
import type icons from "./theme/icons";

type AppConfigUI = {
	icons?: Partial<typeof icons>;
} & TVConfig<typeof ui>;

export interface VM3Options extends Omit<ModuleOptions, "fonts" | "colorMode"> {
	dts?: boolean;
	ui?: AppConfigUI;
	colorMode?: boolean;
	autoImport?: Partial<AutoImportOptions>;
	components?: Partial<ComponentsOptions>;
	inertia?: boolean;
}

export const runtimeDir = normalize(
	fileURLToPath(new URL("./runtime", import.meta.url)),
);

export const VM3Plugin = createUnplugin<VM3Options | undefined>(
	(_options = {}, meta) => {
		const options = defu(_options, { fonts: false }, defaultOptions);
		options.theme = options.theme || {};

		const appConfig = defu(
			{ ui: options.ui, colorMode: options.colorMode },
			{ ui: getDefaultUIConfig() },
		);

		return [
			NuxtEnvironmentPlugin(options),
			ComponentImportPlugin(options, meta),
			AutoImportPlugin(options, meta),
			tailwind(),
			PluginsPlugin(options),
			AppConfigPlugin(options, appConfig),
			<UnpluginOptions>{
				name: "vm3:plugins-duplication-detection",
				vite: {
					configResolved(config) {
						const plugins = config.plugins || [];

						if (
							plugins.filter((i) => i.name === "unplugin-auto-import").length >
							1
						) {
							throw new Error(
								"[VM3]  Multiple instances of `unplugin-auto-import` detected. VM3 includes `unplugin-auto-import` already, and you can configure it using `autoImport` option in VM3 module options.",
							);
						}

						if (
							plugins.filter((i) => i.name === "unplugin-vue-components")
								.length > 1
						) {
							throw new Error(
								"[VM3] Multiple instances of `unplugin-vue-components` detected. VM3 includes `unplugin-vue-components` already, and you can configure it using `components` option in VM3 module options.",
							);
						}
					},
				},
			},
		].flat(1) as UnpluginOptions[];
	},
);
