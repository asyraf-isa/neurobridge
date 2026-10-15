import { useNavigate } from "react-router-dom";
import PagePlaceholder from "@/components/common/PagePlaceholder.jsx";

function NotFound() {
  const navigate = useNavigate();

  return (
    <PagePlaceholder
      title="Page not found"
      description="The page you were looking for doesn’t exist or has moved."
    >
      <button
        type="button"
        onClick={() => navigate("/employee")}
        className="mt-2 w-fit cursor-pointer font-label-lg text-label-lg text-primary underline underline-offset-4 transition-colors hover:text-primary-container"
      >
        Back to the employee dashboard
      </button>
    </PagePlaceholder>
  );
}

export default NotFound;
