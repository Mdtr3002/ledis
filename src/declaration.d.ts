declare module '*.png';
declare module '*.jpg';
declare module '*.webp';
declare module '*.svg' {
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
