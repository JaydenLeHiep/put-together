import { useAuth } from "../hooks/useAuth";
export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  const userName = isAuthenticated ? user?.userName : "no username";

  return <div>Home: Hello {userName}</div>;
}
