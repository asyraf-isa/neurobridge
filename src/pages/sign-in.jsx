import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BrandLogo from "@/components/common/BrandLogo.jsx";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { authenticate, DEMO_ACCOUNTS, getSession, setSession } from "@/lib/auth.js";
import { cn } from "@/lib/utils";

const DEMO_TILE = { employee: "bg-tint-indigo", employer: "bg-tint-teal" };

// Sign In (design: "Sign In.dc.html"). A frosted-glass card on a soft indigo
// wash. The demo picker fills a hard-coded account from lib/auth.js; the form
// still authenticates through `authenticate()` like any other sign-in.
function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState({ message: "", field: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Already signed in? Skip the form and open that account's portal.
  const session = getSession();
  if (session) return <Navigate to={session.home} replace />;

  const clearError = () => setError({ message: "", field: null });

  function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    if (!identifier.trim()) return setError({ message: "Enter your username or work email.", field: "identifier" });
    if (!password) return setError({ message: "Enter your password.", field: "password" });

    const account = authenticate(identifier, password);
    if (!account) return setError({ message: "That username or password doesn't match.", field: "password" });

    setLoading(true);
    setTimeout(() => {
      setSession(account);
      navigate(account.home, { replace: true });
    }, 600);
  }

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-canvas px-5 pt-12 pb-24 text-ink">
      {/* Backdrop: indigo wash + three soft glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-135 from-canvas via-tint-indigo-soft/60 to-tint-violet" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-45 -left-35 size-155 rounded-full bg-radial from-tertiary/22 to-transparent to-70% blur-xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -bottom-55 size-170 rounded-full bg-radial from-glow-violet/18 to-transparent to-70% blur-xl" />
      <div aria-hidden="true" className="pointer-events-none absolute top-[30%] right-[12%] size-90 rounded-full bg-radial from-tertiary-soft/35 to-transparent to-70% blur-lg" />

      <div className="relative z-10 flex w-full max-w-auth flex-col gap-[1.375rem]">
        <div className="flex items-center justify-center gap-3.5">
          <BrandLogo variant="bridge" />
          <span className="text-[2.125rem] font-extrabold tracking-[-0.02em]">NeuroBridge</span>
        </div>
        <p className="mx-auto -mt-2 max-w-95 text-center text-body-sm text-ink-soft">
          Workplace support for neurodivergent employees and their managers. You choose what to share.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-[1.125rem] rounded-card border border-on-primary/75 bg-on-primary/62 px-[2.125rem] pt-[2.125rem] pb-[1.875rem] shadow-glass backdrop-blur-[22px] backdrop-saturate-140 max-sm:px-6"
        >
          <div className="flex flex-col gap-1.5 text-center">
            <h1 className="m-0 text-headline-lg">Welcome</h1>
            <span className="text-body-lg font-normal text-slate">Sign in to your account.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="identifier" className="text-label-lg">
              Username or work email
            </label>
            <div className="relative flex">
              <Icon name="mail" fill className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[22px] text-slate" />
              <Input
                id="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  clearError();
                }}
                placeholder="Enter your email"
                aria-invalid={error.field === "identifier" || undefined}
                className="h-[3.25rem] pl-12 text-[1.125rem]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-label-lg">
              Password
            </label>
            <div className="relative flex">
              <Icon name="lock" fill className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[22px] text-slate" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearError();
                }}
                placeholder="Enter your password"
                aria-invalid={error.field === "password" || undefined}
                className="h-[3.25rem] pr-14 pl-12 text-[1.125rem]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1.5 right-1.5 grid size-10 cursor-pointer place-items-center rounded-lg text-slate transition-colors hover:bg-fill"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-[22px]" />
              </button>
            </div>
          </div>

          {error.message ? (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-[0.875rem] bg-tint-indigo-soft px-3.5 py-3 text-body-md text-indigo-ink"
            >
              <Icon name="info" className="text-[20px] text-primary" />
              {error.message}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-body-md">
              <Checkbox
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
                className="size-[1.375rem] rounded-[0.4375rem] border-[1.5px] border-muted-border bg-surface-container-lowest after:hidden data-checked:border-primary data-checked:bg-primary [&_svg]:size-4"
              />
              Keep me signed in
            </label>
            <button
              type="button"
              onClick={() => toast.info("Password recovery isn't available in this demo.")}
              className="cursor-pointer text-label-lg text-primary hover:text-primary-hover"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" variant="dark" size="xl" disabled={loading} className="disabled:opacity-70">
            {loading ? "Signing in…" : "Sign In"}
            <Icon name="arrow_forward" className="text-[22px]" />
          </Button>
        </form>

        <div className="flex flex-col gap-2.5 rounded-3xl border-[1.5px] border-dashed border-tertiary/35 bg-on-primary/35 px-[1.125rem] py-4 backdrop-blur-[14px]">
          <span className="text-body-sm text-ink-soft">Demo: pick an account to fill in its details.</span>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => {
                  setIdentifier(account.email);
                  setPassword(account.password);
                  clearError();
                }}
                className={cn(
                  "flex min-h-[3.25rem] flex-[1_1_10.625rem] cursor-pointer items-center gap-2.5 rounded-2xl border-[1.5px] bg-surface-container-lowest px-3 py-2 text-left transition-colors hover:border-tertiary-soft",
                  identifier === account.email ? "border-tertiary" : "border-divider",
                )}
              >
                <span className={cn("grid size-[2.125rem] shrink-0 place-items-center rounded-full text-[0.875rem] font-extrabold", DEMO_TILE[account.role])}>
                  {account.initials}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-body-md font-extrabold">{account.name}</span>
                  <span className="text-[0.875rem] font-semibold text-slate">{account.portal}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <span className="flex items-start justify-center gap-1.5 text-center text-body-sm text-slate">
          <Icon name="lock" fill className="mt-0.5 text-[16px]" />
          Employers only see what each employee chooses to share.
        </span>
      </div>

      <footer className="absolute right-0 bottom-6 left-0 z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-5 text-body-sm text-slate">
        <span>© NeuroBridge 2026</span>
        <span aria-hidden="true" className="size-1 rounded-full bg-muted-border" />
        <button
          type="button"
          onClick={() => toast.info("The privacy notice isn't available in this demo.")}
          className="cursor-pointer font-bold text-ink-soft hover:text-primary"
        >
          Privacy Notice
        </button>
      </footer>
    </div>
  );
}

export default SignIn;
