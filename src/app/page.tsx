import { AppShell } from "@/components/AppShell";
import { ExperienceProvider } from "@/components/experience/ExperienceProvider";

export default function HomePage() {
  return (
    <ExperienceProvider>
      <AppShell />
    </ExperienceProvider>
  );
}
