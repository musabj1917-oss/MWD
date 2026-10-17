import { PageHeader } from '@/components/admin/ui';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader kicker="Portfolio" title="Add project" subtitle="Upload photos first, then fill in the details. You can save it as a draft and publish later." />
      <ProjectForm />
    </div>
  );
}
