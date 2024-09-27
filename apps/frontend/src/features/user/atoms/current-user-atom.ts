import { atomWithStorage } from "jotai/utils";
import {ICurrentUser} from "../types/user.types";


export const currentUserAtom = atomWithStorage<ICurrentUser | null>(
  "currentUser",
  null
);
