import type { IconifyIcon } from '@iconify/vue';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

export interface ComponentIconProps {
    icon?: string | IconifyIcon;
    leading?: boolean;
    leadingIcon?: string | IconifyIcon;
    trailing?: boolean;
    trailingIcon?: string | IconifyIcon;
    loading?: boolean;
    loadingIcon?: string | IconifyIcon;
}

export function useComponentIcon(componentProps: MaybeRefOrGetter<ComponentIconProps>) {
    const props = computed(() => toValue(componentProps));

    const isLeading = computed(() => (props.value.icon && props.value.leading) || (props.value.icon && !props.value.trailing) || (props.value.loading && !props.value.trailing) || !!props.value.leadingIcon);
    const isTrailing = computed(() => (props.value.icon && props.value.trailing) || (props.value.loading && props.value.trailing) || !!props.value.trailingIcon);

    const leadingIconName = computed(() => {
        if (props.value.loading) {
            return props.value.loadingIcon;
        }

        return props.value.leadingIcon || props.value.icon;
    });
    const trailingIconName = computed(() => {
        if (props.value.loading && !isLeading.value) {
            return props.value.loadingIcon;
        }

        return props.value.trailingIcon || props.value.icon;
    });

    return {
        isLeading,
        isTrailing,
        leadingIconName,
        trailingIconName
    };
}
