'use client';

import React from 'react';
import InteractiveCanvasFlowchart from './InteractiveCanvasFlowchart';

interface ProjectFlowchartProps {
  projectId: string;
  isAdmin?: boolean;
  onRequireAdminLogin?: () => void;
  onLogout?: () => void;
}

export default function ProjectFlowchart({
  projectId,
  isAdmin = false,
  onRequireAdminLogin,
  onLogout,
}: ProjectFlowchartProps) {
  return (
    <InteractiveCanvasFlowchart
      projectId={projectId}
      isAdmin={isAdmin}
      onRequireAdminLogin={onRequireAdminLogin}
      onLogout={onLogout}
    />
  );
}
