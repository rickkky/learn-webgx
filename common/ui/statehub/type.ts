import { WIDGET_MAP } from './constant';

export type WidgetMap = typeof WIDGET_MAP;

export type WidgetMapKeys = keyof WidgetMap;

export type WidgetPropsRaw<T extends WidgetMapKeys> = InstanceType<
  WidgetMap[T]
>['$props'];

export type WidgetProps<T extends WidgetMapKeys> = Omit<
  WidgetPropsRaw<T>,
  'modelValue'
>;

export type WidgetValue<T extends WidgetMapKeys> =
  WidgetPropsRaw<T>['modelValue'];

export interface StatePayload<T extends WidgetMapKeys> {
  key: string;
  label: string;
  type: T;
  props: WidgetProps<T>;
  default: WidgetValue<T>;
}

export interface StatehubExposed<S> {
  observe: (callback: (state: S) => void) => void;
  state: S;
}

export interface StatehubProps {
  name: string;
  payloads: (
    | StatePayload<'checkbox'>
    | StatePayload<'select'>
    | StatePayload<'slider'>
    | StatePayload<'actioner'>
  )[];
}

export type StatehubAgentExposed = {
  createStatehub<S>(props: StatehubProps): {
    observe: (callback: (state: S) => void) => void;
    state: S;
  };
};
