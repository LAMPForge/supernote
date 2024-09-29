import { atom } from "jotai";
import { SpaceTreeNode } from '../types.ts';

export const treeDataAtom = atom<SpaceTreeNode[]>([]);
