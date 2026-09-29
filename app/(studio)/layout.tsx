import { StudioProvider } from "@/components/StudioProvider";

/** Studio routes only — loads catalog / DSA. Landing stays outside this provider. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioProvider>{children}</StudioProvider>;
}
