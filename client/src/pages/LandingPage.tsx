import { useAuthActions } from "../hooks/useAuthActions";

function LandingPage() {
  const { handleGoogleLogin } = useAuthActions();

  return (
    <div>
      <button onClick={handleGoogleLogin}>Google Sign Up</button>
    </div>
  );
}

export default LandingPage;
