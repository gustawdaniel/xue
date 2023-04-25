// @ts-ignore
import {ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions} from "vue";

// https://tailwindcss.com/docs/max-width

// max-w-0	max-width: 0rem; /* 0px */
// max-w-none	max-width: none;
// max-w-xs	max-width: 20rem; /* 320px */
// max-w-sm	max-width: 24rem; /* 384px */
// max-w-md	max-width: 28rem; /* 448px */
// max-w-lg	max-width: 32rem; /* 512px */
// max-w-xl	max-width: 36rem; /* 576px */
// max-w-2xl	max-width: 42rem; /* 672px */
// max-w-3xl	max-width: 48rem; /* 768px */
// max-w-4xl	max-width: 56rem; /* 896px */
// max-w-5xl	max-width: 64rem; /* 1024px */
// max-w-6xl	max-width: 72rem; /* 1152px */
// max-w-7xl	max-width: 80rem; /* 1280px */
// max-w-full	max-width: 100%;
// max-w-min	max-width: min-content;
// max-w-max	max-width: max-content;
// max-w-fit	max-width: fit-content;
// max-w-prose	max-width: 65ch;
// max-w-screen-sm	max-width: 640px;
// max-w-screen-md	max-width: 768px;
// max-w-screen-lg	max-width: 1024px;
// max-w-screen-xl	max-width: 1280px;
// max-w-screen-2xl	max-width: 1536px;

type TailwindWidth = 'max-w-0' |
    'max-w-none' |
    'max-w-xs' |
    'max-w-sm' |
    'max-w-md' |
    'max-w-lg' |
    'max-w-xl' |
    'max-w-2xl' |
    'max-w-3xl' |
    'max-w-4xl' |
    'max-w-5xl' |
    'max-w-6xl' |
    'max-w-7xl' |
    'max-w-full' |
    'max-w-min' |
    'max-w-max' |
    'max-w-fit' |
    'max-w-prose' |
    'max-w-screen-sm' |
    'max-w-screen-md' |
    'max-w-screen-lg' |
    'max-w-screen-xl' |
    'max-w-screen-2xl';

interface ModalState {
    component: DefineComponent<{}, {}, any, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin> | undefined,
    context: any
    settings: { width: TailwindWidth }
}

export const useModal = () => {
    return useState<ModalState>('modal', () => ({
        component: undefined,
        context: undefined,
        settings: {width: 'max-w-xl'}
    }))
}

export function closeModal() {
    const modal = useModal();
    modal.value.component = undefined
    modal.value.context = undefined
    modal.value.settings = {width: 'max-w-xl'}
}
