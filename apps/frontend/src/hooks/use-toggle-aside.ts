import { useAtom } from "jotai";
import { asideStateAtom } from '../components/layouts/global/atoms/sidebar-atom.ts';

const useToggleAside = () => {
  const [asideState, setAsideState] = useAtom(asideStateAtom);

  const toggleAside = (tab: string) => {
    if (asideState.tab === tab) {
      setAsideState({ tab, isAsideOpen: !asideState.isAsideOpen });
    } else {
      setAsideState({ tab, isAsideOpen: true });
    }
  };

  return toggleAside;
};

export default useToggleAside;
