import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAtom} from "jotai/react/useAtom";
import {currentUserAtom} from "../../user/atoms/current-user-atom.ts";

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [_, setCurrentUser] = useAtom(currentUserAtom);
}
