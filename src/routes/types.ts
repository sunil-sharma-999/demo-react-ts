export type IComponent = JSX.Element | string | undefined | null;

export type IRoute = {
  path: string;
  Component?: () => IComponent;
  index?: boolean;
  children: IRoute[];
};
