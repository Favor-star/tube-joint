import { create } from "zustand";

export interface InitialStateProps {
  tubes: {
    id: string;
    position: [x: number, y: number, z: number];
    rotation: [x: number, y: number, z: number];
    height: number;
    width: number;
    thickness: number;
    length: number;
  }[];
  selectedId: string | null;
}

const initialState: InitialStateProps = {
  tubes: [
    {
      id: "1",
      position: [-2, 0, 0],
      rotation: [0, 0, 0],
      width: 2,
      height: 2,
      length: 6,
      thickness: 0.2,
    },
    {
      id: "2",
      position: [2, 0, 0] as [x: number, y: number, z: number],
      rotation: [0, 0, Math.PI / 2],
      width: 2,
      height: 2,
      length: 6,
      thickness: 0.2,
    },
  ],
  selectedId: null,
};
export type StoreState = InitialStateProps & {
  updateTube: (id: string, props: (typeof initialState)["tubes"][0]) => void;
  addTube: () => void;
  select: (id: string) => void;
};
export const useTubeStore = create<StoreState>((set, get) => ({
  ...initialState,
  select: (id) => set({ selectedId: id }),
  updateTube: (id, props) =>
    set((state) => ({
      tubes: state.tubes.map((t) => (t.id === id ? { ...t, ...props } : t)),
    })),
  addTube: () =>
    set((state) => ({
      tubes: [
        ...state.tubes,
        {
          id: Math.random().toString(36).substr(2, 9),
          position: [0, 2, 0],
          rotation: [0, 0, 0],
          width: 2,
          height: 2,
          length: 5,
          thickness: 0.2,
        },
      ],
    })),
}));
