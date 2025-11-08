import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
  hasNuxtModule,
  installModule,
} from "@nuxt/kit";
import defu from "defu";
import type { HookResult } from "nuxt/schema";
import { name, version } from "../package.json";
import { defaultOptions, getDefaultUIConfig } from "./defaults";
import { addTemplates } from "./templates";

export type * from "./runtime/types";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | (string & {});

export interface ModuleOptions {
  prefix?: string;
  fonts?: boolean;
  theme?: {
    transitions?: boolean;
    defaultVariants?: {
      size?: Size;
    };
  };
  colorMode?: boolean;
  experimental?: {
    componentDetection?: boolean
  }
}


declare module '#app' {
  interface RuntimeNuxtHooks {
    'dashboard:search:toggle': () => HookResult
    'dashboard:sidebar:toggle': () => HookResult
    'dashboard:sidebar:collapse': (value: boolean) => HookResult
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "ui",
    compatibility: {
      nuxt: ">=4.0.0",
    },
  },
  defaults: defaultOptions,
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    options.theme = options.theme || {};

    nuxt.options.ui = options;

    nuxt.options.alias["#ui"] = resolve("./runtime");

    nuxt.options.appConfig.ui = defu(
      nuxt.options.appConfig.ui || {},
      getDefaultUIConfig()
    );

    // Isolate root node from portaled componentes
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {};
    nuxt.options.app.rootAttrs.class = [
      nuxt.options.app.rootAttrs.class,
      "isolate",
    ]
      .filter(Boolean)
      .join(" ");

    nuxt.hook("vite:extend", async ({ config }) => {
      const plugin = await import("@tailwindcss/vite").then((r) => r.default);
      config.plugins ||= [];
      config.plugins.push(plugin());
    });

    if (nuxt.options.builder !== "@nuxt/vite-builder") {
      nuxt.options.postcss.plugins["@tailwindcss/postcss"];
    }

    async function registerModule(
      name: string,
      key: string,
      options: Record<string, any>
    ) {
      if (!hasNuxtModule(name)) {
        await installModule(name, defu((nuxt.options as any)[key], options));
      } else {
        (nuxt.options as any)[key] = defu((nuxt.options as any)[key], options);
      }
    }

    await registerModule("@nuxt/icon", "icon", {
      cssLayer: "components",
    });

    if (options.fonts) {
      await registerModule("@nuxt/fonts", "fonts", {
        defaults: {
          weights: [400, 500, 600, 700],
        },
      });
    }

    if (options.colorMode) {
      await registerModule("@nuxtjs/color-mode", "colorMode", {
        classSuffix: "",
        disableTransition: true,
      });
    }

    addComponentsDir({
      path: resolve("./runtime/components"),
      pathPrefix: false,
      prefix: options.prefix,
      ignore: ["color-mode/**", "content/**", "prose/**"],
    });

    addImportsDir(resolve('./runtime/composables'))

    addTemplates(options, nuxt, resolve)
  },
});
