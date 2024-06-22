import { Body } from 'matter-js';

declare module 'matter-js' {
  interface Body {
    ballNumber?: number;
  }
}