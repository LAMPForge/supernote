import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SetupWorkspaceForm from '../../features/auth/components/setup-workspace-form';
import { useWorkspacePublicDataQuery } from '../../features/workspace/queries/workspace-query';

export default function SetupWorkspace() {
  const {
    data: workspace,
    isLoading,
    isError,
    error,
  } = useWorkspacePublicDataQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isError && workspace) {
      navigate("/");
    }
  }, [isLoading, isError, workspace]);

  if (isLoading) {
    return <></>;
  }

  if (
    isError &&
    error?.["response"]?.status === 404 &&
    error?.["response"]?.data.message.includes("Workspace not found")
  ) {
    return (
      <>
        <Helmet>
          <title>Setup Workspace - SuperNote</title>
        </Helmet>
        <SetupWorkspaceForm />
      </>
    );
  }

  return null;
}