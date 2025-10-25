import { createContext, useContext } from 'react';

type DrawerContextValue = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

const noop = (): void => {};

export const DrawerContext = createContext<DrawerContextValue>({
  openDrawer: noop,
  closeDrawer: noop,
});

export const useDrawer = (): DrawerContextValue => useContext(DrawerContext);
